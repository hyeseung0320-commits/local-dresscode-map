"use server";

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MOOD_OPTIONS, SEASON_OPTIONS, moodsToString } from "@/lib/places";

// 업로드된 이미지를 public/uploads/ 에 저장하고 공개 경로를 돌려준다.
// 저장소를 나중에 S3 등으로 바꿀 때 이 함수만 교체하면 된다.
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

async function saveUploadedImage(
  file: File
): Promise<{ url?: string; error?: string }> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: "이미지 파일(jpg, png, webp, gif)만 올릴 수 있어요." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "사진은 5MB 이하만 올릴 수 있어요." };
  }

  const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), bytes);

  return { url: `/uploads/${filename}` };
}

export type CreatePlaceState = { error?: string };

// 장소 등록 (폼 제출 -> SQLite 저장)
export async function createPlace(
  _prevState: CreatePlaceState,
  formData: FormData
): Promise<CreatePlaceState> {
  const name = String(formData.get("name") ?? "").trim();
  const neighborhood = String(formData.get("neighborhood") ?? "").trim();
  const dresscode = String(formData.get("dresscode") ?? "").trim();

  // 체크된 분위기 태그만 추리고, 허용된 값인지 검증
  const moods = formData
    .getAll("moods")
    .map((m) => String(m))
    .filter((m) => (MOOD_OPTIONS as readonly string[]).includes(m));

  // 서버 측 검증
  if (!name) return { error: "장소명을 입력해 주세요." };
  if (!neighborhood) return { error: "동네를 입력해 주세요." };
  if (moods.length === 0) return { error: "분위기 태그를 하나 이상 선택해 주세요." };
  if (!dresscode) return { error: "추천 옷차림을 입력해 주세요." };

  await prisma.place.create({
    data: {
      name,
      neighborhood,
      moods: moodsToString(moods),
      dresscode,
    },
  });

  revalidatePath("/");
  redirect("/");
}

export type CreateReportState = { error?: string; ok?: boolean };

// "여기 갈 때 이렇게 입었어요" 제보 등록
export async function createReport(
  _prevState: CreateReportState,
  formData: FormData
): Promise<CreateReportState> {
  const placeId = Number(formData.get("placeId"));
  const nickname = String(formData.get("nickname") ?? "").trim();
  const outfit = String(formData.get("outfit") ?? "").trim();
  const season = String(formData.get("season") ?? "").trim();

  // 서버 측 검증
  if (!Number.isInteger(placeId)) return { error: "잘못된 장소입니다." };
  if (!nickname) return { error: "닉네임을 입력해 주세요." };
  if (!outfit) return { error: "어떻게 입었는지 적어 주세요." };
  if (!(SEASON_OPTIONS as readonly string[]).includes(season))
    return { error: "방문 계절을 선택해 주세요." };

  // 장소가 실제로 있는지 확인
  const place = await prisma.place.findUnique({ where: { id: placeId } });
  if (!place) return { error: "존재하지 않는 장소입니다." };

  // 사진(선택) 처리
  let photo: string | null = null;
  const photoFile = formData.get("photo");
  if (photoFile instanceof File && photoFile.size > 0) {
    const saved = await saveUploadedImage(photoFile);
    if (saved.error) return { error: saved.error };
    photo = saved.url ?? null;
  }

  await prisma.report.create({
    data: { placeId, nickname, outfit, season, photo },
  });

  revalidatePath(`/places/${placeId}`);
  return { ok: true };
}

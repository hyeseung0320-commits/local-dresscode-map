"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MOOD_OPTIONS, moodsToString } from "@/lib/places";

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

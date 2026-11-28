import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { moodsToArray } from "@/lib/places";
import { MoodBadge } from "@/components/MoodBadge";
import { ReportForm } from "./ReportForm";

function formatDate(d: Date) {
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}`;
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const placeId = Number(id);

  if (!Number.isInteger(placeId)) notFound();

  const place = await prisma.place.findUnique({
    where: { id: placeId },
    include: {
      reports: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!place) notFound();

  const moods = moodsToArray(place.moods);

  return (
    <div className="max-w-xl mx-auto">
      <Link
        href="/"
        className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        ← 목록으로
      </Link>

      {/* 장소 정보 */}
      <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{place.name}</h1>
          <span className="text-sm text-neutral-400 shrink-0">
            📍 {place.neighborhood}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {moods.map((mood) => (
            <MoodBadge key={mood} mood={mood} />
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-neutral-500 mb-1.5">
            추천 옷차림
          </h2>
          <p className="text-neutral-800 whitespace-pre-wrap leading-relaxed">
            {place.dresscode}
          </p>
        </div>

        <p className="mt-6 text-xs text-neutral-400">
          등록일 {formatDate(new Date(place.createdAt))}
        </p>
      </div>

      {/* 제보 목록: "여기 갈 때 이렇게 입었어요" */}
      <section className="mt-8">
        <h2 className="text-lg font-bold tracking-tight">
          이렇게 입었어요{" "}
          <span className="text-neutral-400 font-normal text-base">
            {place.reports.length}
          </span>
        </h2>

        {place.reports.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">
            아직 제보가 없어요. 첫 번째로 옷차림을 공유해 주세요!
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {place.reports.map((report) => (
              <li
                key={report.id}
                className="rounded-xl border border-neutral-200 bg-white p-4"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-sm">
                    {report.nickname}
                  </span>
                  <span className="text-xs text-neutral-400 shrink-0">
                    {report.season} · {formatDate(new Date(report.createdAt))}
                  </span>
                </div>
                <p className="text-sm text-neutral-700 mt-2 whitespace-pre-wrap">
                  {report.outfit}
                </p>
                {report.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={report.photo}
                    alt={`${report.nickname}님의 옷차림`}
                    className="mt-3 rounded-lg max-h-72 w-auto object-cover border border-neutral-200"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 제보 작성 폼 */}
      <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-base font-bold mb-4">나도 제보하기</h2>
        <ReportForm placeId={place.id} />
      </section>
    </div>
  );
}

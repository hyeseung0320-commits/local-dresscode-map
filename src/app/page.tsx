import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { moodsToArray, MOOD_OPTIONS } from "@/lib/places";
import { MoodBadge } from "@/components/MoodBadge";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ mood?: string }>;
}) {
  const { mood } = await searchParams;

  // 유효한 분위기 태그일 때만 필터 적용
  const activeMood =
    mood && (MOOD_OPTIONS as readonly string[]).includes(mood) ? mood : null;

  const places = await prisma.place.findMany({
    where: activeMood ? { moods: { contains: activeMood } } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          우리 동네 데이트 장소
        </h1>
        <p className="text-neutral-500 mt-1 text-sm">
          동네별 데이트 장소의 분위기와 추천 옷차림을 기록해요.
        </p>
      </div>

      {/* 분위기별 필터 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/"
          className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
            activeMood === null
              ? "bg-neutral-900 border-neutral-900 text-white"
              : "bg-white border-neutral-300 hover:border-neutral-500"
          }`}
        >
          전체
        </Link>
        {MOOD_OPTIONS.map((m) => (
          <Link
            key={m}
            href={`/?mood=${encodeURIComponent(m)}`}
            className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
              activeMood === m
                ? "bg-pink-500 border-pink-500 text-white"
                : "bg-white border-neutral-300 hover:border-pink-400"
            }`}
          >
            {m}
          </Link>
        ))}
      </div>

      {places.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center">
          <p className="text-neutral-500">
            {activeMood
              ? `'${activeMood}' 분위기의 장소가 아직 없어요.`
              : "아직 등록된 장소가 없어요."}
          </p>
          <Link
            href="/places/new"
            className="inline-block mt-4 text-sm font-medium px-4 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-700 transition-colors"
          >
            장소 등록하기
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {places.map((place) => {
            const moods = moodsToArray(place.moods);
            return (
              <li key={place.id}>
                <Link
                  href={`/places/${place.id}`}
                  className="block h-full rounded-2xl border border-neutral-200 bg-white p-5 hover:border-neutral-400 hover:shadow-sm transition-all"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="font-semibold text-lg">{place.name}</h2>
                    <span className="text-xs text-neutral-400 shrink-0">
                      {place.neighborhood}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {moods.map((m) => (
                      <MoodBadge key={m} mood={m} />
                    ))}
                  </div>
                  <p className="text-sm text-neutral-600 mt-3 line-clamp-2">
                    👗 {place.dresscode}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

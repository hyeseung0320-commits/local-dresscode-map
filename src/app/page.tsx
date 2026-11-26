import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { moodsToArray } from "@/lib/places";
import { MoodBadge } from "@/components/MoodBadge";

export default async function HomePage() {
  const places = await prisma.place.findMany({
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

      {places.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center">
          <p className="text-neutral-500">아직 등록된 장소가 없어요.</p>
          <Link
            href="/places/new"
            className="inline-block mt-4 text-sm font-medium px-4 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-700 transition-colors"
          >
            첫 장소 등록하기
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
                    {moods.map((mood) => (
                      <MoodBadge key={mood} mood={mood} />
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

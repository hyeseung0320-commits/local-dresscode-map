import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { moodsToArray } from "@/lib/places";
import { MoodBadge } from "@/components/MoodBadge";

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
  });

  if (!place) notFound();

  const moods = moodsToArray(place.moods);
  const created = new Date(place.createdAt);
  const createdText = `${created.getFullYear()}. ${
    created.getMonth() + 1
  }. ${created.getDate()}`;

  return (
    <div className="max-w-xl mx-auto">
      <Link
        href="/"
        className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        ← 목록으로
      </Link>

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

        <p className="mt-6 text-xs text-neutral-400">등록일 {createdText}</p>
      </div>
    </div>
  );
}

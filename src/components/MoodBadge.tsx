export function MoodBadge({ mood }: { mood: string }) {
  return (
    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-pink-100 text-pink-700">
      {mood}
    </span>
  );
}

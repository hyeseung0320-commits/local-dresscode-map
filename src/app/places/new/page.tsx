import Link from "next/link";
import { PlaceForm } from "./PlaceForm";

export default function NewPlacePage() {
  return (
    <div className="max-w-xl mx-auto">
      <Link
        href="/"
        className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        ← 목록으로
      </Link>
      <h1 className="text-2xl font-bold tracking-tight mt-3 mb-6">
        장소 등록
      </h1>
      <PlaceForm />
    </div>
  );
}

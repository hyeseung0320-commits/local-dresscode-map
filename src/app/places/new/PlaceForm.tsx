"use client";

import { useActionState } from "react";
import { createPlace, type CreatePlaceState } from "@/app/actions";
import { MOOD_OPTIONS } from "@/lib/places";

const initialState: CreatePlaceState = {};

export function PlaceForm() {
  const [state, formAction, pending] = useActionState(
    createPlace,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      {/* 장소명 */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1.5">
          장소명
        </label>
        <input
          id="name"
          name="name"
          type="text"
          maxLength={60}
          placeholder="예: 성수동 루프탑 카페"
          className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-neutral-900 transition-colors"
        />
      </div>

      {/* 동네 */}
      <div>
        <label
          htmlFor="neighborhood"
          className="block text-sm font-medium mb-1.5"
        >
          동네
        </label>
        <input
          id="neighborhood"
          name="neighborhood"
          type="text"
          maxLength={40}
          placeholder="예: 성수동"
          className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-neutral-900 transition-colors"
        />
      </div>

      {/* 분위기 태그 (다중 선택) */}
      <div>
        <span className="block text-sm font-medium mb-2">분위기 태그</span>
        <div className="flex flex-wrap gap-2">
          {MOOD_OPTIONS.map((mood) => (
            <label
              key={mood}
              className="cursor-pointer select-none text-sm px-3 py-1.5 rounded-full border border-neutral-300 bg-white has-[:checked]:bg-pink-100 has-[:checked]:border-pink-400 has-[:checked]:text-pink-700 transition-colors"
            >
              <input
                type="checkbox"
                name="moods"
                value={mood}
                className="sr-only"
              />
              {mood}
            </label>
          ))}
        </div>
      </div>

      {/* 추천 옷차림 */}
      <div>
        <label htmlFor="dresscode" className="block text-sm font-medium mb-1.5">
          추천 옷차림
        </label>
        <textarea
          id="dresscode"
          name="dresscode"
          rows={4}
          maxLength={300}
          placeholder="예: 깔끔한 세미 캐주얼. 루프탑이라 바람이 불 수 있으니 얇은 겉옷 추천!"
          className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-neutral-900 transition-colors resize-none"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-neutral-900 text-white font-medium py-3 hover:bg-neutral-700 transition-colors disabled:opacity-50"
      >
        {pending ? "등록 중..." : "장소 등록하기"}
      </button>
    </form>
  );
}

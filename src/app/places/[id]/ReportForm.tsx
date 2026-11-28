"use client";

import { useActionState, useEffect, useRef } from "react";
import { createReport, type CreateReportState } from "@/app/actions";
import { SEASON_OPTIONS } from "@/lib/places";

const initialState: CreateReportState = {};

export function ReportForm({ placeId }: { placeId: number }) {
  const [state, formAction, pending] = useActionState(
    createReport,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  // 제보 성공 시 폼 비우기
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="placeId" value={placeId} />

      <div>
        <label htmlFor="nickname" className="block text-sm font-medium mb-1.5">
          닉네임
        </label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          maxLength={20}
          placeholder="예: 데이트러버"
          className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-neutral-900 transition-colors"
        />
      </div>

      <div>
        <span className="block text-sm font-medium mb-2">방문 계절</span>
        <div className="flex flex-wrap gap-2">
          {SEASON_OPTIONS.map((season) => (
            <label
              key={season}
              className="cursor-pointer select-none text-sm px-3 py-1.5 rounded-full border border-neutral-300 bg-white has-[:checked]:bg-neutral-900 has-[:checked]:border-neutral-900 has-[:checked]:text-white transition-colors"
            >
              <input
                type="radio"
                name="season"
                value={season}
                className="sr-only"
              />
              {season}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="outfit" className="block text-sm font-medium mb-1.5">
          이렇게 입었어요
        </label>
        <textarea
          id="outfit"
          name="outfit"
          rows={3}
          maxLength={300}
          placeholder="예: 니트 원피스에 로퍼 신고 갔는데 분위기랑 잘 어울렸어요!"
          className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-neutral-900 transition-colors resize-none"
        />
      </div>

      <div>
        <label htmlFor="photo" className="block text-sm font-medium mb-1.5">
          옷차림 사진 <span className="text-neutral-400 font-normal">(선택)</span>
        </label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          className="w-full text-sm text-neutral-600 file:mr-3 file:rounded-full file:border-0 file:bg-neutral-900 file:text-white file:px-4 file:py-2 file:text-sm file:cursor-pointer hover:file:bg-neutral-700"
        />
        <p className="text-xs text-neutral-400 mt-1">jpg, png, webp · 5MB 이하</p>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.ok && (
        <p className="text-sm text-green-600">제보 감사해요! 등록됐어요 🙌</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-neutral-900 text-white font-medium py-2.5 hover:bg-neutral-700 transition-colors disabled:opacity-50"
      >
        {pending ? "등록 중..." : "제보 남기기"}
      </button>
    </form>
  );
}

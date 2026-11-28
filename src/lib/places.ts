// 분위기 태그 선택지 (등록 폼에서 다중 선택)
export const MOOD_OPTIONS = [
  "캐주얼",
  "로맨틱",
  "분위기있는",
  "활동적인",
  "고급스러운",
  "아늑한",
  "트렌디",
] as const;

export type Mood = (typeof MOOD_OPTIONS)[number];

// 제보 시 선택하는 방문 계절
export const SEASON_OPTIONS = ["봄", "여름", "가을", "겨울"] as const;
export type Season = (typeof SEASON_OPTIONS)[number];

// DB에는 콤마 문자열로 저장하므로, 저장/조회 시 변환해서 쓴다.
export function moodsToString(moods: string[]): string {
  return moods.join(",");
}

export function moodsToArray(moods: string): string[] {
  return moods
    .split(",")
    .map((m) => m.trim())
    .filter((m) => m.length > 0);
}

export const POPULAR_SPOTS: Record<"Seoul" | "Busan", string[]> = {
  Seoul: ["Seongsu-dong", "Hongdae", "Seochon", "Jamsil"],
  Busan: ["Haeundae", "Gwangalli", "Seomyeon", "Yeongdo"],
};

// ponytail: no district-search API yet; static list mirrors the Figma search mock (the
// "Seong" query demo, node 340:4584) plus the popular spots so typing has something to
// filter. Real source: Seoul/Busan administrative districts, sorted abc, capped at 6.
const SEARCHABLE_PLACES = [
  ...POPULAR_SPOTS.Seoul,
  ...POPULAR_SPOTS.Busan,
  "Seongbuk-dong",
  "Seongnae-dong",
  "Seongsan-dong",
  "Seongsu-dong 1-ga",
  "Seongsu-dong 2-ga",
  "Seongdong-gu",
];

export function searchPlaces(query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return SEARCHABLE_PLACES.filter((place) => place.toLowerCase().startsWith(q))
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 6);
}

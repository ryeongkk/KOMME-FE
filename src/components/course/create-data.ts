export const POPULAR_SPOTS: Record<"Seoul" | "Busan", string[]> = {
  Seoul: ["Seongsu-dong", "Hongdae", "Seochon", "Jamsil"],
  Busan: ["Haeundae", "Gwangalli", "Seomyeon", "Yeongdo"],
};

// Figma nodes 352:7394 / 352:7460 — step 2 of Create Course (select topics).
export const TOPICS = ["Food", "Healing", "Exploration"] as const;

// Figma nodes 352:7529 / 354:8127 / 357:8751 — step 3 of Create Course
// (spot count + visit date; the date bottom sheet itself is ui/visit-date-picker.tsx).
export const SPOT_COUNTS = ["2 spots", "3 spots", "4+ spots"] as const;

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

// Naver Reverse Geocoding returns Korean gu names (area1 = city, area2 = gu) — this app
// is English-only, so translate rather than show Korean. Static maps instead of a
// translation API: Seoul/Busan gu names are a small, fixed set, and some gu names
// (e.g. 중구, 강서구) exist in both cities, so each city gets its own table.
const SEOUL_GU_EN: Record<string, string> = {
  종로구: "Jongno-gu",
  중구: "Jung-gu",
  용산구: "Yongsan-gu",
  성동구: "Seongdong-gu",
  광진구: "Gwangjin-gu",
  동대문구: "Dongdaemun-gu",
  중랑구: "Jungnang-gu",
  성북구: "Seongbuk-gu",
  강북구: "Gangbuk-gu",
  도봉구: "Dobong-gu",
  노원구: "Nowon-gu",
  은평구: "Eunpyeong-gu",
  서대문구: "Seodaemun-gu",
  마포구: "Mapo-gu",
  양천구: "Yangcheon-gu",
  강서구: "Gangseo-gu",
  구로구: "Guro-gu",
  금천구: "Geumcheon-gu",
  영등포구: "Yeongdeungpo-gu",
  동작구: "Dongjak-gu",
  관악구: "Gwanak-gu",
  서초구: "Seocho-gu",
  강남구: "Gangnam-gu",
  송파구: "Songpa-gu",
  강동구: "Gangdong-gu",
};

const BUSAN_GU_EN: Record<string, string> = {
  중구: "Jung-gu",
  서구: "Seo-gu",
  동구: "Dong-gu",
  영도구: "Yeongdo-gu",
  부산진구: "Busanjin-gu",
  동래구: "Dongnae-gu",
  남구: "Nam-gu",
  북구: "Buk-gu",
  해운대구: "Haeundae-gu",
  사하구: "Saha-gu",
  금정구: "Geumjeong-gu",
  강서구: "Gangseo-gu",
  연제구: "Yeonje-gu",
  수영구: "Suyeong-gu",
  사상구: "Sasang-gu",
  기장군: "Gijang-gun",
};

/**
 * Translates a Naver reverse-geocode result (Korean city + gu name) into the English
 * "Gu, City" label this app displays. Returns null when the coordinates fall outside
 * Seoul/Busan (the only cities this screen supports) or the gu isn't in our table.
 */
export function translateDistrict(cityKo: string, guKo: string): string | null {
  if (cityKo === "서울특별시") {
    const en = SEOUL_GU_EN[guKo];
    return en ? `${en}, Seoul` : null;
  }
  if (cityKo === "부산광역시") {
    const en = BUSAN_GU_EN[guKo];
    return en ? `${en}, Busan` : null;
  }
  return null;
}

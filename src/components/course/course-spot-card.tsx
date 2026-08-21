import type { CourseSpot } from "@/lib/api/course";

// Course API 스팟은 Spot 도메인(ui/spot-card.tsx가 쓰는 saves/hours/address/phone)과 무관한
// 별개 응답이라 name/thumbnailUrl만 있음 — 그래서 ui/spot-card.tsx를 재사용하지 않고 이 카드를
// 따로 둠. spotId도 spots/data.ts의 정적 id와 안 맞아서 /spots/[id]로 링크하지 않음.
export function CourseSpotCard({ spot }: { spot: CourseSpot }) {
  return (
    <div className="flex w-full items-center gap-3">
      {/* ponytail: no photo API yet, swap for real photos when thumbnailUrl is populated */}
      <div className="size-24 shrink-0 rounded-[4.8px] bg-gray-100" />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="w-full text-body-sb-14 text-black">{spot.name}</p>
      </div>
    </div>
  );
}

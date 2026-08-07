"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon, DeleteIcon, MapIcon } from "@/components/icons";
import { SPOTS, type Spot } from "@/components/spots/data";
import { SpotCard } from "@/components/ui/spot-card";

type CourseStop = {
  spot: Spot;
  distanceToNextKm: number | null;
};

// ponytail: no course-detail API yet, static stub — reuses the same spot 3x to match
// the Figma mock. distanceToNextKm is the gap between stops on this course, unrelated
// to each spot's own distanceKm (distance from the user's current location).
const COURSE_STOPS: CourseStop[] = [
  { spot: SPOTS[0], distanceToNextKm: 1.4 },
  { spot: SPOTS[0], distanceToNextKm: 2.8 },
  { spot: SPOTS[0], distanceToNextKm: null },
];

export function CourseDetailScreen() {
  const router = useRouter();

  return (
    <>
      <div className="flex w-full items-center justify-between px-4 py-2.5">
        <button type="button" aria-label="Back" onClick={() => router.back()} className="flex-1 text-black">
          <ArrowLeftIcon className="size-6" />
        </button>
        <p className="flex-1 text-center text-body-sb-16 text-black">Course name</p>
        <div className="flex flex-1 items-center justify-end gap-2.5">
          {/* ponytail: no map/delete actions wired up yet, no course-detail API to act on */}
          <button type="button" aria-label="View on map" className="text-black">
            <MapIcon className="size-6" />
          </button>
          <button type="button" aria-label="Delete course" className="text-black">
            <DeleteIcon className="size-6" />
          </button>
        </div>
      </div>

      <div className="relative flex w-full flex-col gap-3 px-4 py-5">
        <div className="absolute top-5 bottom-5 left-[32px] border-l border-dashed border-gray-200" />
        {COURSE_STOPS.map((stop, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="flex w-full items-center gap-[27px] pl-[11px]">
              <div className="relative z-10 size-2.5 shrink-0 rounded-full bg-secondary-300" />
              <SpotCard spot={stop.spot} />
            </div>
            {stop.distanceToNextKm !== null && (
              <p className="pl-[53px] text-caption-m-12 text-gray-500">{stop.distanceToNextKm}km</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

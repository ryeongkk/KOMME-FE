import Link from "next/link";
import { ClockIcon, SaveSmIcon } from "@/components/icons";
import type { Spot } from "@/components/spots/data";

export function SpotCard({ spot }: { spot: Spot }) {
  return (
    <Link href={`/spots/${spot.id}`} className="flex w-full items-center gap-3">
      {/* ponytail: no photo API yet, swap for real photos when it exists */}
      <div className="size-24 shrink-0 rounded-[4.8px] bg-gray-100" />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="w-full text-caption-m-12 text-gray-500">{spot.region}</p>
        <p className="w-full text-body-sb-14 text-black">{spot.name}</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            <SaveSmIcon className="size-4 text-secondary-300" />
            <p className="text-caption-m-12 text-gray-500">{spot.saves}</p>
          </div>
          <span className="text-caption-m-12 text-gray-500">|</span>
          <p className="text-caption-m-12 text-gray-500">{spot.distanceKm}km</p>
        </div>
        <div className="flex items-center gap-0.5">
          <ClockIcon className="size-4 text-gray-500" />
          <p className="text-caption-m-12 text-gray-500">{spot.hours}</p>
        </div>
      </div>
    </Link>
  );
}

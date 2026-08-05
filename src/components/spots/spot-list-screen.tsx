"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon, ClockIcon, SaveSmIcon } from "@/components/icons";
import { SPOTS, TOPICS, type Spot } from "./data";

const FILTERS = ["Most Popular", "All", ...TOPICS] as const;
type Filter = (typeof FILTERS)[number];

// the Figma mock lists each spot twice
const LISTED_SPOTS = [...SPOTS, ...SPOTS];

function filterSpots(filter: Filter): Spot[] {
  if (filter === "Most Popular") return [...LISTED_SPOTS].sort((a, b) => b.saves - a.saves);
  if (filter === "All") return LISTED_SPOTS;
  return LISTED_SPOTS.filter((spot) => spot.topic === filter);
}

export function SpotListScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("Most Popular");

  return (
    <>
      <div className="flex w-full items-center justify-between px-4 py-2.5">
        <button type="button" aria-label="Back" onClick={() => router.back()} className="flex-1 text-black">
          <ArrowLeftIcon className="size-6" />
        </button>
        <p className="flex-1 text-center text-body-sb-16 text-black">Tourist spot</p>
        <div className="flex-1" />
      </div>

      <div className="mt-4 flex w-full flex-col gap-3 px-4">
        <div className="flex w-full items-center gap-1.5 overflow-x-auto">
          {FILTERS.map((option) => {
            const selected = option === filter;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(option)}
                className={`shrink-0 rounded-full border p-2 text-caption-sb-12 whitespace-nowrap ${
                  selected
                    ? "border-secondary-300 bg-secondary-100 text-secondary-300"
                    : "border-gray-200 bg-white text-gray-600"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="flex w-full flex-col gap-3">
          {filterSpots(filter).map((spot, i) => (
            <SpotCard key={`${spot.id}-${i}`} spot={spot} />
          ))}
        </div>
      </div>
    </>
  );
}

function SpotCard({ spot }: { spot: Spot }) {
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

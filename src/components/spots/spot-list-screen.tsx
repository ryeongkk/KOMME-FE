"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon, ClockIcon, SaveSmIcon } from "@/components/icons";

const TOPICS = [
  "Korean Spa/Sauna",
  "Traditional Market",
  "Chimaek",
  "Convenience Store",
  "K-Culture",
  "Hiking/Walking",
] as const;

const FILTERS = ["Most Popular", "All", ...TOPICS] as const;
type Filter = (typeof FILTERS)[number];

type Spot = {
  region: string;
  name: string;
  saves: number;
  distanceKm: number;
  hours: string;
  topic: (typeof TOPICS)[number];
};

// ponytail: no spot API yet, static data mirrors the Figma mock (3 spots, listed twice)
const SPOTS: Spot[] = [
  { region: "Seoul Mapo", name: "The Park Spa Land", saves: 4, distanceKm: 2.8, hours: "10:00~23:00", topic: "Korean Spa/Sauna" },
  { region: "Seoul Gangnam", name: "Moclock Gangnam Main Branch | Head Spa", saves: 6, distanceKm: 3.1, hours: "10:00~23:00", topic: "Korean Spa/Sauna" },
  { region: "Seoul Dongdaemun", name: "Sparex Dongdaemun", saves: 4, distanceKm: 2.8, hours: "10:00~23:00", topic: "Korean Spa/Sauna" },
  { region: "Seoul Mapo", name: "The Park Spa Land", saves: 4, distanceKm: 2.8, hours: "10:00~23:00", topic: "Korean Spa/Sauna" },
  { region: "Seoul Gangnam", name: "Moclock Gangnam Main Branch | Head Spa", saves: 6, distanceKm: 3.1, hours: "10:00~23:00", topic: "Korean Spa/Sauna" },
  { region: "Seoul Dongdaemun", name: "Sparex Dongdaemun", saves: 4, distanceKm: 2.8, hours: "10:00~23:00", topic: "Korean Spa/Sauna" },
];

function filterSpots(filter: Filter): Spot[] {
  if (filter === "Most Popular") return [...SPOTS].sort((a, b) => b.saves - a.saves);
  if (filter === "All") return SPOTS;
  return SPOTS.filter((spot) => spot.topic === filter);
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
            <SpotCard key={`${spot.name}-${i}`} spot={spot} />
          ))}
        </div>
      </div>
    </>
  );
}

function SpotCard({ spot }: { spot: Spot }) {
  return (
    <div className="flex w-full items-center gap-3">
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
    </div>
  );
}

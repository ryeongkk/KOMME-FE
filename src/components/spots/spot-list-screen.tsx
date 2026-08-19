"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { ArrowDownIcon, ArrowLeftIcon, CheckIcon } from "@/components/icons";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { SpotCard } from "@/components/ui/spot-card";
import { SPOTS, TOPICS, type Spot, type Topic } from "./data";

const TOPIC_FILTERS = ["All", ...TOPICS] as const;
type TopicFilter = (typeof TOPIC_FILTERS)[number];

const SORT_OPTIONS = ["Most Popular", "Nearest"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

// the Figma mock lists each spot twice
const LISTED_SPOTS = [...SPOTS, ...SPOTS];

function filterSpots(topic: TopicFilter, sortBy: SortOption): Spot[] {
  const filtered = topic === "All" ? LISTED_SPOTS : LISTED_SPOTS.filter((spot) => spot.topic === (topic as Topic));
  return [...filtered].sort((a, b) => (sortBy === "Most Popular" ? b.saves - a.saves : a.distanceKm - b.distanceKm));
}

export function SpotListScreen() {
  const router = useRouter();
  const sortSheetId = useId();
  const [topicFilter, setTopicFilter] = useState<TopicFilter>("All");
  const [sortBy, setSortBy] = useState<SortOption>("Most Popular");

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
          <button
            type="button"
            popoverTarget={sortSheetId}
            className="flex shrink-0 items-center gap-1 rounded-full border border-gray-200 bg-white p-2 text-caption-sb-12 whitespace-nowrap text-gray-600"
          >
            {sortBy}
            <ArrowDownIcon className="size-4 text-gray-400" />
          </button>
          {TOPIC_FILTERS.map((option) => {
            const selected = option === topicFilter;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                onClick={() => setTopicFilter(option)}
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
          {filterSpots(topicFilter, sortBy).map((spot, i) => (
            <SpotCard key={`${spot.id}-${i}`} spot={spot} />
          ))}
        </div>
      </div>

      <BottomSheet id={sortSheetId} title="Sort">
        <div className="flex w-full flex-col items-start pb-[calc(env(safe-area-inset-bottom)+12px)]">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              popoverTarget={sortSheetId}
              popoverTargetAction="hide"
              onClick={() => setSortBy(option)}
              className="flex w-full items-center gap-2.5 p-4 text-body-m-14 text-black"
            >
              <span className="flex-1 text-left">{option}</span>
              {sortBy === option && <CheckIcon className="size-6" />}
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}

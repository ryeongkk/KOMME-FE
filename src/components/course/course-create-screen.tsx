"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon, CircleXIcon, PositionIcon, SearchIcon } from "@/components/icons";
import { POPULAR_SPOTS, searchPlaces } from "./create-data";

const TOTAL_STEPS = 3;
const STEP = 1;

// Figma nodes 324:3543 / 340:4539 / 340:4584 / 347:6408 — step 1 of Create Course
// (location search) plus its full-screen search mode. Steps 2/3 aren't designed yet.
export function CourseCreateScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");

  const selectLocation = (name: string) => {
    setLocation(name);
    setSearching(false);
    setQuery("");
  };

  if (searching) {
    return (
      <SearchStep
        query={query}
        onQueryChange={setQuery}
        onBack={() => setSearching(false)}
        onSelect={selectLocation}
      />
    );
  }

  return (
    <>
      <div className="flex w-full items-center justify-between py-2.5">
        <button type="button" aria-label="Back" onClick={() => router.back()} className="text-black">
          <ArrowLeftIcon className="size-6" />
        </button>
        <p className="text-body-sb-16 text-black">Create Course</p>
        <div className="size-6" aria-hidden />
      </div>

      <div className="mt-4 flex w-full flex-col gap-2">
        <p className="text-caption-r-12 text-gray-600">
          {STEP}/{TOTAL_STEPS}
        </p>
        <div className="h-1 w-full rounded-full bg-gray-100">
          <div className="h-1 rounded-full bg-primary" style={{ width: `${(STEP / TOTAL_STEPS) * 100}%` }} />
        </div>
      </div>

      <div className="mt-5 flex w-full flex-col gap-1">
        <p className="text-heading-b-18 text-black">Where do you want to spend the day?</p>
        <p className="text-body-m-14 text-black">Only Seoul and Busan are currently available.</p>
      </div>

      <div className="mt-5 flex w-full flex-col gap-4">
        <button
          type="button"
          onClick={() => setSearching(true)}
          className="flex w-full items-center border-b border-gray-400 py-2 text-left"
        >
          <span className={`text-body-m-16 ${location ? "text-black" : "text-gray-400"}`}>
            {location ?? "Search Seoul /Busan places"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => selectLocation("Current Location")}
          className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-lg bg-secondary-100 p-4"
        >
          <PositionIcon className="size-6 text-secondary-300" />
          <span className="text-body-m-14 text-secondary-300">Use current location</span>
        </button>
      </div>

      {/* ponytail: no step 2 route yet, wire up onClick when it exists */}
      <button
        type="button"
        disabled={!location}
        className={`mt-auto flex h-[52px] w-full items-center justify-center rounded-lg text-body-m-14 ${
          location ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
        }`}
      >
        Next
      </button>
    </>
  );
}

function SearchStep({
  query,
  onQueryChange,
  onBack,
  onSelect,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onBack: () => void;
  onSelect: (name: string) => void;
}) {
  const results = searchPlaces(query);

  return (
    <>
      <div className="flex w-full items-center gap-3 py-2.5">
        <button type="button" aria-label="Back" onClick={onBack} className="shrink-0 text-black">
          <ArrowLeftIcon className="size-6" />
        </button>
        <div className="flex flex-1 items-center gap-2.5 rounded-full bg-gray-50 px-4 py-2.5">
          <input
            autoFocus
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search Seoul /Busan places"
            className="flex-1 text-body-m-16 text-black placeholder-gray-400 outline-none"
          />
          {query.length > 0 ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onQueryChange("")}
              className="shrink-0 text-gray-400"
            >
              <CircleXIcon className="size-6" />
            </button>
          ) : (
            <SearchIcon className="size-6 shrink-0 text-gray-400" />
          )}
        </div>
      </div>

      {query.length === 0 ? (
        <div className="mt-3 flex w-full flex-col gap-3">
          <p className="text-body-sb-14 text-black">Popular Spots</p>
          {(Object.keys(POPULAR_SPOTS) as (keyof typeof POPULAR_SPOTS)[]).map((region) => (
            <div key={region} className="flex w-full flex-col gap-1">
              <p className="text-caption-sb-12 text-gray-500">{region}</p>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {POPULAR_SPOTS[region].map((spot) => (
                  <button
                    key={spot}
                    type="button"
                    onClick={() => onSelect(spot)}
                    className="shrink-0 rounded-full border border-gray-200 bg-white p-2 text-caption-sb-12 whitespace-nowrap text-gray-600"
                  >
                    {spot}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex w-full flex-col">
          {results.map((place) => (
            <button
              key={place}
              type="button"
              onClick={() => onSelect(place)}
              className="flex h-[53px] w-full items-center text-left"
            >
              <p className="text-body-m-14">
                <span className="text-body-sb-14 text-secondary-300">{place.slice(0, query.length)}</span>
                <span className="text-black">{place.slice(query.length)}</span>
              </p>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

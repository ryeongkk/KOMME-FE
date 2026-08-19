"use client";

import { ArrowLeftIcon, CircleXIcon, SearchIcon } from "@/components/icons";
import { POPULAR_SPOTS, searchPlaces } from "./create-data";

// Figma nodes 340:4584 / 347:6408 — the full-screen search mode of step 1 (Create Course).
export function SearchStep({
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

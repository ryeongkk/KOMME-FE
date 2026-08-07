"use client";

import { PositionIcon } from "@/components/icons";

// Figma nodes 324:3543 / 340:4539 — step 1 of Create Course (location search).
export function LocationStep({
  location,
  onOpenSearch,
  onUseCurrentLocation,
  locating,
  locationError,
  onNext,
}: {
  location: string | null;
  onOpenSearch: () => void;
  onUseCurrentLocation: () => void;
  locating: boolean;
  locationError: string | null;
  onNext: () => void;
}) {
  return (
    <>
      <div className="mt-5 flex w-full flex-col gap-1">
        <p className="text-heading-b-18 text-black">Where do you want to spend the day?</p>
        <p className="text-body-m-14 text-black">Only Seoul and Busan are currently available.</p>
      </div>

      <div className="mt-5 flex w-full flex-col gap-4">
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex w-full items-center border-b border-gray-400 py-2 text-left"
        >
          <span className={`text-body-m-16 ${location ? "text-black" : "text-gray-400"}`}>
            {location ?? "Search Seoul /Busan places"}
          </span>
        </button>

        <button
          type="button"
          onClick={onUseCurrentLocation}
          disabled={locating}
          className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-lg bg-secondary-100 p-4 disabled:opacity-60"
        >
          <PositionIcon className="size-6 text-secondary-300" />
          <span className="text-body-m-14 text-secondary-300">
            {locating ? "Finding your location…" : "Use current location"}
          </span>
        </button>
        {locationError && <p className="text-caption-m-12 text-negative">{locationError}</p>}
      </div>

      <button
        type="button"
        disabled={!location}
        onClick={onNext}
        className={`mt-auto flex h-[52px] w-full items-center justify-center rounded-lg text-body-m-14 ${
          location ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
        }`}
      >
        Next
      </button>
    </>
  );
}

"use client";

import { VisitDatePicker } from "@/components/ui/visit-date-picker";
import { SPOT_COUNTS } from "./create-data";

type SpotCount = (typeof SPOT_COUNTS)[number];

// Figma nodes 352:7529 / 354:8127 / 357:8751 — step 3 of Create Course (spot count + visit date).
export function SpotsStep({
  spotCount,
  onSelectSpotCount,
  visitDate,
  onVisitDateChange,
}: {
  spotCount: SpotCount | null;
  onSelectSpotCount: (count: SpotCount) => void;
  visitDate: Date | null;
  onVisitDateChange: (date: Date) => void;
}) {
  return (
    <>
      <div className="mt-5 flex w-full flex-col gap-7">
        <div className="flex w-full flex-col gap-5">
          <div className="flex w-full flex-col gap-1">
            <p className="text-heading-b-18 text-black">How many spots do you want to visit?</p>
            <p className="text-body-m-14 text-black">We&apos;ll plan a course to match.</p>
          </div>

          <div className="flex w-full flex-col gap-3">
            {SPOT_COUNTS.map((count) => {
              const selected = spotCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => onSelectSpotCount(count)}
                  className={`flex h-14 w-full items-center rounded-lg border px-4 py-2.5 text-left text-body-m-14 ${
                    selected
                      ? "border-secondary-300 bg-secondary-100 text-secondary-300"
                      : "border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </div>

        {spotCount && (
          <div className="flex w-full flex-col gap-5">
            <p className="text-heading-b-18 text-black">When do you want to visit?</p>
            <VisitDatePicker value={visitDate} onChange={onVisitDateChange} />
          </div>
        )}
      </div>

      {/* ponytail: no route past step 3 yet, wire up onClick when it exists */}
      <button
        type="button"
        disabled={!spotCount || !visitDate}
        className={`mt-auto flex h-[52px] w-full items-center justify-center rounded-lg text-body-m-14 ${
          spotCount && visitDate ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
        }`}
      >
        Next
      </button>
    </>
  );
}

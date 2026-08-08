"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { ArrowLeftIcon, MapIcon, SaveLgIcon } from "@/components/icons";
import { SPOTS, type Spot } from "@/components/spots/data";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { SpotCard } from "@/components/ui/spot-card";

type CourseStop = {
  spot: Spot;
  distanceToNextKm: number | null;
};

// ponytail: no course API yet, static stub — reuses the same spot 3x to match the Figma
// mock (same shape/values as course-detail-screen.tsx's stub; kept separate rather than
// shared since the two screens' data needs may diverge once a real course API exists).
const COURSE_STOPS: CourseStop[] = [
  { spot: SPOTS[0], distanceToNextKm: 1.4 },
  { spot: SPOTS[0], distanceToNextKm: 2.8 },
  { spot: SPOTS[0], distanceToNextKm: null },
];

// Shared shape for this screen's two confirm dialogs (leave / regenerate) — same
// popover markup as course-detail-screen.tsx's delete dialog, just parameterized since
// this screen needs it twice.
function ConfirmDialog({
  id,
  title,
  message,
  confirmLabel,
  onConfirm,
}: {
  id: string;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
}) {
  return (
    <div
      id={id}
      popover="auto"
      className="fixed inset-0 m-auto h-fit w-[299px] flex-col items-start gap-3 rounded-2xl border-0 bg-white p-4 [&::backdrop]:bg-black/30 [&:popover-open]:flex"
    >
      <div className="flex w-full flex-col gap-0.5">
        <p className="w-full text-body-sb-16 text-black">{title}</p>
        <p className="w-full text-body-m-14 text-gray-600">{message}</p>
      </div>
      <div className="flex gap-[9px]">
        <button
          type="button"
          popoverTarget={id}
          popoverTargetAction="hide"
          className="h-10 w-[129px] rounded-lg border border-gray-100 bg-white text-body-m-14 text-gray-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="h-10 w-[129px] rounded-lg bg-negative text-body-m-14 text-white"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}

// Figma node 357:8812 — course created, ready to save. The header's save icon opens the
// Save Course bottom sheet from the pasted mock; confirming routes to /course. The back
// arrow opens a "Leave this page?" confirm dialog (node 390:13995) instead of navigating
// straight back; confirming "Leave" discards the just-created course and routes to the
// Course tab. The bottom "Try Again" button (node 357:9479) opens a "Regenerate this
// course?" confirm dialog (node 390:14119); confirming routes to /course/create to redo
// the wizard from step 1. Both confirms use router.replace so this screen doesn't linger
// in history. The header's map icon has no API behind it yet (ponytail, same reasoning as
// course-detail-screen.tsx's unwired map icon).
export function CreatedCourseScreen() {
  const router = useRouter();
  const sheetId = useId();
  const [name, setName] = useState("");
  const canSave = name.trim().length > 0;

  return (
    <>
      <div className="flex w-full items-center justify-between py-2.5">
        <button type="button" aria-label="Back" popoverTarget="leave-page-dialog" className="text-black">
          <ArrowLeftIcon className="size-6" />
        </button>
        <p className="text-body-sb-16 text-black">Created Course</p>
        <div className="flex items-center gap-2.5">
          <button type="button" aria-label="View on map" className="text-black">
            <MapIcon className="size-6" />
          </button>
          <button type="button" aria-label="Save course" popoverTarget={sheetId} className="text-black">
            <SaveLgIcon className="size-6" />
          </button>
        </div>
      </div>

      <div className="relative flex w-full flex-1 flex-col gap-3 py-5">
        <div className="absolute top-5 bottom-5 left-[16px] border-l border-dashed border-gray-200" />
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

      <button
        type="button"
        popoverTarget="try-again-dialog"
        className="mt-auto flex h-[53px] w-full items-center justify-center rounded-lg bg-gray-900 text-body-m-14 text-white"
      >
        Try Again
      </button>

      <BottomSheet id={sheetId} title="Save Course">
        <div className="flex w-full flex-col gap-5 px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+12px)]">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name your course"
            aria-label="Course name"
            className="flex h-12 w-full items-center rounded-lg border border-gray-200 px-4 text-body-m-14 text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900"
          />
          <button
            type="button"
            disabled={!canSave}
            popoverTarget={sheetId}
            popoverTargetAction="hide"
            onClick={() => router.replace("/course")}
            className={`flex h-[53px] w-full items-center justify-center rounded-lg text-body-m-14 ${
              canSave ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
            }`}
          >
            Save
          </button>
        </div>
      </BottomSheet>

      <ConfirmDialog
        id="leave-page-dialog"
        title="Leave this page?"
        message="Your progress will be lost and the course will be deleted."
        confirmLabel="Leave"
        onConfirm={() => router.replace("/course")}
      />
      <ConfirmDialog
        id="try-again-dialog"
        title="Regenerate this course?"
        message="Your progress will be lost and the course will be deleted."
        confirmLabel="Try Again"
        onConfirm={() => router.replace("/course/create")}
      />
    </>
  );
}

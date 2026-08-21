"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { ArrowLeftIcon, MapIcon, SaveLgIcon } from "@/components/icons";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { deleteCourse, getCourseDetail, saveCourse } from "@/lib/api/course";
import { courseErrorMessage } from "@/lib/api/course-error-messages";
import { CourseSpotCard } from "./course-spot-card";

// Shared shape for this screen's two confirm dialogs (leave / regenerate) — same
// popover markup as course-detail-screen.tsx's delete dialog, just parameterized since
// this screen needs it twice.
function ConfirmDialog({
  id,
  title,
  message,
  confirmLabel,
  onConfirm,
  isPending,
  errorMessage,
}: {
  id: string;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  isPending?: boolean;
  errorMessage?: string;
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
        {errorMessage && (
          <p role="alert" className="w-full text-caption-r-12 text-negative">
            {errorMessage}
          </p>
        )}
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
          disabled={isPending}
          onClick={onConfirm}
          className="h-10 w-[129px] rounded-lg bg-negative text-body-m-14 text-white disabled:opacity-60"
        >
          {isPending ? "…" : confirmLabel}
        </button>
      </div>
    </div>
  );
}

// Figma node 357:8812 — course created, ready to save. `courseId` (query param POST
// /api/v1/courses handed back via router.push in course-create-screen.tsx) drives a
// getCourseDetail() fetch for the real spot timeline. The header's save icon opens the
// Save Course bottom sheet; confirming calls saveCourse() and routes to /course. The back
// arrow opens a "Leave this page?" confirm dialog (node 390:13995) instead of navigating
// straight back; confirming "Leave" calls deleteCourse() (POST /courses already persisted
// this course — leaving without saving means discarding it) and routes to the Course tab.
// The bottom "Try Again" button (node 357:9479) opens a "Regenerate this course?" confirm
// dialog (node 390:14119); confirming also deletes the course and routes to
// /course/create to redo the wizard from step 1. Both confirms use router.replace so this
// screen doesn't linger in history. The header's map icon still opens the static
// course-route-map.tsx stub (Figma node 357:8859) — out of scope for this pass, no
// courseId wired through yet.
export function CreatedCourseScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const sheetId = useId();
  const [name, setName] = useState("");
  const canSave = name.trim().length > 0;

  const courseId = Number(searchParams.get("courseId"));
  const hasCourseId = Number.isInteger(courseId) && courseId > 0;
  const courseQuery = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseDetail(courseId),
    enabled: hasCourseId,
  });

  const saveMutation = useMutation({
    mutationFn: () => saveCourse(courseId, name.trim()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      router.replace("/course");
    },
  });

  // Leave and Try Again both discard the just-created (not-yet-saved) course.
  const discardMutation = useMutation({ mutationFn: () => deleteCourse(courseId) });

  const spots = courseQuery.data?.spots ?? [];

  // No valid courseId in the URL — nothing to save/leave/regenerate (Number(null) would
  // otherwise silently become 0 and hit /courses/0/*). Bail out before rendering the
  // rest of the interactive screen.
  if (!hasCourseId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-body-sb-16 text-black">This course link is invalid.</p>
        <Link href="/course/create" className="text-body-m-14 text-secondary-300 underline">
          Start a new course
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full items-center justify-between py-2.5">
        <button type="button" aria-label="Back" popoverTarget="leave-page-dialog" className="text-black">
          <ArrowLeftIcon className="size-6" />
        </button>
        <p className="text-body-sb-16 text-black">Created Course</p>
        <div className="flex items-center gap-2.5">
          <Link href="/course/create/complete/map" aria-label="View on map" className="text-black">
            <MapIcon className="size-6" />
          </Link>
          <button type="button" aria-label="Save course" popoverTarget={sheetId} className="text-black">
            <SaveLgIcon className="size-6" />
          </button>
        </div>
      </div>

      {courseQuery.isError ? (
        // Same reasoning as course-detail-screen.tsx: an empty spot list here would look
        // like a real (if sparse) course instead of a failed fetch.
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
          <p className="text-body-sb-16 text-black">Couldn&apos;t load this course.</p>
          <button
            type="button"
            onClick={() => courseQuery.refetch()}
            className="text-body-m-14 text-secondary-300 underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="relative flex w-full flex-1 flex-col gap-3 py-5">
          <div className="absolute top-5 bottom-5 left-[16px] border-l border-dashed border-gray-200" />
          {spots.map((spot) => (
            <div key={spot.spotId} className="flex flex-col gap-3">
              <div className="flex w-full items-center gap-[27px] pl-[11px]">
                <div className="relative z-10 size-2.5 shrink-0 rounded-full bg-secondary-300" />
                <CourseSpotCard spot={spot} />
              </div>
              {spot.distanceToNextMeters !== null && (
                <div className="relative z-10 bg-white py-1">
                  <p className="text-caption-m-12 text-gray-500">{(spot.distanceToNextMeters / 1000).toFixed(1)}km</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

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
          {saveMutation.isError && (
            <p className="text-caption-m-12 text-negative">{courseErrorMessage(saveMutation.error)}</p>
          )}
          <button
            type="button"
            disabled={!canSave || saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
            className={`flex h-[53px] w-full items-center justify-center rounded-lg text-body-m-14 ${
              canSave && !saveMutation.isPending ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
            }`}
          >
            {saveMutation.isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </BottomSheet>

      <ConfirmDialog
        id="leave-page-dialog"
        title="Leave this page?"
        message="Your progress will be lost and the course will be deleted."
        confirmLabel="Leave"
        isPending={discardMutation.isPending}
        errorMessage={
          discardMutation.isError
            ? courseErrorMessage(discardMutation.error, "Couldn't delete this course. Please try again.")
            : undefined
        }
        onConfirm={() => discardMutation.mutate(undefined, { onSuccess: () => router.replace("/course") })}
      />
      <ConfirmDialog
        id="try-again-dialog"
        title="Regenerate this course?"
        message="Your progress will be lost and the course will be deleted."
        confirmLabel="Try Again"
        isPending={discardMutation.isPending}
        errorMessage={
          discardMutation.isError
            ? courseErrorMessage(discardMutation.error, "Couldn't delete this course. Please try again.")
            : undefined
        }
        onConfirm={() => discardMutation.mutate(undefined, { onSuccess: () => router.replace("/course/create") })}
      />
    </>
  );
}

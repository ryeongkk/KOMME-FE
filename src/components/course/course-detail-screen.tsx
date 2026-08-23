"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, DeleteIcon, MapIcon } from "@/components/icons";
import { deleteCourse, getCourseDetail } from "@/lib/api/course";
import { courseErrorMessage } from "@/lib/api/course-error-messages";
import { CourseSpotCard } from "./course-spot-card";

// Figma node 358:10841. `courseId` comes from the /course/[id] route param (page.tsx
// passes it straight through).
export function CourseDetailScreen({ courseId }: { courseId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = Number(courseId);
  const hasValidId = Number.isInteger(id) && id > 0;

  const courseQuery = useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourseDetail(id),
    enabled: hasValidId,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      // Not push("/course") — router.back() returns to whichever tab
      // (Upcoming/History) the user came from, same reasoning as the back button below.
      router.back();
    },
  });

  const spots = courseQuery.data?.spots ?? [];

  // Invalid id (e.g. a hand-edited URL) — same reasoning as created-course-screen.tsx's
  // hasCourseId gate: don't render the delete button/dialog at all, since deleteCourse(NaN)
  // would otherwise be one tap away.
  if (!hasValidId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-body-sb-16 text-black">This course link is invalid.</p>
        <Link href="/course" className="text-body-m-14 text-secondary-300 underline">
          Back to courses
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex w-full items-center justify-between px-4 py-2.5">
        <button type="button" aria-label="Back" onClick={() => router.back()} className="shrink-0 text-black">
          <ArrowLeftIcon className="size-6" />
        </button>
        {/* Absolutely positioned (not a 3rd flex-1 column) so it centers on the full header
            width — the icon side (map+delete, 74px) is wider than the back side (40px), so a
            flex-1 middle column would center within the leftover space instead of the screen.
            px-[76px] clears the wider (icon) side on both edges so the text itself stays
            symmetric regardless of which side is wider. DOM order kept between the two
            buttons (not moved to a natural absolute-item spot) for reading/tab order — its
            own position: absolute already excludes it from the flex layout either way. */}
        <p className="absolute inset-x-0 truncate px-[76px] text-center text-body-sb-16 text-black">
          {courseQuery.data?.title ?? "Course name"}
        </p>
        <div className="flex shrink-0 items-center gap-2.5">
          {/* ponytail: reuses the same static-stub map screen created-course-screen.tsx
              links to (course-route-map.tsx) — not courseId-aware, always shows
              create-data.ts's COURSE_STOPS regardless of which course this is */}
          <Link href="/course/create/complete/map" aria-label="View on map" className="text-black">
            <MapIcon className="size-6" />
          </Link>
          <button type="button" aria-label="Delete course" popoverTarget="delete-course-dialog" className="text-black">
            <DeleteIcon className="size-6" />
          </button>
        </div>
      </div>

      {courseQuery.isError ? (
        // Don't render the (empty) timeline as if the course really has no spots —
        // that's indistinguishable from a genuine fetch failure otherwise.
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
      ) : courseQuery.isLoading ? (
        // Same reasoning: an in-flight fetch has no spots yet either, and shouldn't
        // render as if the course really is empty.
        <div className="flex flex-1 items-center justify-center">
          <p className="text-body-m-14 text-gray-400">Loading…</p>
        </div>
      ) : (
        <div className="relative flex w-full flex-col gap-3 px-4 py-5">
          <div className="absolute top-5 bottom-5 left-[32px] border-l border-dashed border-gray-200" />
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

      <div
        id="delete-course-dialog"
        popover="auto"
        className="fixed inset-0 m-auto h-fit w-[299px] flex-col items-start gap-3 rounded-2xl border-0 bg-white p-4 [&::backdrop]:bg-black/30 [&:popover-open]:flex"
      >
        <div className="flex w-full flex-col gap-0.5">
          <p className="w-full text-body-sb-16 text-black">Delete this course?</p>
          <p className="w-full text-body-m-14 text-gray-600">This action cannot be undone.</p>
          {deleteMutation.isError && (
            <p role="alert" className="w-full text-caption-r-12 text-negative">
              {courseErrorMessage(deleteMutation.error, "Couldn't delete this course. Please try again.")}
            </p>
          )}
        </div>
        <div className="flex gap-[9px]">
          <button
            type="button"
            popoverTarget="delete-course-dialog"
            popoverTargetAction="hide"
            className="h-10 w-[129px] rounded-lg border border-gray-100 bg-white text-body-m-14 text-gray-500"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate()}
            className="h-10 w-[129px] rounded-lg bg-negative text-body-m-14 text-white disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

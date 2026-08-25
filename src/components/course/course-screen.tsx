"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon, LocationIcon, PlusIcon } from "@/components/icons";
import { type Schedule, ScheduleCard } from "@/components/ui/schedule-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tapbar } from "@/components/ui/tapbar";
import { type CourseSummary, getCourses } from "@/lib/api/course";

const TABS = ["Upcoming", "History"] as const;
type Tab = (typeof TABS)[number];

type HistoryCourse = {
  id: string;
  title: string;
  date: string;
  spots: number;
};

// GET /api/v1/courses?status=UPCOMING sorts D-day-임박순 already, so this only needs to
// turn visitDate into a "D-N"/"D-DAY" label for the card badge.
function dDayLabel(visitDate: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${visitDate}T00:00:00`);
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  return diffDays <= 0 ? "D-DAY" : `D-${diffDays}`;
}

function toSchedule(course: CourseSummary): Schedule {
  return {
    id: String(course.courseId),
    dDay: dDayLabel(course.visitDate),
    title: course.title,
    date: course.visitDate,
    spots: course.spotCount,
  };
}

function toHistoryCourse(course: CourseSummary): HistoryCourse {
  return { id: String(course.courseId), title: course.title, date: course.visitDate, spots: course.spotCount };
}

export function CourseScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab: Tab = searchParams.get("tab") === "history" ? "History" : "Upcoming";

  const upcomingQuery = useQuery({ queryKey: ["courses", "UPCOMING"], queryFn: () => getCourses("UPCOMING") });
  const historyQuery = useQuery({ queryKey: ["courses", "HISTORY"], queryFn: () => getCourses("HISTORY") });
  const upcomingCourses = upcomingQuery.data?.map(toSchedule) ?? [];
  const historyCourses = historyQuery.data?.map(toHistoryCourse) ?? [];

  // Tab state lives in the URL (not useState) so that navigating to a course
  // detail page and back restores whichever tab was active — router.back()
  // returns to this exact URL, replace() keeps switching tabs out of the
  // back-stack.
  const setTab = (t: Tab) => {
    router.replace(t === "History" ? "/course?tab=history" : "/course", { scroll: false });
  };

  return (
    <>
      <div className="flex w-full items-center justify-between px-4 py-2.5">
        <div className="size-6" aria-hidden />
        <p className="text-body-sb-16 text-black">Course</p>
        <div className="size-6" aria-hidden />
      </div>

      <div className="flex w-full items-center">
        {TABS.map((t) => {
          const selected = t === tab;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={selected}
              onClick={() => setTab(t)}
              className="flex h-12 flex-1 flex-col items-center"
            >
              <span
                className={`flex flex-1 items-center justify-center text-body-sb-16 ${
                  selected ? "text-primary" : "text-gray-400"
                }`}
              >
                {t}
              </span>
              <span className={`h-0.5 w-full ${selected ? "bg-primary" : "bg-gray-200"}`} />
            </button>
          );
        })}
      </div>

      <div className="flex flex-1 flex-col">
        {tab === "Upcoming" ? (
          upcomingQuery.isError ? (
            <ErrorState onRetry={() => upcomingQuery.refetch()} />
          ) : upcomingQuery.isLoading ? (
            <LoadingState />
          ) : upcomingCourses.length > 0 ? (
            <div className="flex w-full flex-col gap-3 px-4 py-5">
              {upcomingCourses.map((course) => (
                <ScheduleCard key={course.id} schedule={course} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )
        ) : historyQuery.isError ? (
          <ErrorState onRetry={() => historyQuery.refetch()} />
        ) : historyQuery.isLoading ? (
          <LoadingState />
        ) : historyCourses.length > 0 ? (
          <div className="flex w-full flex-col gap-3 px-4 py-5">
            {historyCourses.map((course) => (
              <HistoryCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      <div className="fixed inset-x-0 bottom-[76px] z-10 mx-auto flex max-w-sm justify-end px-4">
        <Link
          href="/course/create"
          aria-label="Create course"
          className="flex size-[52px] items-center justify-center rounded-full bg-gray-700 p-2.5"
        >
          <PlusIcon className="size-7 text-white" />
        </Link>
      </div>

      <Tapbar active="course" />
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
      <p className="text-body-sb-16 text-black">No courses created yet.</p>
      <p className="text-body-m-14 text-black">Create your own course right now!</p>
    </div>
  );
}

// Card-shaped placeholder matching ScheduleCard/HistoryCard's footprint (both ~132px+,
// bordered, badge/title/meta stacked at top) so the list doesn't jump when data lands.
function LoadingState() {
  return (
    <div className="flex w-full flex-col gap-3 px-4 py-5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex h-[132px] w-full flex-col justify-center gap-2 rounded-[10px] border border-gray-200 p-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

// A failed fetch must not render the same as "you have no courses" — that hides real
// API/auth errors behind a misleading empty state.
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
      <p className="text-body-sb-16 text-black">Couldn&apos;t load your courses.</p>
      <button type="button" onClick={onRetry} className="text-body-m-14 text-secondary-300 underline">
        Try again
      </button>
    </div>
  );
}

function HistoryCard({ course }: { course: HistoryCourse }) {
  return (
    <div className="flex h-[132px] w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-gray-200 px-4 py-5">
      <div className="flex w-full flex-col gap-1">
        <p className="w-full text-body-sb-16 text-black">{course.title}</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <CalendarIcon className="size-4 text-gray-500" />
            <p className="text-caption-sb-12 text-gray-500">{course.date}</p>
          </div>
          <span className="text-caption-m-12 text-gray-500">|</span>
          <div className="flex items-center gap-1">
            <LocationIcon className="size-4 text-gray-500" />
            <p className="text-caption-sb-12 text-gray-500">{course.spots} spots</p>
          </div>
        </div>
      </div>
      <Link
        href={`/course/${course.id}`}
        className="flex h-10 w-full items-center justify-center rounded-lg bg-secondary-100 text-body-m-14 text-secondary-300"
      >
        View Course
      </Link>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon, LocationIcon, PlusIcon } from "@/components/icons";
import { type Schedule, ScheduleCard } from "@/components/ui/schedule-card";
import { Tapbar } from "@/components/ui/tapbar";

const TABS = ["Upcoming", "History"] as const;
type Tab = (typeof TABS)[number];

type HistoryCourse = {
  id: string;
  title: string;
  date: string;
  spots: number;
};

// ponytail: no course API yet, static stub list (same shape as home-screen's
// UPCOMING_SCHEDULE). Empty array renders the empty state (Figma node 354:7845);
// populate it to preview the list state (node 137:1121).
const UPCOMING_COURSES: Schedule[] = [
  { id: "1", dDay: "D-DAY", title: "Hongdae Spa Day", date: "2026-07-28", spots: 3 },
  { id: "2", dDay: "D-2", title: "Hongdae Spa Day", date: "2026-07-29", spots: 3 },
  { id: "3", dDay: "D-3", title: "Hongdae Spa Day", date: "2026-07-30", spots: 3 },
];

// ponytail: no course API yet, static stub list. Empty array renders the empty
// state (Figma node 354:7899); populate it to preview the list state (node 354:7785).
const HISTORY_COURSES: HistoryCourse[] = [
  { id: "1", title: "Hongdae Spa Day", date: "2026-07-28", spots: 3 },
  { id: "2", title: "Hongdae Spa Day", date: "2026-07-28", spots: 3 },
  { id: "3", title: "Hongdae Spa Day", date: "2026-07-28", spots: 3 },
];

export function CourseScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab: Tab = searchParams.get("tab") === "history" ? "History" : "Upcoming";

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
          UPCOMING_COURSES.length > 0 ? (
            <div className="flex w-full flex-col gap-3 px-4 py-5">
              {UPCOMING_COURSES.map((course) => (
                <ScheduleCard key={course.id} schedule={course} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )
        ) : HISTORY_COURSES.length > 0 ? (
          <div className="flex w-full flex-col gap-3 px-4 py-5">
            {HISTORY_COURSES.map((course) => (
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

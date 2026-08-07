import { CalendarIcon, LocationIcon } from "@/components/icons";

export type Schedule = {
  dDay: string;
  title: string;
  date: string;
  spots: number;
};

// ponytail: Edit Schedule / View Course have no destinations yet (no /course/[id] or
// /course/[id]/edit routes), so they're static buttons — wire up onClick when those exist.
export function ScheduleCard({ schedule }: { schedule: Schedule }) {
  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-[10px] border border-gray-200 px-4 py-5">
      <div className="flex w-full flex-col gap-1">
        <span className="w-fit rounded bg-secondary-300 px-2 py-0.5 text-caption-sb-12 text-secondary-100">
          {schedule.dDay}
        </span>
        <p className="text-body-sb-16 text-black">{schedule.title}</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <CalendarIcon className="size-4 text-gray-500" />
            <p className="text-caption-sb-12 text-gray-500">{schedule.date}</p>
          </div>
          <span className="text-caption-m-12 text-gray-500">|</span>
          <div className="flex items-center gap-1">
            <LocationIcon className="size-4 text-gray-500" />
            <p className="text-caption-sb-12 text-gray-500">{schedule.spots} spots</p>
          </div>
        </div>
      </div>
      <div className="flex gap-[9px]">
        <button
          type="button"
          className="flex h-10 w-[151px] items-center justify-center rounded-lg border border-gray-100 text-body-m-14 text-gray-500"
        >
          Edit Schedule
        </button>
        <button
          type="button"
          className="flex h-10 w-[151px] items-center justify-center rounded-lg bg-secondary-100 text-body-m-14 text-secondary-300"
        >
          View Course
        </button>
      </div>
    </div>
  );
}

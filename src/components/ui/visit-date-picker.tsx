"use client";

import { useId, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon } from "@/components/icons";
import { BottomSheet } from "./bottom-sheet";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ponytail: adjacent-month days are shown (greyed, per Figma) but not clickable — no
// month-jump-on-click. Add if users expect tapping a greyed date to navigate months.
function buildCalendarCells(cursor: Date): { date: Date; inMonth: boolean }[] {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  return Array.from({ length: totalCells }, (_, i) => {
    const dayOffset = i - firstWeekday + 1;
    return { date: new Date(year, month, dayOffset), inMonth: dayOffset >= 1 && dayOffset <= daysInMonth };
  });
}

// Figma node 352:7529 (trigger) / 354:8127 (bottom sheet) / 357:8751 (confirmed) — the
// "When do you want to visit?" field in step 3 of Create Course. Self-contained: owns the
// calendar's month/selection scratch state and only reports the confirmed date up.
export function VisitDatePicker({
  value,
  onChange,
}: {
  value: Date | null;
  onChange: (date: Date) => void;
}) {
  const sheetId = useId();
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => new Date());

  return (
    <>
      <button
        type="button"
        popoverTarget={sheetId}
        onClick={() => {
          const base = value ?? new Date();
          setCursor(base);
          setSelected(base);
        }}
        className="flex h-14 w-full items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-left"
      >
        <CalendarIcon className="size-6 text-gray-600" />
        <span className="text-body-m-14 text-gray-600">{value ? formatDate(value) : "Select date"}</span>
      </button>

      <BottomSheet id={sheetId}>
        <div className="flex w-full flex-col items-center gap-3 px-4">
          <div className="flex w-full items-center justify-center gap-[60px]">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
            >
              <ArrowLeftIcon className="size-6 text-black" />
            </button>
            <p className="text-body-sb-16 text-black">
              {cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
            >
              <ArrowRightIcon className="size-6 text-black" />
            </button>
          </div>

          <div className="flex w-full flex-col items-center gap-2">
            <div className="grid w-full grid-cols-7 text-center text-caption-sb-12">
              {WEEKDAY_LABELS.map((label, i) => (
                <p key={label} className={i === 0 ? "text-negative" : i === 6 ? "text-secondary-400" : "text-black"}>
                  {label}
                </p>
              ))}
            </div>
            <div className="grid w-full grid-cols-7 justify-items-center gap-y-2">
              {buildCalendarCells(cursor).map(({ date, inMonth }) => {
                const isSelected = isSameDay(date, selected);
                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    disabled={!inMonth}
                    onClick={() => setSelected(date)}
                    className={`flex size-[42px] items-center justify-center rounded-full text-body-m-14 ${
                      isSelected ? "bg-secondary-300 text-white" : inMonth ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center px-4 pt-5 pb-[calc(env(safe-area-inset-bottom)+12px)]">
          <button
            type="button"
            popoverTarget={sheetId}
            popoverTargetAction="hide"
            onClick={() => onChange(selected)}
            className="flex h-[53px] w-full items-center justify-center rounded-lg bg-gray-900 text-body-m-14 text-white"
          >
            Confirm
          </button>
        </div>
      </BottomSheet>
    </>
  );
}

"use client";

import { TOPICS } from "./create-data";

// Figma nodes 352:7394 / 352:7460 — step 2 of Create Course (select topics).
export function TopicsStep({
  topics,
  onToggle,
  onNext,
}: {
  topics: Set<string>;
  onToggle: (topic: string) => void;
  onNext: () => void;
}) {
  return (
    <>
      <div className="mt-5 flex w-full flex-col gap-1">
        <p className="text-heading-b-18 text-black">Select topics</p>
        <p className="text-body-m-14 text-black">Multiple selections allowed</p>
      </div>

      <div className="mt-5 flex w-full flex-col gap-3">
        {TOPICS.map((topic) => {
          const selected = topics.has(topic);
          return (
            <button
              key={topic}
              type="button"
              onClick={() => onToggle(topic)}
              className={`flex h-14 w-full items-center rounded-lg border px-4 py-2.5 text-left text-body-m-14 ${
                selected ? "border-secondary-300 bg-secondary-100 text-secondary-300" : "border-gray-200 bg-white text-gray-600"
              }`}
            >
              {topic}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={topics.size === 0}
        onClick={onNext}
        className={`mt-auto flex h-[52px] w-full items-center justify-center rounded-lg text-body-m-14 ${
          topics.size > 0 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
        }`}
      >
        Next
      </button>
    </>
  );
}

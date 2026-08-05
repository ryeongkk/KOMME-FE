"use client";

import { useState } from "react";
import { CalendarIcon, LocationIcon, SaveSmIcon } from "@/components/icons";
import { Tapbar } from "@/components/ui/tapbar";

const TOPICS = [
  "Korean Spa/Sauna",
  "Traditional Market",
  "Chimaek",
  "Convenience Store",
  "K-Culture",
  "Hiking/Walking",
] as const;

type Place = {
  name: string;
  saves: number;
  distanceKm: number;
};

const PLACES: Place[] = [
  { name: "The Park Spa Land", saves: 4, distanceKm: 2.8 },
  { name: "Moclock Gangnam Main Branch", saves: 6, distanceKm: 3.1 },
  { name: "Sparex Dongdaemun", saves: 4, distanceKm: 2.8 },
];

type Schedule = {
  dDay: string;
  title: string;
  date: string;
  spots: number;
};

// ponytail: no course-creation flow yet, so this is a stub — null renders the empty
// state (Figma node 352:6583); set a Schedule to preview the with-course state
// (node 137:1175). Swap for the real "current course" fetch once the API exists.
const UPCOMING_SCHEDULE: Schedule | null = null;

export function HomeScreen() {
  const [selectedTopic, setSelectedTopic] = useState<(typeof TOPICS)[number]>(TOPICS[0]);

  return (
    <>
      <div className="flex w-full items-center justify-between px-4 py-2.5">
        <p className="text-heading-b-18 text-black">Logo</p>
        <div className="flex items-center gap-1">
          <LocationIcon className="size-6 text-black" />
          <p className="text-body-sb-14 text-black">Dongjak-gu</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-7 pb-3">
        <div className="flex w-full flex-col gap-4 px-4">
          <div className="flex h-6 w-full items-center justify-between">
            <p className="text-body-sb-16 text-black">
              {UPCOMING_SCHEDULE ? "You have an upcoming course" : "You have no upcoming courses"}
            </p>
            <p className="text-caption-m-12 text-gray-400">More</p>
          </div>
          {UPCOMING_SCHEDULE ? <ScheduleCard schedule={UPCOMING_SCHEDULE} /> : <EmptyScheduleCard />}
        </div>

        <div className="flex w-full flex-col gap-3 px-4">
          <div className="flex h-6 w-full items-center justify-between">
            <p className="text-body-sb-16 text-black">{`Select a topic you're interested in`}</p>
            <p className="text-caption-m-12 text-gray-400">More</p>
          </div>
          <div className="flex w-full items-center gap-1.5 overflow-x-auto">
            {TOPICS.map((topic) => {
              const selected = topic === selectedTopic;
              return (
                <button
                  key={topic}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedTopic(topic)}
                  className={`shrink-0 rounded-full border p-2 text-caption-sb-12 whitespace-nowrap ${
                    selected
                      ? "border-secondary-300 bg-secondary-100 text-secondary-300"
                      : "border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
          <PlaceList places={PLACES} />
        </div>

        <div className="flex w-full flex-col gap-3 px-4">
          <div className="flex h-6 w-full items-center justify-between">
            <p className="text-body-sb-16 text-black">Popular Near You</p>
            <p className="text-caption-m-12 text-gray-400">More</p>
          </div>
          <PlaceList places={PLACES} />
        </div>
      </div>

      <Tapbar active="home" />
    </>
  );
}

function ScheduleCard({ schedule }: { schedule: Schedule }) {
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

function EmptyScheduleCard() {
  return (
    <div className="flex w-full flex-col items-start gap-2 rounded-[10px] border border-gray-200 px-4 py-5">
      <div className="flex w-full flex-col gap-1">
        <p className="text-body-sb-16 text-black">Plan your course</p>
        <p className="text-body-m-14 text-gray-500">
          {`Pick a topic below and we'll build a course around your location`}
        </p>
      </div>
      {/* ponytail: no /course/create route yet, wire up onClick when it exists */}
      <button
        type="button"
        className="flex h-10 w-full items-center justify-center rounded-lg bg-secondary-100 text-body-m-14 text-secondary-300"
      >
        Start Creating
      </button>
    </div>
  );
}

function PlaceList({ places }: { places: Place[] }) {
  return (
    <div className="flex w-full gap-3 overflow-x-auto">
      {places.map((place, i) => (
        // ponytail: place images are placeholder boxes per request, swap for real photos when the API exists
        <div key={`${place.name}-${i}`} className="flex w-[150px] shrink-0 flex-col gap-1.5">
          <div className="aspect-square w-full rounded bg-gray-100" />
          <div className="flex w-full flex-col">
            <p className="text-body-sb-14 text-black">{place.name}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <SaveSmIcon className="size-4 text-secondary-300" />
                <p className="text-caption-m-12 text-gray-500">{place.saves}</p>
              </div>
              <span className="text-caption-m-12 text-gray-500">|</span>
              <p className="text-caption-m-12 text-gray-500">{place.distanceKm}km</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowLeftIcon, ClockIcon, LocationIcon, PhoneIcon, SaveSmIcon } from "@/components/icons";
import { SPOTS, type Spot } from "@/components/spots/data";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { COURSE_STOPS } from "./create-data";

const SCRIPT_ID = "naver-maps-sdk";

// Loads the Naver Maps JS SDK at most once per page (no npm package — NCP ships it as a
// <script> tag keyed by client ID). Resolves immediately if it's already on the page.
function loadNaverMapsScript(clientId: string): Promise<void> {
  if (window.naver?.maps) return Promise.resolve();
  const existing = document.getElementById(SCRIPT_ID);
  if (existing) {
    return new Promise((resolve) => existing.addEventListener("load", () => resolve(), { once: true }));
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Naver Maps SDK"));
    document.head.appendChild(script);
  });
}

// Fetches a driving route from /api/course-directions (NCP Direction 15) and returns its
// [lat, lng] path. Falls back to null (caller draws a straight line instead) on any
// failure — no Direction product enabled, quota, network blip, etc. shouldn't leave the
// screen with no line at all.
async function fetchDrivingPath(
  start: { lat: number; lng: number },
  goal: { lat: number; lng: number },
): Promise<[number, number][] | null> {
  try {
    const url = `/api/course-directions?startLat=${start.lat}&startLng=${start.lng}&goalLat=${goal.lat}&goalLng=${goal.lng}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data.path) ? data.path : null;
  } catch {
    return null;
  }
}

function spotSheetId(label: string) {
  return `spot-sheet-${label}`;
}

// Figma node 358:9505 ("핀 클릭 시") — tapping a numbered pin opens this "Place Info"
// sheet. Content mirrors spots/spot-detail-screen.tsx (same data, same "Open in Naver
// Map" link) but laid out for a sheet instead of a full page — not extracted into a
// shared component since the two diverge enough (full-page chrome vs. sheet chrome) that
// sharing would just be indirection for ~20 lines of markup; revisit if a third usage
// shows up.
function SpotInfoSheet({ label, spot }: { label: string; spot: Spot }) {
  return (
    <BottomSheet id={spotSheetId(label)} title="Place Info">
      {/* ponytail: no photo API yet, swap for real photos when it exists */}
      <div className="aspect-square w-full bg-gray-100" />
      <div className="flex w-full flex-col gap-4 px-4 py-4">
        <div className="flex w-full flex-col gap-1">
          <p className="text-caption-m-12 text-gray-500">{spot.region}</p>
          <p className="text-body-sb-16 text-black">{spot.name}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <SaveSmIcon className="size-5 text-secondary-300" />
              <p className="text-body-m-14 text-gray-500">{spot.saves}</p>
            </div>
            <span className="text-body-m-14 text-gray-500">|</span>
            <p className="text-body-m-14 text-gray-500">{spot.distanceKm}km</p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-start gap-2">
            <LocationIcon className="size-5 shrink-0 text-gray-700" />
            <p className="flex-1 text-body-m-14 text-black">{spot.address}</p>
          </div>
          <div className="flex w-full items-center gap-2">
            <PhoneIcon className="size-5 shrink-0 text-gray-700" />
            <p className="flex-1 text-body-m-14 text-black">{spot.phone}</p>
          </div>
          <div className="flex w-full items-center gap-2">
            <ClockIcon className="size-5 shrink-0 text-gray-700" />
            <p className="flex-1 text-body-m-14 text-black">{spot.hours}</p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <a
          href={`https://map.naver.com/p/search/${encodeURIComponent(spot.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[53px] w-full items-center justify-center gap-2.5 rounded-lg border border-gray-100 p-4 text-body-m-14 text-gray-500"
        >
          <Image src="/icons/naver-map.png" alt="" width={24} height={24} />
          Open in Naver Map
        </a>
      </div>
    </BottomSheet>
  );
}

// Figma node 357:8859 ("지도로 보기") — numbered pins (matching the cyan "numbering"
// component, secondary-300) + a driving route between them (NCP Direction 15), so far
// just stops 1→2. Tapping a pin opens its Place Info sheet (node 358:9505) via the native
// popover API — the pin's HTML content is a real <button popovertarget>, so this needs no
// JS click-listener wiring through the Maps SDK. No back button in the Figma mock, but a
// bare full-bleed map with no way out is a real trap, so one's added here (ponytail:
// floating over the map since there's no header chrome).
// ponytail: Direction 15 is a car route, not a walking one — Naver has no public
// pedestrian-directions API, so this is a stand-in for what's really a walking course.
// Falls back to a straight line if the Directions call fails for any reason.
export function CourseRouteMap() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);

  const start = COURSE_STOPS[0].spot;
  // ponytail: COURSE_STOPS repeats the same stub spot 3x (see create-data.ts), so
  // there's no real second stop yet — SPOTS[1] stands in as an arbitrary second point to
  // test multi-marker + route rendering. Swap to COURSE_STOPS[1].spot once that stub has
  // distinct stops.
  const second = SPOTS[1];
  const stops = [
    { label: "1", spot: start },
    { label: "2", spot: second },
  ];

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    const container = mapRef.current;
    if (!clientId || !container) return;

    let cancelled = false;

    async function render(clientId: string, container: HTMLElement) {
      await loadNaverMapsScript(clientId);
      if (cancelled || !window.naver) return;
      const { maps } = window.naver;
      const startLatLng = new maps.LatLng(start.lat, start.lng);
      const secondLatLng = new maps.LatLng(second.lat, second.lng);
      const map = new maps.Map(container, { center: startLatLng, zoom: 16 });

      const addNumberedMarker = (position: naver.maps.LatLng, label: string) =>
        new maps.Marker({
          position,
          map,
          icon: {
            content: `<button type="button" popovertarget="${spotSheetId(label)}" class="flex size-7 items-center justify-center rounded-full bg-secondary-300 text-body-sb-16 text-white">${label}</button>`,
            anchor: new maps.Point(14, 14),
          },
        });
      addNumberedMarker(startLatLng, "1");
      addNumberedMarker(secondLatLng, "2");

      const drivingPath = await fetchDrivingPath(start, second);
      if (cancelled) return;
      const path = drivingPath
        ? drivingPath.map(([lat, lng]) => new maps.LatLng(lat, lng))
        : [startLatLng, secondLatLng];
      new maps.Polyline({
        path,
        map,
        strokeColor: "#11DDE4", // secondary-300
        strokeWeight: 4,
      });

      const bounds = new maps.LatLngBounds(startLatLng, startLatLng);
      bounds.extend(secondLatLng);
      map.fitBounds(bounds, 40);
    }

    render(clientId, container);

    return () => {
      cancelled = true;
    };
  }, [start, second]);

  return (
    <div className="fixed inset-x-0 top-0 mx-auto h-dvh w-full max-w-sm">
      <div ref={mapRef} className="h-full w-full" />
      <button
        type="button"
        aria-label="Back"
        onClick={() => router.back()}
        className="absolute top-4 left-4 flex size-10 items-center justify-center rounded-full bg-white text-black shadow-md"
      >
        <ArrowLeftIcon className="size-6" />
      </button>
      {stops.map(({ label, spot }) => (
        <SpotInfoSheet key={label} label={label} spot={spot} />
      ))}
    </div>
  );
}

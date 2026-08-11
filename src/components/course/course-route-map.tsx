"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowLeftIcon } from "@/components/icons";
import { SPOTS } from "@/components/spots/data";
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

// Figma node 357:8859 ("지도로 보기") — numbered pins (matching the cyan "numbering"
// component, secondary-300) + a driving route between them (NCP Direction 15), so far
// just stops 1→2. No back button in the Figma mock, but a bare full-bleed map with no way
// out is a real trap, so one's added here (ponytail: floating over the map since there's
// no header chrome).
// ponytail: Direction 15 is a car route, not a walking one — Naver has no public
// pedestrian-directions API, so this is a stand-in for what's really a walking course.
// Falls back to a straight line if the Directions call fails for any reason.
export function CourseRouteMap() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    const container = mapRef.current;
    if (!clientId || !container) return;

    let cancelled = false;
    const start = COURSE_STOPS[0].spot;
    // ponytail: COURSE_STOPS repeats the same stub spot 3x (see create-data.ts), so
    // there's no real second stop yet — SPOTS[1] stands in as an arbitrary second point
    // to test multi-marker + route rendering. Swap to COURSE_STOPS[1].spot once that
    // stub has distinct stops.
    const second = SPOTS[1];

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
            content: `<div class="flex size-7 items-center justify-center rounded-full bg-secondary-300 text-body-sb-16 text-white">${label}</div>`,
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
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 mx-auto h-dvh w-full max-w-sm">
      <div ref={mapRef} className="h-full w-full" />
      <button type="button" aria-label="Back" onClick={() => router.back()} className="absolute top-4 left-4 flex size-10 items-center justify-center rounded-full bg-white text-black shadow-md">
        <ArrowLeftIcon className="size-6" />
      </button>
    </div>
  );
}

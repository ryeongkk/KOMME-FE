"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowLeftIcon } from "@/components/icons";
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

// Figma node 357:8859 ("지도로 보기") — first slice only: drop a numbered pin (matching
// the cyan "numbering" component, secondary-300) on the course's start location. No back
// button in the Figma mock, but a bare full-bleed map with no way out is a real trap, so
// one's added here (ponytail: floating over the map since there's no header chrome).
// ponytail: no route-drawing yet (straight line vs. NCP Direction 15 street-following is
// still an open call, see project notes) — this step is just the start pin.
export function CourseRouteMap() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    const container = mapRef.current;
    if (!clientId || !container) return;

    let cancelled = false;
    const start = COURSE_STOPS[0].spot;

    loadNaverMapsScript(clientId).then(() => {
      if (cancelled || !window.naver) return;
      const center = new window.naver.maps.LatLng(start.lat, start.lng);
      const map = new window.naver.maps.Map(container, { center, zoom: 16 });
      new window.naver.maps.Marker({
        position: center,
        map,
        icon: {
          content: '<div class="flex size-7 items-center justify-center rounded-full bg-secondary-300 text-body-sb-16 text-white">1</div>',
          anchor: new window.naver.maps.Point(14, 14),
        },
      });
    });

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

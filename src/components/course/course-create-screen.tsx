"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowLeftIcon } from "@/components/icons";
import { SPOT_COUNTS } from "./create-data";
import { LocationStep } from "./create-location-step";
import { SearchStep } from "./create-search-step";
import { SpotsStep } from "./create-spots-step";
import { TopicsStep } from "./create-topics-step";

const TOTAL_STEPS = 3;

// Orchestrator: owns all wizard state and the shared header/progress chrome, and hands
// each step its slice as props. Figma nodes 324:3543 / 340:4539 / 340:4584 / 347:6408 —
// step 1 (location search) plus its full-screen search mode. Node 352:7394 / 352:7460 —
// step 2 (select topics). Node 352:7529 / 354:8127 / 357:8751 — step 3 (spot count + visit date).
export function CourseCreateScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [location, setLocation] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [topics, setTopics] = useState<Set<string>>(new Set());
  const [spotCount, setSpotCount] = useState<(typeof SPOT_COUNTS)[number] | null>(null);
  const [visitDate, setVisitDate] = useState<Date | null>(null);
  const pendingErrorRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleTopic = (topic: string) => {
    setTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  };

  const selectLocation = (name: string) => {
    setLocation(name);
    setSearching(false);
    setQuery("");
  };

  // ponytail: some browser extensions (privacy/anti-fingerprinting ones) patch
  // getCurrentPosition and fire a spurious PERMISSION_DENIED synchronously before
  // letting the real request through a few ms later — confirmed via instrumentation,
  // the "error" and the real success shared the same request, ~6ms apart. Rather than
  // flash that noise, hold the error behind a short grace window and let a fast
  // success cancel it before it's ever shown.
  const useCurrentLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationError("Geolocation isn't supported on this device.");
      return;
    }
    if (pendingErrorRef.current) clearTimeout(pendingErrorRef.current);
    setLocationError(null);
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (pendingErrorRef.current) {
          clearTimeout(pendingErrorRef.current);
          pendingErrorRef.current = null;
        }
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`/api/reverse-geocode?lat=${latitude}&lng=${longitude}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? "Couldn't determine your location");
          selectLocation(data.location);
          setLocationError(null);
        } catch {
          setLocationError("Couldn't determine your location. Please search instead.");
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        pendingErrorRef.current = setTimeout(() => {
          setLocationError(
            error.code === error.PERMISSION_DENIED
              ? "Location permission denied. Please search instead."
              : "Couldn't determine your location. Please search instead.",
          );
          setLocating(false);
          pendingErrorRef.current = null;
        }, 300);
      },
      { timeout: 20_000 },
    );
  };

  if (searching) {
    return (
      <SearchStep
        query={query}
        onQueryChange={setQuery}
        onBack={() => setSearching(false)}
        onSelect={selectLocation}
      />
    );
  }

  return (
    <>
      <div className="flex w-full items-center justify-between py-2.5">
        <button
          type="button"
          aria-label="Back"
          onClick={() => (step > 1 ? setStep((s) => (s - 1) as 1 | 2) : router.back())}
          className="text-black"
        >
          <ArrowLeftIcon className="size-6" />
        </button>
        <p className="text-body-sb-16 text-black">Create Course</p>
        <div className="size-6" aria-hidden />
      </div>

      <div className="mt-4 flex w-full flex-col gap-2">
        <p className="text-caption-r-12 text-gray-600">
          {step}/{TOTAL_STEPS}
        </p>
        <div className="h-1 w-full rounded-full bg-gray-100">
          <div className="h-1 rounded-full bg-primary" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>
      </div>

      {step === 1 ? (
        <LocationStep
          location={location}
          onOpenSearch={() => setSearching(true)}
          onUseCurrentLocation={useCurrentLocation}
          locating={locating}
          locationError={locationError}
          onNext={() => setStep(2)}
        />
      ) : step === 2 ? (
        <TopicsStep topics={topics} onToggle={toggleTopic} onNext={() => setStep(3)} />
      ) : (
        <SpotsStep
          spotCount={spotCount}
          onSelectSpotCount={setSpotCount}
          visitDate={visitDate}
          onVisitDateChange={setVisitDate}
        />
      )}
    </>
  );
}

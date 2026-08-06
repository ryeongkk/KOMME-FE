"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ClockIcon, LocationIcon, PhoneIcon, SaveSmIcon } from "@/components/icons";
import type { Spot } from "./data";

export function SpotDetailScreen({ spot }: { spot: Spot }) {
  const router = useRouter();

  return (
    <>
      <div className="flex w-full items-center px-4 py-2.5">
        <button type="button" aria-label="Back" onClick={() => router.back()} className="text-black">
          <ArrowLeftIcon className="size-6" />
        </button>
      </div>

      <div className="flex w-full flex-col items-center gap-3">
        {/* ponytail: no photo API yet, swap for real photos when it exists */}
        <div className="aspect-square w-full bg-gray-100" />

        <div className="flex w-full flex-col gap-4 px-4">
          <div className="flex w-full flex-col gap-1">
            <div className="flex w-full flex-col">
              <p className="text-caption-m-12 text-gray-500">{spot.region}</p>
              <p className="text-body-sb-16 text-black">{spot.name}</p>
            </div>
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
      </div>

      <div className="mt-auto flex w-full flex-col px-4 pt-5 pb-3">
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
    </>
  );
}

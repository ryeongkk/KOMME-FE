"use client";

import { useRouter } from "next/navigation";
import { ArrowRightIcon, MypageIcon } from "@/components/icons";
import { Tapbar } from "@/components/ui/tapbar";

export function MyScreen() {
  const router = useRouter();

  return (
    <>
      <div className="flex w-full items-center justify-between px-4 py-2.5">
        <div className="size-6" aria-hidden />
        <p className="text-body-sb-16 text-black">My</p>
        <div className="size-6" aria-hidden />
      </div>

      <div className="flex flex-1 flex-col gap-3 pb-3">
        <button
          type="button"
          onClick={() => router.push("/my/account")}
          className="flex w-full items-center gap-[13px] p-4"
        >
          <span className="flex size-[52px] shrink-0 items-center justify-center rounded-full border border-gray-100 bg-gray-50 p-2.5">
            <MypageIcon className="size-7 text-gray-400" />
          </span>
          <span className="flex-1 text-left text-body-sb-16 text-black">ryeongkk</span>
          <ArrowRightIcon className="size-6 shrink-0 text-gray-900" />
        </button>

        <div className="flex w-full flex-col">
          <p className="px-4 text-caption-sb-12 text-gray-500">General</p>
          <button
            type="button"
            onClick={() => router.push("/my/language")}
            className="w-full p-4 text-left text-body-m-14 text-black"
          >
            Language Setting
          </button>
          <div className="h-1.5 w-full bg-gray-50" />
        </div>

        <div className="flex w-full flex-col">
          <p className="px-4 text-caption-sb-12 text-gray-500">About</p>
          <button
            type="button"
            onClick={() => router.push("/my/terms")}
            className="w-full p-4 text-left text-body-m-14 text-black"
          >
            Terms & Policies
          </button>
          <div className="flex w-full items-center gap-2.5 p-4 text-body-m-14 text-black">
            <span className="flex-1">App Version</span>
            <span className="flex-1 text-right text-caption-m-12 text-gray-500">1.0.0</span>
          </div>
        </div>
      </div>

      <Tapbar active="my" />
    </>
  );
}

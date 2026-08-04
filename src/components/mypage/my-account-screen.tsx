"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";

export function MyAccountScreen() {
  const router = useRouter();

  return (
    <>
      <div className="flex w-full items-center justify-between px-4 py-2.5">
        <button type="button" aria-label="Back" onClick={() => router.back()} className="text-gray-900">
          <ArrowLeftIcon className="size-6" />
        </button>
        <p className="text-body-sb-16 text-black">My Account</p>
        <div className="size-6" aria-hidden />
      </div>

      <div className="flex w-full flex-col">
        {/* TODO: navigate to the edit-profile route once it exists */}
        <button type="button" className="w-full p-4 text-left text-body-m-14 text-black">
          Edit Profile
        </button>
        {/* ponytail: no auth session to clear yet, just returns to the login screen */}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full p-4 text-left text-body-m-14 text-black"
        >
          Log Out
        </button>
        <button
          type="button"
          disabled
          className="w-full p-4 text-center text-caption-sb-12 text-gray-400"
        >
          Delete Account
        </button>
      </div>
    </>
  );
}

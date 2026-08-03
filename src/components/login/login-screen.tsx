"use client";

import { useRouter } from "next/navigation";
import { AppleIcon, CheckIcon, GlobeIcon, GoogleIcon } from "@/components/icons";
import { BottomSheet } from "@/components/ui/bottom-sheet";

const languages = [
  { label: "English", selected: true },
  { label: "中文", selected: false },
  { label: "日本語", selected: false },
];

export function LoginScreen() {
  const router = useRouter();

  return (
    <>
      <p className="mt-[150.5px] text-title-b-20 text-black">Logo</p>

      <div className="mt-[103.5px] flex w-full flex-col gap-4">
        <div className="flex w-full flex-col gap-5">
          <div className="flex w-full flex-col gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-12 w-full rounded-lg border border-gray-200 bg-white p-4 text-body-m-14 text-gray-900 placeholder-gray-400"
            />
            <input
              type="password"
              placeholder="Enter your password"
              className="h-12 w-full rounded-lg border border-gray-200 bg-white p-4 text-body-m-14 text-gray-900 placeholder-gray-400"
            />
          </div>
          <button
            type="button"
            disabled
            className="flex h-[52px] w-full items-center justify-center rounded-lg bg-gray-100 text-body-m-14 text-gray-400"
          >
            Login
          </button>
        </div>

        <div className="flex items-center justify-center gap-5 text-body-m-14 text-black">
          <button type="button" onClick={() => router.push("/login/terms")}>
            Sign Up
          </button>
          <span aria-hidden>|</span>
          <button type="button">Reset Password</button>
        </div>
      </div>

      <div className="mt-[98px] flex items-center gap-5">
        <button
          type="button"
          aria-label="Continue with Apple"
          className="flex size-[60px] items-center justify-center rounded-full bg-black"
        >
          <AppleIcon className="h-[25px] w-[20px]" />
        </button>
        <button
          type="button"
          aria-label="Continue with Google"
          className="flex size-[60px] items-center justify-center rounded-full border border-gray-400 bg-white"
        >
          <GoogleIcon className="size-[22px]" />
        </button>
      </div>

      <button
        type="button"
        popoverTarget="language-setting"
        className="mt-6 flex items-center gap-1 rounded-lg bg-gray-100 px-4 py-2.5 text-body-m-14 text-gray-900"
      >
        <GlobeIcon className="size-6" />
        Language Setting
      </button>

      <BottomSheet id="language-setting" title="Language Setting">
        <div className="flex w-full flex-col items-start">
          {languages.map((language) => (
            <div
              key={language.label}
              className="flex w-full items-center gap-2.5 p-4 text-body-m-14 text-black"
            >
              <span className="flex-1">{language.label}</span>
              {language.selected && <CheckIcon className="size-6 text-gray-400" />}
            </div>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}

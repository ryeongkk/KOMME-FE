"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, WarningIcon } from "@/components/icons";
import { TextField } from "@/components/ui/text-field";

const NICKNAME_PATTERN = /^[a-zA-Z0-9]{2,20}$/;
// ponytail: reserved-word check is a client-side stand-in for the real duplicate-check API,
// which doesn't exist yet. Swap this out once the backend endpoint is available.
const RESERVED_NICKNAMES = ["admin"];
const TOAST_DURATION_MS = 2500;

export function NicknameScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [touched, setTouched] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const isValidFormat = NICKNAME_PATTERN.test(nickname);
  const hasFormatError = touched && nickname.length > 0 && !isValidFormat;
  const canStart = isValidFormat && !isDuplicate;

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [showToast]);

  const handleChange = (value: string) => {
    setNickname(value);
    setIsDuplicate(false);
  };

  const handleStart = () => {
    if (!isValidFormat) return;
    if (RESERVED_NICKNAMES.includes(nickname.toLowerCase())) {
      setIsDuplicate(true);
      setShowToast(true);
      return;
    }
    // TODO: navigate to the sign-up completion screen once that route exists
  };

  return (
    <>
      <div className="flex w-full items-center justify-between py-2.5">
        <button type="button" aria-label="Back" onClick={() => router.back()} className="text-gray-900">
          <ArrowLeftIcon className="size-6" />
        </button>
        <p className="text-body-sb-16 text-black">Profile Setting</p>
        <div className="size-6" aria-hidden />
      </div>

      <div className="mt-4 w-full">
        <TextField
          name="nickname"
          label="Enter your nickname"
          placeholder="Enter your nickname"
          value={nickname}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          error={
            hasFormatError
              ? "Please use 2–20 characters, letters and numbers only."
              : isDuplicate
                ? "This nickname is already in use."
                : undefined
          }
          helperText="Please use 2–20 characters, letters and numbers only."
        />
      </div>

      <div className="relative mt-auto w-full">
        {isDuplicate && (
          <div
            role="alert"
            className={`absolute bottom-full left-1/2 mb-5 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-xl bg-gray-700 px-4 py-3 transition-all duration-300 ${
              showToast ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            }`}
          >
            <WarningIcon className="size-[18px] shrink-0 text-secondary-200" />
            <p className="text-body-m-14 text-white">This nickname is already in use.</p>
          </div>
        )}

        <button
          type="button"
          disabled={!canStart}
          onClick={handleStart}
          className={`flex h-[52px] w-full items-center justify-center rounded-lg text-body-m-14 ${
            canStart ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
          }`}
        >
          Start
        </button>
      </div>
    </>
  );
}

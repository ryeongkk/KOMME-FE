"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, WarningIcon } from "@/components/icons";
import { TextField } from "@/components/ui/text-field";

const NICKNAME_PATTERN = /^[a-zA-Z0-9]{2,20}$/;
const NICKNAME_HINT = "Please use 2–20 characters, letters and numbers only.";
// ponytail: reserved-word check stands in for the real duplicate-check API — same stand-in as login/nickname-screen.tsx
const RESERVED_NICKNAMES = ["admin"];
const TOAST_DURATION_MS = 2500;

export function EditProfileScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const isValidFormat = NICKNAME_PATTERN.test(nickname);
  const hasError = (nickname.length > 0 && !isValidFormat) || isDuplicate;
  const canEdit = isValidFormat && !isDuplicate;

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [showToast]);

  const handleChange = (value: string) => {
    setNickname(value);
    setIsDuplicate(false);
  };

  const handleEdit = () => {
    if (!canEdit) return;
    if (RESERVED_NICKNAMES.includes(nickname.toLowerCase())) {
      setIsDuplicate(true);
      setShowToast(true);
      return;
    }
    router.push("/my/account");
  };

  return (
    <>
      <div className="flex w-full items-center justify-between px-4 py-2.5">
        <button type="button" aria-label="Back" onClick={() => router.back()} className="text-gray-900">
          <ArrowLeftIcon className="size-6" />
        </button>
        <p className="text-body-sb-16 text-black">Edit Profile</p>
        <div className="size-6" aria-hidden />
      </div>

      <div className="mt-4 w-full px-4">
        <TextField
          name="nickname"
          label="Enter your new nickname"
          placeholder="Enter your nickname"
          value={nickname}
          onChange={handleChange}
          error={hasError ? NICKNAME_HINT : undefined}
          helperText={NICKNAME_HINT}
        />
      </div>

      <div className="relative mt-auto flex w-full flex-col px-4 pt-5 pb-3">
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
          disabled={!canEdit}
          onClick={handleEdit}
          className={`flex h-[53px] w-full items-center justify-center rounded-lg text-body-m-14 ${
            canEdit ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
          }`}
        >
          Edit
        </button>
      </div>
    </>
  );
}

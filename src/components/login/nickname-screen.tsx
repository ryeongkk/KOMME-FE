"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, WarningIcon } from "@/components/icons";
import { authErrorMessage } from "@/lib/api/auth-error-messages";
import { TextField } from "@/components/ui/text-field";
import { assertNicknameAvailable, NicknameTakenError } from "@/lib/api/user";

const NICKNAME_PATTERN = /^[a-zA-Z0-9]{2,20}$/;
const TOAST_DURATION_MS = 2500;

type NicknameScreenProps = {
  /** Reads the rest of the signup draft (email/password) and calls signup(). */
  onSubmit: (nickname: string) => Promise<void>;
};

export function NicknameScreen({ onSubmit }: NicknameScreenProps) {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [touched, setTouched] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const isValidFormat = NICKNAME_PATTERN.test(nickname);
  const hasFormatError = touched && nickname.length > 0 && !isValidFormat;

  const signupMutation = useMutation({
    mutationFn: async () => {
      await assertNicknameAvailable(nickname);
      await onSubmit(nickname);
    },
    onSuccess: () => router.push("/login"),
    onError: () => setShowToast(true),
  });

  const canStart = isValidFormat && !signupMutation.isPending;
  const isDuplicate = signupMutation.isError;
  // signup() below still catches a real duplicate via AUTH_409_2 as a second layer
  // (race condition between the availability check above and the actual signup call).
  const toastMessage = signupMutation.isError
    ? signupMutation.error instanceof NicknameTakenError
      ? "This nickname is already in use."
      : authErrorMessage(signupMutation.error, "Couldn't create your account. Please try again.")
    : null;

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [showToast]);

  const handleChange = (value: string) => {
    setNickname(value);
    signupMutation.reset();
  };

  const handleStart = () => {
    if (!canStart) return;
    signupMutation.mutate();
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
                ? toastMessage ?? undefined
                : undefined
          }
          helperText="Please use 2–20 characters, letters and numbers only."
        />
      </div>

      <div className="relative mt-auto w-full">
        {toastMessage && (
          <div
            role="alert"
            className={`absolute bottom-full left-1/2 mb-5 flex w-[301px] -translate-x-1/2 items-center gap-2 rounded-xl bg-gray-700 px-4 py-3 transition-all duration-300 ${
              showToast ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            }`}
          >
            <WarningIcon className="size-[18px] shrink-0 text-secondary-200" />
            <p className="text-body-m-14 text-white">{toastMessage}</p>
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
          {signupMutation.isPending ? "Creating account…" : "Start"}
        </button>
      </div>
    </>
  );
}

"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, WarningIcon } from "@/components/icons";
import { authErrorMessage } from "@/lib/api/auth-error-messages";

const CODE_LENGTH = 6;
const TIMER_SECONDS = 180;
const TOAST_DURATION_MS = 2500;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

type CodeScreenProps = {
  headerTitle: string;
  /** Route to continue to once the code is verified. */
  nextPath: string;
  /** Signup confirms an email-verification code, reset confirms a password-reset code — decided by the route's page.tsx. */
  onConfirm: (email: string, code: string) => Promise<void>;
  /** Re-sends the same kind of code this screen is confirming. */
  onResend: (email: string) => Promise<void>;
};

export function CodeScreen({ headerTitle, nextPath, onConfirm, onResend }: CodeScreenProps) {
  const router = useRouter();
  const email = useSearchParams().get("email") ?? "";
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [showToast, setShowToast] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isComplete = digits.every((digit) => digit.length === 1);
  const isExpired = secondsLeft <= 0;

  const confirmMutation = useMutation({
    mutationFn: (code: string) => onConfirm(email, code),
    onSuccess: () => router.push(nextPath),
    onError: () => setShowToast(true),
  });
  const resendMutation = useMutation({
    mutationFn: () => onResend(email),
    onError: () => setShowToast(true),
  });

  const canSubmit = isComplete && !isExpired && !confirmMutation.isPending;
  const incorrect = confirmMutation.isError;
  const errorMessage = incorrect
    ? authErrorMessage(confirmMutation.error, "The verification code is incorrect.")
    : resendMutation.isError
      ? authErrorMessage(resendMutation.error, "Couldn't resend the code. Please try again.")
      : null;

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [showToast]);

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    confirmMutation.reset();
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (resendMutation.isPending) return;
    resendMutation.mutate(undefined, {
      onSuccess: () => {
        setSecondsLeft(TIMER_SECONDS);
        setDigits(Array(CODE_LENGTH).fill(""));
        confirmMutation.reset();
        resendMutation.reset();
        inputRefs.current[0]?.focus();
      },
    });
  };

  const handleNext = () => {
    if (!canSubmit) return;
    confirmMutation.mutate(digits.join(""));
  };

  return (
    <>
      <div className="flex w-full items-center justify-between py-2.5">
        <button type="button" aria-label="Back" onClick={() => router.back()} className="text-gray-900">
          <ArrowLeftIcon className="size-6" />
        </button>
        <p className="text-body-sb-16 text-black">{headerTitle}</p>
        <div className="size-6" aria-hidden />
      </div>

      <div className="mt-4 flex w-full flex-col gap-3">
        <p className="text-heading-b-18 text-black">Enter verification code</p>

        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-1">
            <p className="text-body-sb-16 text-black">{email}</p>
            <p className="text-body-m-14 text-gray-500">
              We sent a verification code to your email.
              <br />
              Please enter the 6-digit code to verify your identity.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-[11px]">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleDigitChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  className={`h-[45px] w-12 rounded-lg border bg-white text-center text-body-sb-16 text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${
                    incorrect ? "border-negative" : "border-gray-200"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <p className="text-caption-m-12 text-gray-500">{formatTime(secondsLeft)}</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendMutation.isPending}
                className="border-b border-gray-500 text-caption-sb-12 text-gray-500"
              >
                {resendMutation.isPending ? "Resending…" : "Resend code"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-auto w-full">
        {errorMessage && (
          <div
            role="alert"
            className={`absolute bottom-full left-1/2 mb-5 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-xl bg-gray-700 px-4 py-3 transition-all duration-300 ${
              showToast ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            }`}
          >
            <WarningIcon className="size-[18px] shrink-0 text-secondary-200" />
            <p className="text-body-m-14 text-white">{errorMessage}</p>
          </div>
        )}

        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleNext}
          className={`flex h-[52px] w-full items-center justify-center rounded-lg text-body-m-14 ${
            canSubmit ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
          }`}
        >
          {confirmMutation.isPending ? "Verifying…" : "Next"}
        </button>
      </div>
    </>
  );
}

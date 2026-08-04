"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon } from "@/components/icons";
import { TextField } from "@/components/ui/text-field";

const PASSWORD_HINT = "Password must be 8–20 characters with letters, numbers, and special characters.";
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/;

type PasswordScreenProps = {
  headerTitle: string;
  heading: string;
  /** Route to continue to once the password is confirmed. */
  nextPath: string;
};

export function PasswordScreen({ headerTitle, heading, nextPath }: PasswordScreenProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [touchedConfirm, setTouchedConfirm] = useState(false);

  const isValidPassword = PASSWORD_PATTERN.test(password);
  const hasPasswordError = touchedPassword && password.length > 0 && !isValidPassword;

  const isMismatched = touchedConfirm && confirmPassword.length > 0 && confirmPassword !== password;
  const isConfirmed = confirmPassword.length > 0 && confirmPassword === password && isValidPassword;
  const canSubmit = isValidPassword && isConfirmed;

  const handleNext = () => {
    if (!canSubmit) return;
    router.push(nextPath);
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

      <div className="mt-4 flex w-full flex-col gap-4">
        <p className="text-heading-b-18 text-black">{heading}</p>

        <TextField
          name="password"
          label="Password"
          labelVariant="field"
          type="password"
          maxLength={20}
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          onBlur={() => setTouchedPassword(true)}
          error={hasPasswordError ? PASSWORD_HINT : undefined}
          helperText={PASSWORD_HINT}
        />

        <TextField
          name="confirm password"
          label="Confirm Password"
          labelVariant="field"
          type="password"
          maxLength={20}
          placeholder="Enter your password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          onBlur={() => setTouchedConfirm(true)}
          error={isMismatched ? "Passwords do not match" : undefined}
          helperText={isConfirmed ? "Password confirmed." : undefined}
        />
      </div>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={handleNext}
        className={`mt-auto flex h-[52px] w-full items-center justify-center rounded-lg text-body-m-14 ${
          canSubmit ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
        }`}
      >
        Next
      </button>
    </>
  );
}

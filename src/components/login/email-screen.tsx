"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon } from "@/components/icons";
import { TextField } from "@/components/ui/text-field";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type EmailScreenProps = {
  headerTitle: string;
  heading: string;
  /** Route to continue to once the email is valid; the email is appended as a `?email=` query param. */
  nextPath: string;
};

export function EmailScreen({ headerTitle, heading, nextPath }: EmailScreenProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const isValidEmail = EMAIL_PATTERN.test(email);
  const hasError = touched && email.length > 0 && !isValidEmail;

  const handleNext = () => {
    if (!isValidEmail) return;
    router.push(`${nextPath}?email=${encodeURIComponent(email)}`);
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

      <div className="mt-4 w-full">
        <TextField
          name="email"
          label={heading}
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={setEmail}
          onBlur={() => setTouched(true)}
          error={hasError ? "Please enter a valid email address." : undefined}
        />
      </div>

      <button
        type="button"
        disabled={!isValidEmail}
        onClick={handleNext}
        className={`mt-auto flex h-[52px] w-full items-center justify-center rounded-lg text-body-m-14 ${
          isValidEmail ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
        }`}
      >
        Next
      </button>
    </>
  );
}

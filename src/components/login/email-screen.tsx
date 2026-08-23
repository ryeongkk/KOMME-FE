"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeftIcon } from "@/components/icons";
import { TextField } from "@/components/ui/text-field";
import { authErrorMessage } from "@/lib/api/auth-error-messages";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type EmailScreenProps = {
  headerTitle: string;
  heading: string;
  /** Previous step, or leave the wizard entirely — decided by the orchestrating page.tsx. */
  onBack: () => void;
  /** Signup sends an email-verification code, reset sends a password-reset code — decided by the route's page.tsx. */
  onSubmit: (email: string) => Promise<void>;
  /** Advance to the next step once the email is valid. */
  onNext: () => void;
};

export function EmailScreen({ headerTitle, heading, onBack, onSubmit, onNext }: EmailScreenProps) {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const isValidEmail = EMAIL_PATTERN.test(email);
  const hasFormatError = touched && email.length > 0 && !isValidEmail;

  const sendCodeMutation = useMutation({
    mutationFn: () => onSubmit(email),
    onSuccess: onNext,
  });

  const errorMessage = sendCodeMutation.isError
    ? authErrorMessage(sendCodeMutation.error)
    : hasFormatError
      ? "Please enter a valid email address."
      : undefined;

  const handleNext = () => {
    if (!isValidEmail || sendCodeMutation.isPending) return;
    sendCodeMutation.mutate();
  };

  return (
    <>
      <div className="flex w-full items-center justify-between py-2.5">
        <button type="button" aria-label="Back" onClick={onBack} className="text-gray-900">
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
          error={errorMessage}
        />
      </div>

      <button
        type="button"
        disabled={!isValidEmail || sendCodeMutation.isPending}
        onClick={handleNext}
        className={`mt-auto flex h-[52px] w-full items-center justify-center rounded-lg text-body-m-14 ${
          isValidEmail ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
        }`}
      >
        {sendCodeMutation.isPending ? "Sending…" : "Next"}
      </button>
    </>
  );
}

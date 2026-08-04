"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon, CheckIcon } from "@/components/icons";

const REQUIRED_TERMS = [
  { key: "age", label: "[Required] I am over 14 years old" },
  { key: "terms", label: "[Required] Terms of Use" },
  { key: "privacy", label: "[Required] Collection and Use of Personal Information" },
] as const;

type RequiredKey = (typeof REQUIRED_TERMS)[number]["key"];

export function TermsScreen() {
  const router = useRouter();
  const [checked, setChecked] = useState<Record<RequiredKey, boolean>>({
    age: false,
    terms: false,
    privacy: false,
  });

  const allChecked = REQUIRED_TERMS.every((term) => checked[term.key]);

  return (
    <>
      <div className="flex w-full items-center py-2.5">
        <button type="button" aria-label="Back" onClick={() => router.back()} className="text-gray-900">
          <ArrowLeftIcon className="size-6" />
        </button>
      </div>

      <div className="mt-4 flex w-full flex-col gap-4">
        <div className="flex w-full flex-col gap-1">
          <p className="text-heading-b-18 text-black">Welcome!</p>
          <p className="text-body-m-16 text-gray-600">You need to agree to use Komme</p>
        </div>

        <button
          type="button"
          aria-pressed={allChecked}
          onClick={() =>
            setChecked(
              allChecked
                ? { age: false, terms: false, privacy: false }
                : { age: true, terms: true, privacy: true },
            )
          }
          className={`flex h-[52px] w-full items-center gap-2.5 rounded-lg border p-4 text-body-m-14 ${
            allChecked
              ? "border-secondary-100 bg-secondary-100 text-secondary-300"
              : "border-gray-100 bg-white text-gray-500"
          }`}
        >
          <CheckIcon className={`size-6 shrink-0 ${allChecked ? "text-secondary-300" : "text-gray-400"}`} />
          I agree to the terms of use.
        </button>

        <div className="flex w-full flex-col gap-3 px-8">
          {REQUIRED_TERMS.map((term) => (
            <button
              key={term.key}
              type="button"
              aria-pressed={checked[term.key]}
              onClick={() => setChecked((prev) => ({ ...prev, [term.key]: !prev[term.key] }))}
              className="flex w-full items-center gap-3 text-left text-body-m-14 text-black"
            >
              <CheckIcon
                className={`size-6 shrink-0 ${checked[term.key] ? "text-secondary-300" : "text-gray-400"}`}
              />
              {term.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        disabled={!allChecked}
        onClick={() => router.push("/login/email")}
        className={`mt-auto flex h-[52px] w-full items-center justify-center rounded-lg text-body-m-14 ${
          allChecked ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
        }`}
      >
        Next
      </button>
    </>
  );
}

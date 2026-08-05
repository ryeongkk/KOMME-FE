"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon, CheckboxEmptyIcon, CheckboxFillIcon } from "@/components/icons";

const NOTICES = [
  "All account information will be deleted and cannot be recovered even if you sign up again.",
  "You cannot sign up with the same account for 7 days after deleting your account.",
];

export function DeleteAccountScreen() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  return (
    <>
      <div className="flex w-full items-center justify-between px-4 py-2.5">
        <button type="button" aria-label="Back" onClick={() => router.back()} className="text-gray-900">
          <ArrowLeftIcon className="size-6" />
        </button>
        <p className="text-body-sb-16 text-black">Delete Account</p>
        <div className="size-6" aria-hidden />
      </div>

      <div className="flex w-full flex-col gap-3 px-4 pt-4">
        <p className="text-heading-b-18 text-black">Things to know before deleting your account</p>
        <ul className="flex flex-col gap-2 text-body-m-14 text-gray-500">
          {NOTICES.map((notice) => (
            <li key={notice} className="list-disc ms-[21px] leading-[1.5]">
              {notice}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex w-full flex-col gap-4 px-4 pt-5 pb-3">
        <button
          type="button"
          aria-pressed={agreed}
          onClick={() => setAgreed((prev) => !prev)}
          className="flex items-center gap-2 text-left text-body-m-14 text-black"
        >
          {agreed ? (
            <CheckboxFillIcon className="size-6 shrink-0 text-primary" />
          ) : (
            <CheckboxEmptyIcon className="size-6 shrink-0 text-gray-300" />
          )}
          I have read and agree to the above notice.
        </button>

        <button
          type="button"
          disabled={!agreed}
          popoverTarget="delete-confirm-dialog"
          className={`flex h-[53px] w-full items-center justify-center rounded-lg text-body-m-14 ${
            agreed ? "bg-negative text-white" : "bg-gray-100 text-gray-400"
          }`}
        >
          Delete Account
        </button>
      </div>

      {/* ponytail: no auth session to clear yet, confirming just returns to the login screen — same stand-in as my-account-screen.tsx logout dialog */}
      <div
        id="delete-confirm-dialog"
        popover="auto"
        className="fixed inset-0 m-auto h-fit w-[299px] flex-col items-start gap-3 rounded-2xl border-0 bg-white p-4 [&::backdrop]:bg-black/30 [&:popover-open]:flex"
      >
        <div className="flex w-full flex-col gap-0.5">
          <p className="w-full text-body-sb-16 text-black">Final Confirmation</p>
          <p className="w-full text-body-m-14 text-gray-600">
            {`Are you sure you want to permanently delete your account? This action cannot be undone.`}
          </p>
        </div>
        <div className="flex gap-[9px]">
          <button
            type="button"
            popoverTarget="delete-confirm-dialog"
            popoverTargetAction="hide"
            className="h-10 w-[129px] rounded-lg border border-gray-100 bg-white text-body-m-14 text-gray-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="h-10 w-[129px] rounded-lg bg-negative text-body-m-14 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

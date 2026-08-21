"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon, CheckIcon } from "@/components/icons";
import { updatePreferredLanguage, type PreferredLanguage } from "@/lib/api/user";

const LANGUAGES = ["English", "日本語", "中文"] as const;
// ponytail: app is English-only for now (see AGENTS.md) — "English" stands in for the active locale.
const CURRENT_LANGUAGE: (typeof LANGUAGES)[number] = "English";
const LANGUAGE_CODES: Record<(typeof LANGUAGES)[number], PreferredLanguage> = {
  English: "ENGLISH",
  日本語: "JAPANESE",
  中文: "CHINESE_SIMPLIFIED",
};

export function LanguageSettingScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<(typeof LANGUAGES)[number]>(CURRENT_LANGUAGE);

  const canConfirm = selected !== CURRENT_LANGUAGE;

  // ponytail: this persists the preference via the User API, but there's still no i18n
  // routing — picking 日本語/中文 saves the choice without changing this UI's language yet.
  const confirmMutation = useMutation({
    mutationFn: () => updatePreferredLanguage(LANGUAGE_CODES[selected]),
    // replace, not push — otherwise Back from /my lands right back on this
    // now-stale language screen instead of skipping past it.
    onSuccess: () => router.replace("/my"),
  });

  return (
    <>
      <div className="flex w-full items-center justify-between px-4 py-2.5">
        <button type="button" aria-label="Back" onClick={() => router.back()} className="text-gray-900">
          <ArrowLeftIcon className="size-6" />
        </button>
        <p className="text-body-sb-16 text-black">Language Setting</p>
        <div className="size-6" aria-hidden />
      </div>

      <div className="flex w-full flex-1 flex-col">
        {LANGUAGES.map((language) => (
          <button
            key={language}
            type="button"
            aria-pressed={selected === language}
            onClick={() => setSelected(language)}
            className="flex w-full items-center gap-2.5 p-4 text-left text-body-m-14 text-black"
          >
            <span className="flex-1">{language}</span>
            {selected === language && <CheckIcon className="size-6 text-gray-400" />}
          </button>
        ))}
      </div>

      <div className="mt-auto flex w-full flex-col px-4 pt-5 pb-6">
        {confirmMutation.isError && (
          <p role="alert" className="mb-2 text-caption-r-12 text-negative">
            Something went wrong. Please try again.
          </p>
        )}
        <button
          type="button"
          disabled={!canConfirm || confirmMutation.isPending}
          onClick={() => confirmMutation.mutate()}
          className={`flex h-[53px] w-full items-center justify-center rounded-lg text-body-m-14 ${
            canConfirm ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
          }`}
        >
          {confirmMutation.isPending ? "Saving…" : "Confirm"}
        </button>
      </div>
    </>
  );
}

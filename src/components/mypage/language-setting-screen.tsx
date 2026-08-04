"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeftIcon, CheckIcon } from "@/components/icons";

const LANGUAGES = ["English", "日本語", "中文"] as const;
// ponytail: app is English-only for now (see AGENTS.md) — "English" stands in for the active locale.
const CURRENT_LANGUAGE: (typeof LANGUAGES)[number] = "English";

export function LanguageSettingScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<(typeof LANGUAGES)[number]>(CURRENT_LANGUAGE);

  const canConfirm = selected !== CURRENT_LANGUAGE;

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
            onClick={() => setSelected(language)}
            className="flex w-full items-center gap-2.5 p-4 text-left text-body-m-14 text-black"
          >
            <span className="flex-1">{language}</span>
            {selected === language && <CheckIcon className="size-6 text-gray-400" />}
          </button>
        ))}
      </div>

      {/* ponytail: no i18n routing yet — Confirm just returns to My once a locale can actually be applied */}
      <div className="mt-auto flex w-full flex-col px-4 pt-5 pb-6">
        <button
          type="button"
          disabled={!canConfirm}
          onClick={() => router.push("/mypage")}
          className={`flex h-[53px] w-full items-center justify-center rounded-lg text-body-m-14 ${
            canConfirm ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
          }`}
        >
          Confirm
        </button>
      </div>
    </>
  );
}

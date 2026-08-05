"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";

export function TermsPolicyDetailScreen({ title }: { title: string }) {
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-between px-4 py-2.5">
      <button type="button" aria-label="Back" onClick={() => router.back()} className="text-gray-900">
        <ArrowLeftIcon className="size-6" />
      </button>
      <p className="text-body-sb-16 text-black">{title}</p>
      <div className="size-6" aria-hidden />
    </div>
  );
}

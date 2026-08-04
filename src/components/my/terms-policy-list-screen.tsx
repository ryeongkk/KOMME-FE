"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";

const TERMS_LINKS = [
  { label: "Terms of Service", href: "/my/terms/service" },
  { label: "Privacy Policy", href: "/my/terms/privacy" },
  { label: "Location-Based Service Terms", href: "/my/terms/location" },
] as const;

export function TermsPolicyListScreen() {
  const router = useRouter();

  return (
    <>
      <div className="flex w-full items-center justify-between px-4 py-2.5">
        <button type="button" aria-label="Back" onClick={() => router.back()} className="text-gray-900">
          <ArrowLeftIcon className="size-6" />
        </button>
        <p className="text-body-sb-16 text-black">Terms & Policies</p>
        <div className="size-6" aria-hidden />
      </div>

      <div className="flex w-full flex-col">
        {TERMS_LINKS.map((link) => (
          <button
            key={link.href}
            type="button"
            onClick={() => router.push(link.href)}
            className="w-full p-4 text-left text-body-m-14 text-black"
          >
            {link.label}
          </button>
        ))}
      </div>
    </>
  );
}

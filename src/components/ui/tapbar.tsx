"use client";

import { useRouter } from "next/navigation";
import { HomeIcon, MapIcon, MypageIcon } from "@/components/icons";

const TABS = [
  { key: "home", label: "Home", href: "/", Icon: HomeIcon },
  { key: "course", label: "Course", href: null, Icon: MapIcon },
  { key: "my", label: "My", href: "/my", Icon: MypageIcon },
] as const;

type TapbarProps = {
  active: (typeof TABS)[number]["key"];
};

export function Tapbar({ active }: TapbarProps) {
  const router = useRouter();

  return (
    <div className="sticky bottom-0 z-10 flex w-full items-center border-t border-gray-100 bg-white py-2">
      {TABS.map(({ key, label, href, Icon }) => {
        const selected = key === active;
        const color = selected ? "text-gray-700" : "text-gray-300";
        return (
          <button
            key={key}
            type="button"
            // ponytail: Course tab has no route yet (href: null), wire up when /course exists
            disabled={!href}
            aria-current={selected ? "page" : undefined}
            onClick={() => href && router.push(href)}
            className="flex flex-1 flex-col items-center justify-center gap-0.5"
          >
            <Icon className={`size-6 ${color}`} />
            <span className={`text-caption-m-12 ${color}`}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

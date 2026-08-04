import { CheckIcon } from "@/components/icons";
import { BottomSheet } from "@/components/ui/bottom-sheet";

const LANGUAGES = [
  { label: "English", selected: true },
  { label: "中文", selected: false },
  { label: "日本語", selected: false },
];

export function LanguageBottomSheet({ id }: { id: string }) {
  return (
    <BottomSheet id={id} title="Language Setting">
      <div className="flex w-full flex-col items-start">
        {LANGUAGES.map((language) => (
          <div
            key={language.label}
            className="flex w-full items-center gap-2.5 p-4 text-body-m-14 text-black"
          >
            <span className="flex-1">{language.label}</span>
            {language.selected && <CheckIcon className="size-6 text-gray-400" />}
          </div>
        ))}
      </div>
    </BottomSheet>
  );
}

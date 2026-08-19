import type { ReactNode } from "react";

type BottomSheetProps = {
  id: string;
  title?: string;
  children: ReactNode;
};

export function BottomSheet({ id, title, children }: BottomSheetProps) {
  return (
    <div
      id={id}
      popover="auto"
      className="bottom-sheet fixed inset-x-0 top-auto bottom-0 m-auto w-full max-w-sm flex-col gap-3 rounded-t-[30px] border-0 bg-white p-0 pt-5"
    >
      <div className="flex w-full items-center justify-center">
        <div className="h-1 w-[30px] rounded-full bg-gray-200" />
      </div>
      {title && (
        <p className="flex w-full items-center justify-center text-body-sb-14 text-black">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

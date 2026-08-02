"use client";

import { CloseIcon } from "@/components/icons";

type TextFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
};

export function TextField({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  placeholder,
  type = "text",
}: TextFieldProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <p className="text-heading-b-18 text-black">{label}</p>

      <div className="flex w-full flex-col gap-1">
        <div
          className={`flex h-12 w-full items-center gap-2.5 rounded-lg border bg-white p-4 ${
            error ? "border-negative" : "border-gray-200"
          }`}
        >
          <input
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            className="flex-1 text-body-m-14 text-gray-900 placeholder-gray-400 outline-none"
          />
          {value.length > 0 && (
            <button
              type="button"
              aria-label={`Clear ${name}`}
              onClick={() => onChange("")}
              className="shrink-0 text-gray-400"
            >
              <CloseIcon className="size-4" />
            </button>
          )}
        </div>
        {(error ?? helperText) && (
          <p className={`text-caption-r-12 ${error ? "text-negative" : "text-gray-500"}`}>{error ?? helperText}</p>
        )}
      </div>
    </div>
  );
}

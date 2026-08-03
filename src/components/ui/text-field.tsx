"use client";

import { useState } from "react";
import { CloseIcon, EyeIcon, EyeOffIcon } from "@/components/icons";

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
  maxLength?: number;
  /** "heading" (default) renders label as the screen's own heading (email/nickname screens, one field each). "field" renders a smaller per-field label for screens with multiple labeled fields (e.g. password + confirm password). */
  labelVariant?: "heading" | "field";
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
  labelVariant = "heading",
  maxLength,
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`flex w-full flex-col ${labelVariant === "field" ? "gap-1" : "gap-4"}`}>
      <p className={labelVariant === "field" ? "text-body-sb-14 text-gray-500" : "text-heading-b-18 text-black"}>
        {label}
      </p>

      <div className="flex w-full flex-col gap-1">
        <div
          className={`flex h-12 w-full items-center gap-2.5 rounded-lg border bg-white p-4 ${
            error ? "border-negative" : "border-gray-200"
          }`}
        >
          <input
            type={inputType}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            maxLength={maxLength}
            className="flex-1 text-body-m-14 text-gray-900 placeholder-gray-400 outline-none"
          />
          {value.length > 0 &&
            (isPassword ? (
              <button
                type="button"
                aria-label={showPassword ? `Hide ${name}` : `Show ${name}`}
                onClick={() => setShowPassword((prev) => !prev)}
                className="shrink-0 text-gray-400"
              >
                {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
              </button>
            ) : (
              <button
                type="button"
                aria-label={`Clear ${name}`}
                onClick={() => onChange("")}
                className="shrink-0 text-gray-400"
              >
                <CloseIcon className="size-4" />
              </button>
            ))}
        </div>
        {(error ?? helperText) && (
          <p className={`text-caption-r-12 ${error ? "text-negative" : "text-gray-500"}`}>{error ?? helperText}</p>
        )}
      </div>
    </div>
  );
}

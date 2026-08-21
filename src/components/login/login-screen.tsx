"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppleIcon, CheckIcon, GlobeIcon, GoogleIcon } from "@/components/icons";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { login } from "@/lib/api/auth";
import { saveAuthTokens } from "@/lib/auth-tokens";
import { ApiError } from "@/lib/api/client";

const languages = [
  { label: "English", selected: true },
  { label: "中文", selected: false },
  { label: "日本語", selected: false },
];

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: () => login({ email, password, preferredLanguage: "ENGLISH" }),
    onSuccess: (data) => {
      saveAuthTokens(data);
      router.push("/");
    },
  });

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loginMutation.isPending;

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    loginMutation.mutate();
  };

  const errorMessage = loginMutation.isError
    ? loginMutation.error instanceof ApiError && loginMutation.error.code === "AUTH_401_1"
      ? "Incorrect email or password."
      : "Something went wrong. Please try again."
    : null;

  return (
    <>
      <p className="mt-[150.5px] text-title-b-20 text-black">Logo</p>

      <form onSubmit={handleLogin} className="mt-[103.5px] flex w-full flex-col gap-4">
        <div className="flex w-full flex-col gap-5">
          <div className="flex w-full flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="h-12 w-full rounded-lg border border-gray-200 bg-white p-4 text-body-m-14 text-gray-900 placeholder-gray-400"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="h-12 w-full rounded-lg border border-gray-200 bg-white p-4 text-body-m-14 text-gray-900 placeholder-gray-400"
            />
            {errorMessage && (
              <p role="alert" className="text-caption-r-12 text-negative">
                {errorMessage}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={!canSubmit}
            className={`flex h-[52px] w-full items-center justify-center rounded-lg text-body-m-14 ${
              canSubmit ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
            }`}
          >
            {loginMutation.isPending ? "Logging in…" : "Login"}
          </button>
        </div>

        <div className="flex items-center justify-center gap-5 text-body-m-14 text-black">
          <button type="button" onClick={() => router.push("/login/terms")}>
            Sign Up
          </button>
          <span aria-hidden>|</span>
          <button type="button" onClick={() => router.push("/login/reset/email")}>
            Reset Password
          </button>
        </div>
      </form>

      <div className="mt-[98px] flex items-center gap-5">
        <button
          type="button"
          aria-label="Continue with Apple"
          className="flex size-[60px] items-center justify-center rounded-full bg-black"
        >
          <AppleIcon className="h-[25px] w-[20px]" />
        </button>
        <button
          type="button"
          aria-label="Continue with Google"
          className="flex size-[60px] items-center justify-center rounded-full border border-gray-400 bg-white"
        >
          <GoogleIcon className="size-[22px]" />
        </button>
      </div>

      <button
        type="button"
        popoverTarget="language-setting"
        className="mt-6 flex items-center gap-1 rounded-lg bg-gray-100 px-4 py-2.5 text-body-m-14 text-gray-900"
      >
        <GlobeIcon className="size-6" />
        Language Setting
      </button>

      <BottomSheet id="language-setting" title="Language Setting">
        <div className="flex w-full flex-col items-start">
          {languages.map((language) => (
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
    </>
  );
}

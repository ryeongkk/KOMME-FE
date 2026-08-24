"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { AppleIcon, CheckIcon, GlobeIcon } from "@/components/icons";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { NicknameScreen } from "@/components/login/nickname-screen";
import { completeOAuthProfile, login, loginWithGoogle } from "@/lib/api/auth";
import { saveAuthTokens } from "@/lib/auth-tokens";
import { ApiError } from "@/lib/api/client";

const languages = [
  { label: "English", selected: true },
  { label: "中文", selected: false },
  { label: "日本語", selected: false },
];

// Google Identity Services isn't published with types — this is only the slice this file
// calls. https://developers.google.com/identity/gsi/web/reference/js-reference
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize(config: { client_id: string; callback: (response: { credential: string }) => void }): void;
          renderButton(
            parent: HTMLElement,
            options: { type: "icon"; shape: "circle"; size: "large" },
          ): void;
        };
      };
    };
  }
}

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // "nickname" = Google login came back with profileCompleted: false (first-time social
  // signup, no nickname yet) — reuses the signup wizard's NicknameScreen in place.
  const [step, setStep] = useState<"login" | "nickname">("login");
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const loginMutation = useMutation({
    mutationFn: () => login({ email, password, preferredLanguage: "ENGLISH" }),
    onSuccess: (data) => {
      saveAuthTokens(data);
      router.push("/");
    },
  });

  const googleMutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: (data) => {
      saveAuthTokens(data);
      if (data.profileCompleted) router.push("/");
      else setStep("nickname");
    },
  });

  // renderButton over prompt(): prompt() drives Google's FedCM-based One Tap, which in
  // practice aborts silently (or with a console "AbortError: signal is aborted without
  // reason") far too often to trust. renderButton draws Google's own clickable button,
  // which uses a plain popup instead of FedCM.
  useEffect(() => {
    if (!googleScriptLoaded || !window.google || !googleButtonRef.current) return;
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: (response) => googleMutation.mutate(response.credential),
    });
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      type: "icon",
      shape: "circle",
      size: "large",
    });
    // googleMutation.mutate is a stable react-query reference — safe to omit from deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleScriptLoaded]);

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

  if (step === "nickname") {
    return (
      <NicknameScreen
        onBack={() => setStep("login")}
        onSubmit={completeOAuthProfile}
        onNext={() => router.push("/")}
      />
    );
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setGoogleScriptLoaded(true)}
      />
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
        {/* Google renders its own real button (iframe) into this node via renderButton —
            "large" icon buttons come out ~40px with no pixel-size option, short of the
            60px Apple circle next to it, so scale it up to match instead. */}
        <div className="flex size-[60px] items-center justify-center">
          <div ref={googleButtonRef} aria-label="Continue with Google" className="scale-150" />
        </div>
      </div>
      {googleMutation.isError && (
        <p role="alert" className="mt-2 text-caption-r-12 text-negative">
          Google login failed. Please try again.
        </p>
      )}

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

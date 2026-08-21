"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// Carries the signup wizard's collected fields across route hops (/login/email →
// /login/code → /login/password → /login/nickname), which each mount as a fresh page —
// a plain useState in one of them wouldn't survive navigating to the next.
//
// In-memory only (React Context provided by src/app/login/layout.tsx, which doesn't
// remount across these routes) — deliberately NOT sessionStorage. A signup password sits
// here only until the wizard is submitted or abandoned; Web Storage is readable by any
// same-origin script via a single enumerable API (trivial full-dump for any XSS payload,
// and by any browser extension with site-data access) in a way in-memory state isn't. A
// page reload mid-signup loses the draft — that already surfaces as the existing "session
// expired, start over from the email step" error, so there's no UX regression.
type SignupDraft = { email?: string; password?: string };

type SignupDraftContextValue = {
  draft: SignupDraft;
  save: (patch: SignupDraft) => void;
  clear: () => void;
};

const SignupDraftContext = createContext<SignupDraftContextValue | null>(null);

export function SignupDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<SignupDraft>({});
  const value: SignupDraftContextValue = {
    draft,
    save: (patch) => setDraft((prev) => ({ ...prev, ...patch })),
    clear: () => setDraft({}),
  };
  return <SignupDraftContext.Provider value={value}>{children}</SignupDraftContext.Provider>;
}

export function useSignupDraft(): SignupDraftContextValue {
  const context = useContext(SignupDraftContext);
  if (!context) throw new Error("useSignupDraft must be used within src/app/login/layout.tsx");
  return context;
}

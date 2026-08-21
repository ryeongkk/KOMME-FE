"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Carries the signup wizard's collected fields across route hops (/login/email →
// /login/code → /login/password → /login/nickname), which each mount as a fresh page —
// a plain useState in one of them wouldn't survive navigating to the next.
//
// In-memory only (React Context provided by src/app/login/layout.tsx, which doesn't
// remount across these routes) for `password` — deliberately NOT sessionStorage. A signup
// password is a credential; Web Storage is readable by any same-origin script via a single
// enumerable API (trivial full-dump for any XSS payload, and by any browser extension with
// site-data access) in a way in-memory state isn't, so it never touches storage.
//
// `email` is the one field mirrored to sessionStorage below. It isn't a credential — leaking
// it only reveals "this address tried to sign up here", not account access — and mirroring
// it means a reload mid-wizard only loses the one step that actually needs `password`
// (nickname) instead of bouncing every later step back to /login/email (see
// useRequiredSignupDraft). ponytail: this does mean email is readable by the same XSS/
// extension surface password is deliberately kept off of — accepted since email alone isn't
// an account-takeover vector. Revisit if that stops being true (e.g. email becomes usable
// as a passwordless login token).
const EMAIL_KEY = "komme.signupEmail";

type SignupDraft = { email?: string; password?: string };

type SignupDraftContextValue = {
  draft: SignupDraft;
  save: (patch: SignupDraft) => void;
  clear: () => void;
};

const SignupDraftContext = createContext<SignupDraftContextValue | null>(null);

function initialDraft(): SignupDraft {
  if (typeof window === "undefined") return {};
  const email = sessionStorage.getItem(EMAIL_KEY);
  return email ? { email } : {};
}

export function SignupDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<SignupDraft>(initialDraft);
  const value: SignupDraftContextValue = {
    draft,
    save: (patch) => {
      setDraft((prev) => ({ ...prev, ...patch }));
      if (patch.email) sessionStorage.setItem(EMAIL_KEY, patch.email);
    },
    clear: () => {
      setDraft({});
      sessionStorage.removeItem(EMAIL_KEY);
    },
  };
  return <SignupDraftContext.Provider value={value}>{children}</SignupDraftContext.Provider>;
}

export function useSignupDraft(): SignupDraftContextValue {
  const context = useContext(SignupDraftContext);
  if (!context) throw new Error("useSignupDraft must be used within src/app/login/layout.tsx");
  return context;
}

// Every /login/* step past the first (email) requires some subset of the draft to already
// be filled in. `email` survives a reload (see EMAIL_KEY above) but `password` doesn't, so
// in practice only /login/nickname's guard can still fire after one — without this guard a
// step would render normally and only fail once its onSubmit runs (or, worse for
// /login/code, fire an API call with an empty email). Redirects to /login/email and renders
// nothing until the requested keys are present; narrows the return type so callers don't
// need `!` asserts.
export function useRequiredSignupDraft<K extends keyof SignupDraft>(
  ...keys: K[]
): Required<Pick<SignupDraft, K>> | null {
  const { draft } = useSignupDraft();
  const router = useRouter();
  // Snapshotted once on mount, not re-read from `draft` on every render. /login/nickname's
  // own onSubmit calls clear() right before navigating away on success — if this stayed
  // reactive, that clear() would flip `ready` to false while this page is still mounted,
  // firing the redirect below in a race against the real "signup succeeded" navigation
  // (and sometimes winning it, bouncing a just-completed signup back to /login/email).
  // Each step is a fresh mount anyway (separate route), so "checked once at mount" is the
  // right scope — this only needs to catch "arrived here without the data", not react to
  // this same page clearing its own data on the way out.
  const [snapshot] = useState<Required<Pick<SignupDraft, K>> | null>(() =>
    keys.every((key) => Boolean(draft[key])) ? (draft as Required<Pick<SignupDraft, K>>) : null,
  );

  useEffect(() => {
    if (!snapshot) router.replace("/login/email");
  }, [snapshot, router]);

  return snapshot;
}

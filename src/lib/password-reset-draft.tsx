"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Carries the password-reset wizard's email + one-time resetToken across route hops
// (/login/reset/email → /login/reset/code → /login/reset/password), kept as a separate
// provider from signup-draft.tsx since the two wizards can be mid-flight at once. Same
// in-memory-vs-sessionStorage split and reasoning as signup-draft.tsx: `resetToken` is a
// bearer credential (anyone holding it can reset the password without the old one) so it
// stays in-memory only; `email` is mirrored to sessionStorage since it isn't a credential.
const EMAIL_KEY = "komme.resetEmail";

type PasswordResetDraft = { email?: string; resetToken?: string };

type PasswordResetDraftContextValue = {
  draft: PasswordResetDraft;
  save: (patch: PasswordResetDraft) => void;
  clear: () => void;
};

const PasswordResetDraftContext = createContext<PasswordResetDraftContextValue | null>(null);

function initialDraft(): PasswordResetDraft {
  if (typeof window === "undefined") return {};
  const email = sessionStorage.getItem(EMAIL_KEY);
  return email ? { email } : {};
}

export function PasswordResetDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<PasswordResetDraft>(initialDraft);
  const value: PasswordResetDraftContextValue = {
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
  return <PasswordResetDraftContext.Provider value={value}>{children}</PasswordResetDraftContext.Provider>;
}

export function useResetDraft(): PasswordResetDraftContextValue {
  const context = useContext(PasswordResetDraftContext);
  if (!context) throw new Error("useResetDraft must be used within src/app/login/layout.tsx");
  return context;
}

// Same reasoning as useRequiredSignupDraft (signup-draft.tsx) — redirects to
// /login/reset/email and renders nothing until the requested keys are present. In practice
// only /login/reset/password's guard (needs resetToken) can still fire after a reload,
// since email survives it.
export function useRequiredResetDraft<K extends keyof PasswordResetDraft>(
  ...keys: K[]
): Required<Pick<PasswordResetDraft, K>> | null {
  const { draft } = useResetDraft();
  const router = useRouter();
  const ready = keys.every((key) => Boolean(draft[key]));

  useEffect(() => {
    if (!ready) router.replace("/login/reset/email");
  }, [ready, router]);

  return ready ? (draft as Required<Pick<PasswordResetDraft, K>>) : null;
}

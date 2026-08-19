// Carries the password-reset wizard's email + one-time resetToken across route hops
// (/login/reset/email → /login/reset/code → /login/reset/password) — same reasoning as
// signup-draft.ts, kept as a separate key since the two wizards can be mid-flight at once.
type PasswordResetDraft = { email?: string; resetToken?: string };
const KEY = "komme.passwordResetDraft";

export function savePasswordResetDraft(patch: PasswordResetDraft): void {
  sessionStorage.setItem(KEY, JSON.stringify({ ...readPasswordResetDraft(), ...patch }));
}

export function readPasswordResetDraft(): PasswordResetDraft {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function clearPasswordResetDraft(): void {
  sessionStorage.removeItem(KEY);
}

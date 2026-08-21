// Carries the signup wizard's collected fields across route hops (/login/email →
// /login/code → /login/password → /login/nickname), which each mount as a fresh page —
// a plain useState in one of them wouldn't survive navigating to the next.
// ponytail: sessionStorage, plaintext password included — same trust boundary as React
// state (both readable by same-origin JS/XSS), cleared on tab close. Revisit if signup
// ever needs to survive a page reload or a stricter password-at-rest policy.
type SignupDraft = { email?: string; password?: string };
const KEY = "komme.signupDraft";

export function saveSignupDraft(patch: SignupDraft): void {
  sessionStorage.setItem(KEY, JSON.stringify({ ...readSignupDraft(), ...patch }));
}

export function readSignupDraft(): SignupDraft {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function clearSignupDraft(): void {
  sessionStorage.removeItem(KEY);
}

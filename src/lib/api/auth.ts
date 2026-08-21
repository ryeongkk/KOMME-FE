import { z } from "zod";
import { getAccessToken } from "@/lib/auth-tokens";
import { apiFetch } from "./client";

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// All Notion "코메 API 명세서" > Auth domain endpoints. One function per endpoint, each
// paired with a handler of the same name in src/mocks/handlers.ts.

// ---- 이메일 로그인 (POST /api/v1/auth/login) ----
export const loginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  profileCompleted: z.boolean(),
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type LoginRequest = {
  email: string;
  password: string;
  // English-only UI for now (see AGENTS.md) — always request English copy from the backend.
  preferredLanguage: "ENGLISH";
};
export function login(request: LoginRequest): Promise<LoginResponse> {
  return apiFetch("/api/v1/auth/login", loginResponseSchema, {
    method: "POST",
    body: JSON.stringify(request),
  });
}

// ---- 토큰 재발급 (POST /api/v1/auth/tokens/reissue) ----
// ponytail: not wired to an automatic silent-refresh-and-retry yet — nothing in the app
// holds a long-lived session or hits a protected route repeatedly. Hook this into
// lib/api/client.ts's apiFetch when that becomes true.
export const reissueResponseSchema = z.object({ accessToken: z.string(), refreshToken: z.string() });
export function reissueTokens(refreshToken: string) {
  return apiFetch("/api/v1/auth/tokens/reissue", reissueResponseSchema, {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

// ---- 이메일 인증 코드 전송/확인 (회원가입, POST /api/v1/auth/email-verifications/{send,confirm}) ----
export function sendEmailVerification(email: string): Promise<void> {
  return apiFetch("/api/v1/auth/email-verifications/send", z.void(), {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
export function confirmEmailVerification(email: string, verificationCode: string): Promise<void> {
  return apiFetch("/api/v1/auth/email-verifications/confirm", z.void(), {
    method: "POST",
    body: JSON.stringify({ email, verificationCode }),
  });
}

// ---- 이메일 회원가입 (POST /api/v1/auth/signup) ----
export type SignupRequest = { email: string; password: string; nickname: string };
export function signup(request: SignupRequest): Promise<void> {
  return apiFetch("/api/v1/auth/signup", z.void(), {
    method: "POST",
    body: JSON.stringify(request),
  });
}

// ---- 비밀번호 재설정 인증 코드 전송/확인 (POST /api/v1/auth/password-resets/email-verifications/{send,confirm}) ----
export function sendPasswordResetVerification(email: string): Promise<void> {
  return apiFetch("/api/v1/auth/password-resets/email-verifications/send", z.void(), {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
export const resetTokenResponseSchema = z.object({ resetToken: z.string() });
export function confirmPasswordResetVerification(
  email: string,
  verificationCode: string,
): Promise<{ resetToken: string }> {
  return apiFetch("/api/v1/auth/password-resets/email-verifications/confirm", resetTokenResponseSchema, {
    method: "POST",
    body: JSON.stringify({ email, verificationCode }),
  });
}

// ---- 비밀번호 재설정 (PATCH /api/v1/auth/password-resets) ----
export function resetPassword(resetToken: string, newPassword: string): Promise<void> {
  return apiFetch("/api/v1/auth/password-resets", z.void(), {
    method: "PATCH",
    body: JSON.stringify({ resetToken, newPassword }),
  });
}

// ---- 비밀번호 변경 (PATCH /api/v1/auth/password, Bearer 필요) ----
// ponytail: no "change password while logged in" screen exists yet (my/account/edit is
// nickname-only) — wire this in once that screen exists.
export function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  return apiFetch("/api/v1/auth/password", z.void(), {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

// ---- 로그아웃 (POST /api/v1/auth/logout, Bearer 필요) ----
export function logout(refreshToken: string): Promise<void> {
  return apiFetch("/api/v1/auth/logout", z.void(), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ refreshToken }),
  });
}

// ---- 계정 탈퇴 (DELETE /api/v1/auth/withdraw, Bearer 필요) ----
export function withdraw(): Promise<void> {
  return apiFetch("/api/v1/auth/withdraw", z.void(), {
    method: "DELETE",
    headers: authHeaders(),
  });
}

import { z } from "zod";
import { apiFetch } from "./client";

// Notion "코메 API 명세서" > 이메일 로그인 (POST /api/v1/auth/login).
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

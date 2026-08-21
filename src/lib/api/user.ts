import { z } from "zod";
import { getAccessToken } from "@/lib/auth-tokens";
import { apiFetch } from "./client";

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// All Notion "코메 API 명세서" > User domain endpoints. One function per endpoint, each
// paired with a handler of the same name in src/mocks/handlers.ts.

// ---- 마이페이지 프로필 조회 (GET /api/v1/users/me, Bearer 필요) ----
export const profileResponseSchema = z.object({
  nickname: z.string(),
  provider: z.enum(["LOCAL", "GOOGLE", "APPLE"]),
  preferredLanguage: z.enum(["ENGLISH", "JAPANESE", "CHINESE_SIMPLIFIED"]),
  locationConsentAgreed: z.boolean(),
});
export type Profile = z.infer<typeof profileResponseSchema>;
export type PreferredLanguage = Profile["preferredLanguage"];
export function getMyProfile(): Promise<Profile> {
  return apiFetch("/api/v1/users/me", profileResponseSchema, { headers: authHeaders() });
}

// ---- 닉네임 사용 가능 여부 조회 (GET /api/v1/users/nicknames/availability?nickname=, 공개 API) ----
export const nicknameAvailabilitySchema = z.object({ available: z.boolean() });
export function checkNicknameAvailability(nickname: string): Promise<{ available: boolean }> {
  return apiFetch(
    `/api/v1/users/nicknames/availability?nickname=${encodeURIComponent(nickname)}`,
    nicknameAvailabilitySchema,
  );
}
// login/nickname-screen.tsx(회원가입)와 edit-profile-screen.tsx(닉네임 변경) 둘 다 "제출 전
// 사용 가능 여부 확인 → 아니면 중단" 흐름이 똑같아서 여기 한 곳에 모음.
export class NicknameTakenError extends Error {
  constructor() {
    super("Nickname is already taken");
  }
}
export async function assertNicknameAvailable(nickname: string): Promise<void> {
  const { available } = await checkNicknameAvailability(nickname);
  if (!available) throw new NicknameTakenError();
}

// ---- 마이페이지 닉네임 변경 (PATCH /api/v1/users/me/nickname, Bearer 필요) ----
export function updateNickname(nickname: string): Promise<void> {
  return apiFetch("/api/v1/users/me/nickname", z.void(), {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ nickname }),
  });
}

// ---- 마이페이지 선호 언어 변경 (PATCH /api/v1/users/me/language, Bearer 필요) ----
export function updatePreferredLanguage(preferredLanguage: PreferredLanguage): Promise<void> {
  return apiFetch("/api/v1/users/me/language", z.void(), {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ preferredLanguage }),
  });
}

// ---- 마이페이지 위치 정보 동의 변경 (PATCH /api/v1/users/me/location-consent, Bearer 필요) ----
// ponytail: 위치 정보 동의를 토글하는 화면이 아직 없음(Figma에도 없음) — 그 화면이 생기면 연결.
export function updateLocationConsent(agreed: boolean): Promise<void> {
  return apiFetch("/api/v1/users/me/location-consent", z.void(), {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ agreed }),
  });
}

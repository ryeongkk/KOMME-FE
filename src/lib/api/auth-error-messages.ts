import { ApiError } from "./client";

// Notion "코메 API 명세서" > Auth 도메인 각 페이지의 "주요 실패" 코드 → 화면 문구.
// 여러 화면(로그인/회원가입/비밀번호 재설정/탈퇴)이 같은 코드를 공유해서 한 곳에 모음.
const MESSAGES: Record<string, string> = {
  AUTH_401_1: "Incorrect email or password.",
  AUTH_400_1: "The verification code is incorrect.",
  AUTH_400_2: "The verification code has expired.",
  AUTH_400_3: "Current password is incorrect.",
  AUTH_401_6: "This link is no longer valid. Please request a new code.",
  AUTH_403_1: "Please verify your email first.",
  AUTH_409_1: "This email is already registered.",
  AUTH_409_2: "This nickname is already in use.",
  AUTH_409_4: "You can rejoin 7 days after account deletion.",
  AUTH_429_1: "Too many attempts. Please try again later.",
  AUTH_429_2: "Please wait a moment before requesting another code.",
};

export function authErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (error instanceof ApiError) return MESSAGES[error.code] ?? fallback;
  return fallback;
}

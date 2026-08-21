import { http, HttpResponse, type HttpHandler } from "msw";
import type { LoginRequest, SignupRequest } from "@/lib/api/auth";
import { loginResponseSchema, reissueResponseSchema, resetTokenResponseSchema } from "@/lib/api/auth";
import type { Profile } from "@/lib/api/user";
import { nicknameAvailabilitySchema, profileResponseSchema } from "@/lib/api/user";

// Demo account for the mocked Auth endpoints — punch these into the login form to see
// success, or use as the "already registered" case for signup.
const MOCK_ACCOUNT = { email: "demo@komme.app", password: "Password1!" };
// Every verification-code screen (signup + password reset) accepts this fixed code —
// same convention the old client-side CORRECT_CODE stub used before these handlers existed.
const MOCK_VERIFICATION_CODE = "123456";
const MOCK_RESET_TOKEN = "mock-reset-token";
const MOCK_ACCESS_TOKEN = "mock-access-token";
// User 도메인 mutable 상태 — 닉네임/선호 언어/위치 동의 변경이 다음 GET /users/me 응답에 반영되게.
let mockProfile: Profile = {
  nickname: "ryeongkk",
  provider: "LOCAL",
  preferredLanguage: "ENGLISH",
  locationConsentAgreed: false,
};

function ok(data?: unknown) {
  return HttpResponse.json({ isSuccess: true, code: "COM_200", message: "성공적으로 처리되었습니다.", data });
}
function fail(status: number, code: string, message: string) {
  return HttpResponse.json({ isSuccess: false, code, message, data: null }, { status });
}
function isAuthorized(request: Request): boolean {
  return request.headers.get("authorization") === `Bearer ${MOCK_ACCESS_TOKEN}`;
}

// Notion "코메 API 명세서" > Auth 도메인. 함수 이름은 src/lib/api/auth.ts와 1:1로 대응.
export const handlers: HttpHandler[] = [
  // 이메일 로그인
  http.post("/api/v1/auth/login", async ({ request }) => {
    const body = (await request.json()) as LoginRequest;
    if (body.email !== MOCK_ACCOUNT.email || body.password !== MOCK_ACCOUNT.password) {
      return fail(401, "AUTH_401_1", "이메일 또는 비밀번호가 일치하지 않습니다.");
    }
    // Parsed through the same schema the real client validates against, so the mock
    // can't silently drift from the contract login() expects.
    return ok(
      loginResponseSchema.parse({
        accessToken: MOCK_ACCESS_TOKEN,
        refreshToken: "mock-refresh-token",
        profileCompleted: true,
      }),
    );
  }),

  // 토큰 재발급
  http.post("/api/v1/auth/tokens/reissue", async ({ request }) => {
    const body = (await request.json()) as { refreshToken?: string };
    if (!body.refreshToken) return fail(400, "COM_400", "Refresh Token이 누락되었습니다.");
    return ok(reissueResponseSchema.parse({ accessToken: MOCK_ACCESS_TOKEN, refreshToken: "mock-refresh-token" }));
  }),

  // 이메일 인증 코드 전송 (회원가입)
  http.post("/api/v1/auth/email-verifications/send", async ({ request }) => {
    const body = (await request.json()) as { email?: string };
    if (body.email === MOCK_ACCOUNT.email) return fail(409, "AUTH_409_1", "이미 가입된 이메일입니다.");
    return ok();
  }),

  // 이메일 인증 코드 확인 (회원가입)
  http.post("/api/v1/auth/email-verifications/confirm", async ({ request }) => {
    const body = (await request.json()) as { verificationCode?: string };
    if (body.verificationCode !== MOCK_VERIFICATION_CODE) {
      return fail(400, "AUTH_400_1", "인증 코드가 일치하지 않습니다.");
    }
    return ok();
  }),

  // 이메일 회원가입
  http.post("/api/v1/auth/signup", async ({ request }) => {
    const body = (await request.json()) as SignupRequest;
    if (body.email === MOCK_ACCOUNT.email) return fail(409, "AUTH_409_1", "이미 가입된 이메일입니다.");
    if (body.nickname?.toLowerCase() === "admin") return fail(409, "AUTH_409_2", "이미 사용 중인 닉네임입니다.");
    return ok();
  }),

  // 비밀번호 재설정 인증 코드 전송
  http.post("/api/v1/auth/password-resets/email-verifications/send", () => ok()),

  // 비밀번호 재설정 인증 코드 확인
  http.post("/api/v1/auth/password-resets/email-verifications/confirm", async ({ request }) => {
    const body = (await request.json()) as { verificationCode?: string };
    if (body.verificationCode !== MOCK_VERIFICATION_CODE) {
      return fail(400, "AUTH_400_1", "인증 코드가 일치하지 않습니다.");
    }
    return ok(resetTokenResponseSchema.parse({ resetToken: MOCK_RESET_TOKEN }));
  }),

  // 비밀번호 재설정
  http.patch("/api/v1/auth/password-resets", async ({ request }) => {
    const body = (await request.json()) as { resetToken?: string };
    if (body.resetToken !== MOCK_RESET_TOKEN) {
      return fail(401, "AUTH_401_6", "유효하지 않은 비밀번호 재설정 토큰입니다.");
    }
    return ok();
  }),

  // 비밀번호 변경 (로그인 상태)
  http.patch("/api/v1/auth/password", async ({ request }) => {
    if (!isAuthorized(request)) return fail(401, "AUTH_401_2", "유효하지 않은 토큰입니다.");
    const body = (await request.json()) as { currentPassword?: string };
    if (body.currentPassword !== MOCK_ACCOUNT.password) {
      return fail(400, "AUTH_400_3", "현재 비밀번호가 일치하지 않습니다.");
    }
    return ok();
  }),

  // 로그아웃
  http.post("/api/v1/auth/logout", ({ request }) => {
    if (!isAuthorized(request)) return fail(401, "AUTH_401_2", "유효하지 않은 토큰입니다.");
    return ok();
  }),

  // 계정 탈퇴
  http.delete("/api/v1/auth/withdraw", ({ request }) => {
    if (!isAuthorized(request)) return fail(401, "AUTH_401_2", "유효하지 않은 토큰입니다.");
    return ok();
  }),

  // Notion "코메 API 명세서" > User 도메인.
  // 마이페이지 프로필 조회
  http.get("/api/v1/users/me", ({ request }) => {
    if (!isAuthorized(request)) return fail(401, "AUTH_401_2", "유효하지 않은 토큰입니다.");
    return ok(profileResponseSchema.parse(mockProfile));
  }),

  // 닉네임 사용 가능 여부 조회 (공개 API)
  http.get("/api/v1/users/nicknames/availability", ({ request }) => {
    const nickname = new URL(request.url).searchParams.get("nickname") ?? "";
    return ok(nicknameAvailabilitySchema.parse({ available: nickname.toLowerCase() !== "admin" }));
  }),

  // 마이페이지 닉네임 변경
  http.patch("/api/v1/users/me/nickname", async ({ request }) => {
    if (!isAuthorized(request)) return fail(401, "AUTH_401_2", "유효하지 않은 토큰입니다.");
    const body = (await request.json()) as { nickname?: string };
    if (body.nickname?.toLowerCase() === "admin") return fail(409, "USER_409_1", "이미 사용 중인 닉네임입니다.");
    if (body.nickname) mockProfile = { ...mockProfile, nickname: body.nickname };
    return ok();
  }),

  // 마이페이지 선호 언어 변경
  http.patch("/api/v1/users/me/language", async ({ request }) => {
    if (!isAuthorized(request)) return fail(401, "AUTH_401_2", "유효하지 않은 토큰입니다.");
    const body = (await request.json()) as { preferredLanguage?: Profile["preferredLanguage"] };
    if (!body.preferredLanguage) return fail(400, "COM_400", "선호 언어가 누락되었습니다.");
    mockProfile = { ...mockProfile, preferredLanguage: body.preferredLanguage };
    return ok();
  }),

  // 마이페이지 위치 정보 동의 변경
  http.patch("/api/v1/users/me/location-consent", async ({ request }) => {
    if (!isAuthorized(request)) return fail(401, "AUTH_401_2", "유효하지 않은 토큰입니다.");
    const body = (await request.json()) as { agreed?: boolean };
    if (typeof body.agreed !== "boolean") return fail(400, "COM_400", "동의 여부가 누락되었습니다.");
    mockProfile = { ...mockProfile, locationConsentAgreed: body.agreed };
    return ok();
  }),
];

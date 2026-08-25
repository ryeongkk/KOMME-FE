import { http, HttpResponse, type HttpHandler } from "msw";
import { z } from "zod";
import type { LoginRequest, SignupRequest } from "@/lib/api/auth";
import { loginResponseSchema, reissueResponseSchema, resetTokenResponseSchema } from "@/lib/api/auth";
import type { CourseDetail, CourseSpot, CourseStatus, CreateCourseRequest, SpotCount } from "@/lib/api/course";
import { courseDetailSchema, courseSummarySchema } from "@/lib/api/course";
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

// Course 도메인 mutable 상태 — title이 null이면 "생성만 되고 저장은 안 된" 코스(목록엔 안 뜸,
// 코스 생성 직후 완료 화면 상태와 동일). status는 실제 API처럼 컬럼이 아니라 visitDate와 오늘
// 날짜를 비교해 조회 시점에 계산.
type StoredCourse = CourseDetail;
const SPOT_COUNT_TO_N: Record<SpotCount, number> = { TWO: 2, THREE: 3, FOUR_OR_MORE: 4 };
const MOCK_SPOT_NAMES = [
  "Hongdae Spa Day",
  "Seongsu Brunch Café",
  "Namsan Tower View",
  "Gwangalli Beach Walk",
  "Jamsil Night Market",
];
function generateMockSpots(count: number): CourseSpot[] {
  return Array.from({ length: count }, (_, i) => ({
    spotId: i + 1,
    name: MOCK_SPOT_NAMES[i % MOCK_SPOT_NAMES.length],
    sequence: i + 1,
    timeSlot: ["MORNING", "AFTERNOON", "EVENING"][i % 3],
    latitude: 37.55 + i * 0.01,
    longitude: 126.99 + i * 0.01,
    thumbnailUrl: "",
    distanceToNextMeters: i < count - 1 ? 500 + i * 300 : null,
  }));
}
function isoDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
let nextCourseId = 1;
const mockCourses: StoredCourse[] = [
  {
    courseId: nextCourseId++,
    title: "Hongdae Spa Day",
    regionName: "Hongdae, Seoul",
    topics: ["HEALING"],
    visitDate: isoDateOffset(2),
    spots: generateMockSpots(3),
  },
  {
    courseId: nextCourseId++,
    title: "Seongsu Food Trip",
    regionName: "Seongsu-dong, Seoul",
    topics: ["FOOD"],
    visitDate: isoDateOffset(5),
    spots: generateMockSpots(3),
  },
  {
    courseId: nextCourseId++,
    title: "Busan Beach Day",
    regionName: "Haeundae, Busan",
    topics: ["EXPLORATION"],
    visitDate: isoDateOffset(-10),
    spots: generateMockSpots(4),
  },
  {
    courseId: nextCourseId++,
    title: "Jamsil Night Out",
    regionName: "Jamsil, Seoul",
    topics: ["FOOD", "HEALING"],
    visitDate: isoDateOffset(-30),
    spots: generateMockSpots(2),
  },
];
function courseStatus(visitDate: string): CourseStatus {
  return visitDate >= isoDateOffset(0) ? "UPCOMING" : "HISTORY";
}

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

  // Google 로그인 — code가 "new"를 포함하면 프로필 미완성(닉네임 없음)인 신규 가입 취급,
  // 그 외엔 기존 MOCK_ACCOUNT로 로그인한 것처럼 처리. 실제 code→토큰 교환은 백엔드 담당이라
  // 목업에선 값 자체를 신경 쓰지 않음.
  http.post("/api/v1/auth/oauth/google", async ({ request }) => {
    const body = (await request.json()) as { code?: string };
    if (!body.code) return fail(400, "COM_400", "code가 누락되었습니다.");
    return ok(
      loginResponseSchema.parse({
        accessToken: MOCK_ACCESS_TOKEN,
        refreshToken: "mock-refresh-token",
        profileCompleted: !body.code.includes("new"),
      }),
    );
  }),

  // 소셜 로그인 사용자 프로필 완성
  http.patch("/api/v1/auth/oauth/profile", async ({ request }) => {
    if (!isAuthorized(request)) return fail(401, "AUTH_401_2", "유효하지 않은 토큰입니다.");
    const body = (await request.json()) as { nickname?: string };
    if (body.nickname?.toLowerCase() === "admin") return fail(409, "AUTH_409_2", "이미 사용 중인 닉네임입니다.");
    if (body.nickname) mockProfile = { ...mockProfile, nickname: body.nickname };
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

  // Notion "코메 API 명세서" > Course 도메인.
  // 코스 생성 — 실제 스팟 검색 대신 spotCount만큼 목업 스팟을 생성.
  // ponytail: COURSE_400_1(서울/부산 외 지역)은 여기서 트리거하지 않음 — course-create-screen.tsx의
  // regionKeyword는 항상 create-data.ts의 POPULAR_SPOTS/searchPlaces/reverse-geocode 결과 중
  // 하나로만 채워지고 그중 상당수(팝업 스팟 칩)가 "Seongsu-dong"처럼 도시명 없는 구/동 이름이라
  // 문자열 매칭으로 서울/부산 여부를 판정할 수 없음(예전엔 "seoul"/"busan" 포함 여부로 체크했다가
  // 팝업 스팟 선택 시 항상 실패하는 버그였음). UI가 애초에 서울/부산 값만 만들어내므로 자유 입력
  // 경로 자체가 없어 이 실패 케이스를 목업으로 재현할 방법이 없음.
  http.post("/api/v1/courses", async ({ request }) => {
    if (!isAuthorized(request)) return fail(401, "AUTH_401_2", "유효하지 않은 토큰입니다.");
    const body = (await request.json()) as CreateCourseRequest;
    const course: StoredCourse = {
      courseId: nextCourseId++,
      regionName: body.regionKeyword,
      topics: body.topics,
      visitDate: body.visitDate,
      spots: generateMockSpots(SPOT_COUNT_TO_N[body.spotCount] ?? 3),
      title: null,
    };
    mockCourses.push(course);
    return ok(courseDetailSchema.parse(course));
  }),

  // 코스 저장 — title만 갱신, 저장해야 목록 조회에 노출됨
  http.patch("/api/v1/courses/:courseId/save", async ({ request, params }) => {
    if (!isAuthorized(request)) return fail(401, "AUTH_401_2", "유효하지 않은 토큰입니다.");
    const course = mockCourses.find((c) => c.courseId === Number(params.courseId));
    if (!course) return fail(404, "COURSE_404_2", "코스가 없거나 본인 코스가 아닙니다.");
    const body = (await request.json()) as { title?: string };
    if (!body.title || body.title.length > 30) return fail(400, "COM_400", "코스명을 확인해주세요.");
    course.title = body.title;
    return ok();
  }),

  // 코스 목록 조회 — title이 있는(저장된) 코스만, status는 visitDate로 조회 시점에 계산
  http.get("/api/v1/courses", ({ request }) => {
    if (!isAuthorized(request)) return fail(401, "AUTH_401_2", "유효하지 않은 토큰입니다.");
    const status = new URL(request.url).searchParams.get("status") as CourseStatus | null;
    const summaries = mockCourses
      .filter((c) => c.title !== null && courseStatus(c.visitDate) === status)
      .map((c) => ({
        courseId: c.courseId,
        title: c.title as string,
        regionName: c.regionName,
        visitDate: c.visitDate,
        topics: c.topics,
        spotCount: c.spots.length,
      }))
      .sort((a, b) => (status === "HISTORY" ? b.visitDate.localeCompare(a.visitDate) : a.visitDate.localeCompare(b.visitDate)));
    return ok(z.array(courseSummarySchema).parse(summaries));
  }),

  // 코스 상세 조회
  http.get("/api/v1/courses/:courseId", ({ request, params }) => {
    if (!isAuthorized(request)) return fail(401, "AUTH_401_2", "유효하지 않은 토큰입니다.");
    const course = mockCourses.find((c) => c.courseId === Number(params.courseId));
    if (!course) return fail(404, "COURSE_404_2", "코스가 없거나 본인 코스가 아닙니다.");
    return ok(courseDetailSchema.parse(course));
  }),

  // 코스 삭제
  http.delete("/api/v1/courses/:courseId", ({ request, params }) => {
    if (!isAuthorized(request)) return fail(401, "AUTH_401_2", "유효하지 않은 토큰입니다.");
    const idx = mockCourses.findIndex((c) => c.courseId === Number(params.courseId));
    if (idx === -1) return fail(404, "COURSE_404_2", "코스가 없거나 본인 코스가 아닙니다.");
    mockCourses.splice(idx, 1);
    return ok();
  }),
];

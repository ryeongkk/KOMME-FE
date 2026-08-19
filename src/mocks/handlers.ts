import { http, HttpResponse, type HttpHandler } from "msw";
import type { LoginRequest } from "@/lib/api/auth";
import { loginResponseSchema } from "@/lib/api/auth";

// Demo credentials for the mocked login — punch these into the login form to see success.
const MOCK_ACCOUNT = { email: "demo@komme.app", password: "Password1!" };

// Notion "코메 API 명세서" > 이메일 로그인 (POST /api/v1/auth/login) shapes the request/response below.
export const handlers: HttpHandler[] = [
  http.post("/api/v1/auth/login", async ({ request }) => {
    const body = (await request.json()) as LoginRequest;

    if (body.email !== MOCK_ACCOUNT.email || body.password !== MOCK_ACCOUNT.password) {
      return HttpResponse.json(
        {
          isSuccess: false,
          code: "AUTH_401_1",
          message: "이메일 또는 비밀번호가 일치하지 않습니다.",
          data: null,
        },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      isSuccess: true,
      code: "COM_200",
      message: "성공적으로 처리되었습니다.",
      // Parsed through the same schema the real client validates against, so the mock
      // can't silently drift from the contract `login()` expects.
      data: loginResponseSchema.parse({
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
        profileCompleted: true,
      }),
    });
  }),
];

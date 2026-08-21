import { z } from "zod";
import { getAccessToken } from "@/lib/auth-tokens";
import { apiFetch } from "./client";

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// All Notion "코메 API 명세서" > Course domain endpoints. One function per endpoint, each
// paired with a handler of the same name in src/mocks/handlers.ts.

export const courseTopicSchema = z.enum(["FOOD", "HEALING", "EXPLORATION"]);
export type CourseTopic = z.infer<typeof courseTopicSchema>;

export const spotCountSchema = z.enum(["TWO", "THREE", "FOUR_OR_MORE"]);
export type SpotCount = z.infer<typeof spotCountSchema>;

export type CourseStatus = "UPCOMING" | "HISTORY";

const courseSpotSchema = z.object({
  spotId: z.number(),
  name: z.string(),
  sequence: z.number(),
  timeSlot: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  thumbnailUrl: z.string(),
  distanceToNextMeters: z.number().nullable(),
});
export type CourseSpot = z.infer<typeof courseSpotSchema>;

// ---- 코스 생성 (POST /api/v1/courses, Bearer 필요) ----
// ponytail: title도 Notion 명세엔 없는 필드(목록 조회만 title을 줌) — course-detail-screen.tsx
// 헤더에 실제 코스명을 보여줘야 해서 spotCount와 같은 이유로 임의 추가(Notion 문서는 그대로 둠).
// 저장 전(생성 직후) 코스는 이름이 없으므로 null 허용.
export const courseDetailSchema = z.object({
  courseId: z.number(),
  title: z.string().nullable(),
  regionName: z.string(),
  topics: z.array(courseTopicSchema),
  visitDate: z.string(),
  spots: z.array(courseSpotSchema),
});
export type CourseDetail = z.infer<typeof courseDetailSchema>;

export type CreateCourseRequest = {
  regionKeyword: string;
  topics: CourseTopic[];
  spotCount: SpotCount;
  visitDate: string;
};
export function createCourse(request: CreateCourseRequest): Promise<CourseDetail> {
  return apiFetch("/api/v1/courses", courseDetailSchema, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(request),
  });
}

// ---- 코스 저장 (PATCH /api/v1/courses/{courseId}/save, Bearer 필요) ----
export function saveCourse(courseId: number, title: string): Promise<void> {
  return apiFetch(`/api/v1/courses/${courseId}/save`, z.void(), {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ title }),
  });
}

// ---- 코스 목록 조회 (GET /api/v1/courses?status=, Bearer 필요) ----
// ponytail: Notion 명세엔 없는 spotCount 필드를 화면 요구사항(카드에 "N spots" 표시)에 맞춰
// 임의로 추가함(사용자 지시, Notion 문서는 그대로 둠) — 실제 백엔드가 이 필드를 안 주면 여기
// 스키마와 mocks/handlers.ts를 다시 맞춰야 함.
export const courseSummarySchema = z.object({
  courseId: z.number(),
  title: z.string(),
  regionName: z.string(),
  visitDate: z.string(),
  topics: z.array(courseTopicSchema),
  spotCount: z.number(),
});
export type CourseSummary = z.infer<typeof courseSummarySchema>;
export function getCourses(status: CourseStatus): Promise<CourseSummary[]> {
  return apiFetch(`/api/v1/courses?status=${status}`, z.array(courseSummarySchema), { headers: authHeaders() });
}

// ---- 코스 상세 조회 (GET /api/v1/courses/{courseId}, Bearer 필요) ----
export function getCourseDetail(courseId: number): Promise<CourseDetail> {
  return apiFetch(`/api/v1/courses/${courseId}`, courseDetailSchema, { headers: authHeaders() });
}

// ---- 코스 삭제 (DELETE /api/v1/courses/{courseId}, Bearer 필요) ----
export function deleteCourse(courseId: number): Promise<void> {
  return apiFetch(`/api/v1/courses/${courseId}`, z.void(), {
    method: "DELETE",
    headers: authHeaders(),
  });
}

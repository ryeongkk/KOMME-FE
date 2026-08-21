import { ApiError } from "./client";

// Notion "코메 API 명세서" > Course 도메인 각 페이지의 "주요 실패" 코드 → 화면 문구.
// COURSE_404_2는 삭제/상세조회/저장 3개 엔드포인트가 공유해서 한 곳에 모음.
const MESSAGES: Record<string, string> = {
  COURSE_400_1: "Course creation is only available for Seoul and Busan right now.",
  COURSE_404_1: "Not enough spots to build a course here yet.",
  COURSE_404_2: "This course no longer exists.",
  COURSE_404_3: "Couldn't find that region. Please search again.",
};

export function courseErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (error instanceof ApiError) return MESSAGES[error.code] ?? fallback;
  return fallback;
}

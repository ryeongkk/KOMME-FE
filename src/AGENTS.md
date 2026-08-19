<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-01 | Updated: 2026-08-01 -->

# src

## 목적

애플리케이션 소스 루트입니다. 이 아래 모든 것은 TypeScript/TSX이고, `@/*` 경로 별칭(`tsconfig.json` 참고)으로 import할 수 있습니다.

## 하위 디렉토리

| 디렉토리 | 설명 |
|-----------|---------|
| `app/` | Next.js App Router — 라우트, 레이아웃, 전역 스타일, PWA 메타데이터, 디자인 토큰 (`app/AGENTS.md` 참고) |
| `components/` | 라우트 트리 바깥에서 여러 라우트가 공유하는 React 컴포넌트 (`components/AGENTS.md` 참고) |
| `lib/` | 화면에 속하지 않는 순수 유틸/클라이언트 헬퍼. `lib/api/`에 백엔드 호출 함수(엔드포인트별로 1파일, 예: `auth.ts`)와 `client.ts`(공통 응답 봉투 처리 + zod 파싱을 하는 `apiFetch`). `auth-tokens.ts`는 로그인 토큰 localStorage 저장/조회 |
| `mocks/` | MSW(Mock Service Worker) 핸들러 — 백엔드 Swagger 미배포 구간을 메우는 용도. `handlers.ts`에 엔드포인트별 핸들러(`lib/api/*`가 export하는 zod 스키마로 응답을 파싱해 계약이 어긋나면 여기서 바로 터짐), `browser.ts`가 `setupWorker`로 묶음. `app/enable-mocking.tsx`가 개발 모드에서만 기동(`onUnhandledRequest: "bypass"`라 핸들러 없는 엔드포인트는 조용히 실네트워크로 통과). 실제 백엔드 배포되면 해당 화면 핸들러부터 제거 |
| `types/` | 로컬 소스가 없는 서드파티 타입 선언 (예: `navermaps.d.ts`) |

## AI 에이전트를 위한 안내

### 이 디렉토리에서 작업할 때
- 디렉토리 경계를 넘어 상대 경로로 import하지 말고 `@/...`로 import하세요.

<!-- MANUAL: -->

<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-01 | Updated: 2026-08-01 -->

# app

## 목적

Next.js App Router 루트입니다: 라우트, 루트 레이아웃, 전역 스타일/디자인 토큰, PWA 메타데이터(매니페스트, 아이콘, 서비스워커 등록)가 모두 여기 있습니다.

## 주요 파일

| 파일              | 설명                                                                                                                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layout.tsx`      | 루트 레이아웃. `next/font/google`로 Raleway를 불러오고, PWA `metadata`/`viewport`를 설정하며, `RegisterServiceWorker`를 마운트함                                                                                                   |
| `page.tsx`        | 홈 라우트(`/`) — **"KOMME" 한 줄짜리 플레이스홀더**. 스타터 내용은 걷어냈고 실제 제품 UI는 아직 없음                                                                                                                               |
| `globals.css`     | Tailwind v4 테마: 색상 토큰(gray 50~900, `primary`, `secondary` 100~400, `negative`)과 11개 타이포그래피 토큰(`text-title-b-20`, `text-body-sb-16` 등). Figma 파일 `mGriQB29mZ6VpIDQDpo5F6`(Color System 노드 `142:2027`)에서 추출 |
| `manifest.ts`     | PWA 매니페스트 — 이름, 아이콘, 테마 색상. `<html lang>`은 `en`인데 카피는 여전히 한국어임                                                                                                                                          |
| `register-sw.tsx` | 클라이언트 컴포넌트. `public/sw.js`를 프로덕션 빌드에서만 등록함                                                                                                                                                                   |
| `apple-icon.tsx`  | `next/og`의 `ImageResponse`로 생성하는 180×180 apple-touch-icon                                                                                                                                                                    |
| `favicon.ico`     | 정적 파비콘                                                                                                                                                                                                                        |

## 하위 디렉토리

| 디렉토리        | 설명                                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| `icon-192.png/` | 동적 PNG 아이콘 라우트 — `next/og`를 쓰는 `route.tsx`의 `GET` 핸들러 (`icon-192.png/AGENTS.md` 참고) |
| `icon-512.png/` | 512×512 버전, 패턴은 동일 (`icon-512.png/AGENTS.md` 참고)                                            |
| `login/`        | 로그인 플로우 라우트 — `/login`, `/login/terms`, `/login/nickname`. 화면 컴포넌트는 `src/components/login/`에 있고 각 `page.tsx`는 그걸 렌더링만 함 (`components/AGENTS.md` 참고) |

## AI 에이전트를 위한 안내

### 이 디렉토리에서 작업할 때

- Figma 와이어프레임(파일 `mGriQB29mZ6VpIDQDpo5F6`, 페이지 `wireframe`, 노드 `0:1`)을 기준으로 실제 화면을 구현할 때 가장 먼저 교체해야 할 파일이 `page.tsx`입니다.
- `globals.css`에 디자인 토큰을 추가할 때는 색을 눈대중으로 고르지 말고 Figma MCP(`get_design_context`/`get_variable_defs`)로 같은 Figma 파일에서 정확한 값을 뽑으세요 — 나중에 값을 다시 검증할 수 있도록 노드 ID 코멘트를 남겨두세요.

- 아이콘은 여기가 아니라 `src/components/icons.tsx`에 인라인 SVG로 둡니다. `import { HomeIcon } from "@/components/icons"` 로 가져다 쓰세요.

### 테스트 요구사항

- `pnpm build`가 통과해야 합니다 (`next/font`와 `next/og` 아이콘 라우트가 컴파일되는지도 함께 확인됨).

### 공통 패턴

- PWA 아이콘 라우트는 Next의 파일 컨벤션을 따릅니다: 출력 파일명 그대로인 디렉토리(`icon-192.png/`) 안에 `route.tsx`가 있는 방식.
- `RegisterServiceWorker`는 `NODE_ENV === "production"`이 아니면 아무 것도 안 합니다 — `pnpm dev`에서는 `sw.js`가 등록되지 않는 게 정상입니다.

## 의존성

### 내부

- `public/sw.js` — `register-sw.tsx`가 등록함
- `src/components/icons.tsx` — 라우트 안에서 쓰는 아이콘 컴포넌트 25개

<!-- MANUAL: -->

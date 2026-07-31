<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- Generated: 2026-08-01 | Updated: 2026-08-01 -->

# KOMME-FE

## 목적

Next.js 16(App Router) 기반 PWA. 방한 외국인이 "한국인처럼 살아보기" 일상 체험을 큐레이션 받는 서비스 KOMME의 프론트엔드입니다. 현재는 제품 화면 이전 단계입니다. 앱 셸/PWA 스캐폴딩, Figma에서 추출한 디자인 토큰 시스템, 아이콘 세트(`src/components/icons.tsx`)는 갖춰져 있지만 `src/app/page.tsx`는 아직 플레이스홀더입니다.

## 주요 파일

| 파일 | 설명 |
|------|------|
| `package.json` | 스크립트(`dev`/`build`/`start`/`lint`)와 의존성: Next 16.2.12, React 19.2.4, Tailwind v4 |
| `tsconfig.json` | Strict TS, 경로 별칭 `@/*` → `src/*` |
| `next.config.ts` | 아직 커스텀 설정 없는 빈 `NextConfig` |
| `eslint.config.mjs` | `eslint-config-next`(core-web-vitals + typescript)를 확장한 flat config |
| `postcss.config.mjs` | `@tailwindcss/postcss`만 등록 — Tailwind v4는 CSS-first라 `tailwind.config.js` 없음 |
| `README.md` | 손대지 않은 `create-next-app` 기본 readme |

## 하위 디렉토리

| 디렉토리 | 설명 |
|-----------|---------|
| `src/` | 애플리케이션 소스 (`src/AGENTS.md` 참고) |
| `public/` | 정적 자산 + 서비스워커 (`public/AGENTS.md` 참고) |
| `docs/` | 기술 외 참고 문서 (`docs/AGENTS.md` 참고) |

## AI 에이전트를 위한 안내

### 이 디렉토리에서 작업할 때
- Next.js API를 건드리기 전에 이 파일 맨 위의 breaking-changes 안내를 먼저 읽으세요 — 이 프로젝트는 학습 데이터와 다를 수 있는 Next.js 버전을 쓰고 있고, 관련 문서가 `node_modules/next/dist/docs/`에 함께 들어있습니다.
- 디자인 토큰(색상, 타이포그래피)은 `src/app/globals.css`에 있고, Figma 파일 `mGriQB29mZ6VpIDQDpo5F6`의 특정 노드 ID를 근거로 뽑은 값입니다. 토큰을 추가할 때는 임의로 색을 고르지 말고 같은 Figma 파일에서 추출하세요 — `src/app/AGENTS.md` 참고.
- 현재는 영어 버전만 서비스합니다. 다른 언어용 폰트(한글용 Pretendard, 일본어/중국어용 Noto Sans JP/SC 등)는 해당 언어 UI가 실제로 만들어질 때까지 일부러 미뤄둔 상태입니다 — 미리 추가하지 마세요.
- 아직 i18n 라우팅은 없는데 `manifest.ts` 메타데이터에는 여전히 한국어 카피가 남아있습니다 — 이건 알려진 공백이지, 물어보지 않았는데 임의로 번역해서 "고칠" 대상이 아닙니다.

### 테스트 요구사항
- 아직 테스트 스위트는 없습니다. 변경 작업의 완료 기준은 `pnpm build`와 `pnpm lint` 통과입니다.

### 공통 패턴
- Tailwind v4 테마 토큰은 JS 설정 파일이 아니라 `globals.css`의 `@theme inline { --color-*; --font-*; --text-* }` 블록으로 정의합니다.
- 폰트는 `src/app/layout.tsx`에서 `next/font/google`로 불러오고, CSS 변수로 노출되어 테마 블록에서 참조됩니다.

## 의존성

### 외부
- **Next.js 16.2.12** — App Router, `next/font`, 생성형 아이콘용 `next/og`(`ImageResponse`)
- **React 19.2.4** / **React DOM 19.2.4**
- **Tailwind CSS v4** — CSS-first 설정, `tailwind.config.js` 없음

<!-- MANUAL: -->

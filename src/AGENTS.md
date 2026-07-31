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

## AI 에이전트를 위한 안내

### 이 디렉토리에서 작업할 때
- 디렉토리 경계를 넘어 상대 경로로 import하지 말고 `@/...`로 import하세요.

<!-- MANUAL: -->

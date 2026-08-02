<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-01 | Updated: 2026-08-01 -->

# components

## 목적

App Router 라우트 트리 바깥에서 여러 라우트가 공유하는 React 컴포넌트입니다.

## 하위 디렉토리

| 디렉토리 | 설명 |
|-----------|---------|
| `ui/` | 특정 기능에 속하지 않는 범용 재사용 프리미티브 (예: `bottom-sheet.tsx`, `text-field.tsx`) |
| `login/` | 로그인 플로우 화면 전용 컴포넌트 (`login-screen.tsx` = `/login`, `terms-screen.tsx` = `/login/terms`, `nickname-screen.tsx` = `/login/nickname`) |

## 주요 파일

| 파일 | 설명 |
|------|------|
| `icons.tsx` | Figma에서 1:1로 뽑은 인라인 SVG 아이콘 컴포넌트 25개. 파일 `mGriQB29mZ6VpIDQDpo5F6`, 노드 `157:2536`(`icon` 섹션) |

## AI 에이전트를 위한 안내

### 이 디렉토리에서 작업할 때
- 새 화면(라우트)이 생기면 그 화면 전용 컴포넌트는 `login/`처럼 화면 이름을 딴 하위 폴더에 넣으세요. 여러 화면에서 재사용되는 범용 UI 프리미티브(바텀시트, 모달, 버튼 등)만 `ui/`에 넣습니다. 어느 한 화면에서만 쓰는 컴포넌트를 `ui/`에 넣지 마세요 — 두 번째 사용처가 생길 때 옮기세요.
- `nickname-screen.tsx`의 닉네임 중복 확인은 아직 백엔드 API가 없어 예약어 배열(`RESERVED_NICKNAMES`)로 흉내만 낸 상태입니다 — 실제 중복 확인 엔드포인트가 생기면 그걸로 교체하세요.
- `ui/text-field.tsx`는 `email-screen.tsx`/`nickname-screen.tsx`가 공유하는 인풋 껍데기(label + 인풋 + clear 버튼 + 캡션)입니다. 값 상태, 검증 로직(정규식, blur 타이밍), 중복 확인처럼 화면마다 다른 것은 각 화면 컴포넌트에 남깁니다. 캡션 한 줄은 `error`(문자열)가 있으면 빨간 테두리+빨간 캡션으로, 없고 `helperText`만 있으면 회색 상시 힌트로 보여줍니다 — 이메일 화면처럼 상시 힌트가 필요 없으면 `helperText`를 안 주면 됩니다.
- `icons.tsx`는 화면에 속하지 않는 전역 공유 자산이라 하위 폴더로 옮기지 않고 루트에 유지합니다.

### 아이콘 다루기
- 아이콘 라이브러리 의존성(`@iconify/react`, `lucide-react` 등)은 의도적으로 없습니다. 전부 Material Symbols 표준 글리프지만, Next 16 + Turbopack에서 `unplugin-icons` 설정 리스크를 감수하느니 25개를 인라인하는 쪽이 쌉니다. 아이콘이 100개를 넘거나 디자이너가 계속 새로 추가해서 Figma 왕복이 병목이 되면 그때 다시 판단하세요.
- 모든 아이콘은 `fill`/`stroke`가 `currentColor`입니다. 색은 호출부에서 `className`의 `text-*`로 줍니다. 크기도 안 박혀 있으니 `className="size-6"` 식으로 주세요.
- `home`/`map`/`mypage`는 selected 변형이 따로 없습니다 — Figma의 `-selected` 변형이 path가 완전히 동일하고 fill만 달랐습니다. 색으로 구분하세요: `<HomeIcon className={active ? "text-gray-900" : "text-gray-400"} />`
- 반면 `SaveSmIcon`(16px)과 `SaveLgIcon`(24px)은 path가 실제로 다른 별개 도형이라 둘 다 있습니다. `ClockIcon`도 16px 원본입니다. viewBox 확인하고 쓰세요.
- 새 아이콘 추가: Figma MCP `download_assets`로 해당 노드의 SVG를 받으세요. export에는 캔버스 배경(`#F5F5F5` rect)과 아트보드 프레임 path(좌표가 `-277` 같은 음수)가 딸려오니 `<g id="icon/NAME">` 안쪽만 남기고, 레이어 `id`를 지우고, 하드코딩된 색을 `currentColor`로 바꾸고, `fill-rule` 같은 속성을 JSX용 camelCase로 고치세요. 원본 아이콘 이름을 코멘트로 남기세요.
- 기억에 의존해서 글리프를 손으로 그리거나 비슷하게 만들지 말고, 실제로 export된 path 데이터를 쓰세요.

<!-- MANUAL: -->

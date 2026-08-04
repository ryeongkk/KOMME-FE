<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-01 | Updated: 2026-08-05 -->

# components

## 목적

App Router 라우트 트리 바깥에서 여러 라우트가 공유하는 React 컴포넌트입니다.

## 하위 디렉토리

| 디렉토리 | 설명 |
|-----------|---------|
| `ui/` | 특정 기능에 속하지 않는 범용 재사용 프리미티브 (예: `bottom-sheet.tsx`, `text-field.tsx`) |
| `login/` | 로그인 플로우 화면 전용 컴포넌트 (`login-screen.tsx` = `/login`, `terms-screen.tsx` = `/login/terms`, `email-screen.tsx` = `/login/email`, `code-screen.tsx` = `/login/code`, `password-screen.tsx` = `/login/password`, `nickname-screen.tsx` = `/login/nickname`) |
| `my/` | 마이페이지 플로우 화면 전용 컴포넌트 (`my-screen.tsx` = `/my`, `my-account-screen.tsx` = `/my/account`, `language-setting-screen.tsx` = `/my/language`) |

## 주요 파일

| 파일 | 설명 |
|------|------|
| `icons.tsx` | Figma에서 1:1로 뽑은 인라인 SVG 아이콘 컴포넌트 25개. 파일 `mGriQB29mZ6VpIDQDpo5F6`, 노드 `157:2536`(`icon` 섹션) |

## AI 에이전트를 위한 안내

### 이 디렉토리에서 작업할 때
- 새 화면(라우트)이 생기면 그 화면 전용 컴포넌트는 `login/`처럼 화면 이름을 딴 하위 폴더에 넣으세요. 여러 화면에서 재사용되는 범용 UI 프리미티브(바텀시트, 모달, 버튼 등)만 `ui/`에 넣습니다. 어느 한 화면에서만 쓰는 컴포넌트를 `ui/`에 넣지 마세요 — 두 번째 사용처가 생길 때 옮기세요.
- `nickname-screen.tsx`의 닉네임 중복 확인은 아직 백엔드 API가 없어 예약어 배열(`RESERVED_NICKNAMES`)로 흉내만 낸 상태입니다 — 실제 중복 확인 엔드포인트가 생기면 그걸로 교체하세요.
- `ui/text-field.tsx`는 `email-screen.tsx`/`nickname-screen.tsx`/`password-screen.tsx`가 공유하는 인풋 껍데기(label + 인풋 + clear 버튼 또는 비밀번호 표시/숨김 토글 + 캡션)입니다. 값 상태, 검증 로직(정규식, blur 타이밍), 중복 확인처럼 화면마다 다른 것은 각 화면 컴포넌트에 남깁니다. 캡션 한 줄은 `error`(문자열)가 있으면 빨간 테두리+빨간 캡션으로, 없고 `helperText`만 있으면 회색 상시 힌트로 보여줍니다 — 이메일 화면처럼 상시 힌트가 필요 없으면 `helperText`를 안 주면 됩니다. `type="password"`면 clear 버튼 대신 `EyeIcon`/`EyeOffIcon` 표시/숨김 토글을 보여줍니다. `labelVariant="field"`(기본값 `"heading"`)를 주면 라벨이 화면 헤딩(`text-heading-b-18`) 대신 필드 자체 라벨(`text-body-sb-14 text-gray-500`)로 렌더링됩니다 — password-screen처럼 화면 헤딩과 필드 라벨이 따로 있는 경우에 씁니다.
- `code-screen.tsx`의 인증코드 확인은 아직 백엔드 API가 없어 상수(`CORRECT_CODE`)로 흉내만 낸 상태입니다 — 실제 코드 검증/재전송 엔드포인트가 생기면 그걸로 교체하세요. 이전 단계에서 입력한 이메일은 `email-screen.tsx`가 `nextPath`(prop)에 `?email=...`을 붙여 넘기고, `code-screen.tsx`는 `useSearchParams`로 읽습니다 — 화면 간 공유 상태 스토어 없이 라우팅으로만 넘기는 임시 방식입니다. `useSearchParams`를 쓰는 클라이언트 컴포넌트라 `src/app/login/code/page.tsx`/`src/app/login/reset/code/page.tsx`에서 `<Suspense>`로 감싸야 정적 빌드가 됩니다.
- `password-screen.tsx`는 완료 시 `/login`(로그인 메인 화면)으로 이동합니다 — 원래 회원가입 순서(약관 동의 → 이메일 → 코드 → 비밀번호 → 닉네임 → 완료)상 다음은 `/login/nickname`이지만, 현재는 그렇게 연결돼 있지 않습니다. 실제 순서대로 이어붙일 때 `handleNext`를 바꾸세요.
- `email-screen.tsx`/`code-screen.tsx`/`password-screen.tsx`는 회원가입(`/login/email`, `/login/code`, `/login/password`)과 비밀번호 재설정(`/login/reset/email`, `/login/reset/code`, `/login/reset/password`)이 **화면 컴포넌트는 공유하되 라우트는 분리**되어 있습니다. 각 화면은 문구를 URL이나 내부 분기로 알아내지 않고 전부 **props로만** 받습니다 (`headerTitle`, `heading`, `nextPath` 등) — 그래서 화면 컴포넌트 자체는 지금이 가입 플로우인지 재설정 플로우인지 전혀 모릅니다. 어떤 문구를 쓸지/다음에 어디로 갈지는 오직 각 라우트의 `page.tsx`(예: `src/app/login/reset/email/page.tsx`)가 prop으로 정합니다. 나중에 실제 API를 붙일 때도 이 지점(각 `page.tsx`, 또는 거기서 넘기는 `onSubmit` 콜백 prop)에서 가입용/재설정용 엔드포인트를 나눠 부르면 되고, 화면 컴포넌트 안에는 flow 분기를 넣지 마세요. 로그인 메인의 Sign Up은 `/login/terms`를 거쳐 `/login/email`로, Reset Password는 그 약관 단계 없이 바로 `/login/reset/email`로 진입합니다.
- `icons.tsx`는 화면에 속하지 않는 전역 공유 자산이라 하위 폴더로 옮기지 않고 루트에 유지합니다.
- 언어 설정 UI는 화면마다 다릅니다: `login-screen.tsx`는 바텀시트(`ui/bottom-sheet.tsx` 위에 언어 목록을 인라인으로 렌더링, `popoverTarget`으로 트리거)로, `my/language-setting-screen.tsx`(`/my/language`)는 전용 페이지로 엽니다 — Figma에서 두 화면이 실제로 다르게 디자인되어 있어 공용 컴포넌트로 묶지 않았습니다. 둘 다 언어 목록이 정적 배열이라 실제로 언어를 바꾸는 로직은 없습니다(현재 영어 버전만 서비스).
- `language-setting-screen.tsx`의 `CURRENT_LANGUAGE`는 실제 i18n이 없어서 "영어가 활성 언어"라고 흉내만 낸 상수입니다 — 다른 언어를 고르면 Confirm 버튼이 활성화되지만 눌러도 `/my`로 돌아갈 뿐 실제로 언어가 바뀌지는 않습니다. 실제 i18n 라우팅이 생기면 이 상수와 Confirm 버튼의 `onClick`을 교체하세요.
- `my-screen.tsx`의 하단 탭바(`Tapbar`)는 아직 이 화면에서만 쓰여서 별도 파일로 빼지 않고 `my-screen.tsx` 안에 로컬 컴포넌트로 둡니다. Home/Course 라우트가 생겨 다른 화면에서도 필요해지면 그때 `ui/`로 옮기세요. Course 탭은 아직 라우트가 없어 클릭해도 아무 일도 일어나지 않습니다 — `/course`가 생기면 연결하세요.

### 아이콘 다루기
- 아이콘 라이브러리 의존성(`@iconify/react`, `lucide-react` 등)은 의도적으로 없습니다. 전부 Material Symbols 표준 글리프지만, Next 16 + Turbopack에서 `unplugin-icons` 설정 리스크를 감수하느니 25개를 인라인하는 쪽이 쌉니다. 아이콘이 100개를 넘거나 디자이너가 계속 새로 추가해서 Figma 왕복이 병목이 되면 그때 다시 판단하세요.
- 모든 아이콘은 `fill`/`stroke`가 `currentColor`입니다. 색은 호출부에서 `className`의 `text-*`로 줍니다. 크기도 안 박혀 있으니 `className="size-6"` 식으로 주세요.
- `home`/`map`/`mypage`는 selected 변형이 따로 없습니다 — Figma의 `-selected` 변형이 path가 완전히 동일하고 fill만 달랐습니다. 색으로 구분하세요: `<HomeIcon className={active ? "text-gray-900" : "text-gray-400"} />`
- 반면 `SaveSmIcon`(16px)과 `SaveLgIcon`(24px)은 path가 실제로 다른 별개 도형이라 둘 다 있습니다. `ClockIcon`도 16px 원본입니다. viewBox 확인하고 쓰세요.
- 새 아이콘 추가: Figma MCP `download_assets`로 해당 노드의 SVG를 받으세요. export에는 캔버스 배경(`#F5F5F5` rect)과 아트보드 프레임 path(좌표가 `-277` 같은 음수)가 딸려오니 `<g id="icon/NAME">` 안쪽만 남기고, 레이어 `id`를 지우고, 하드코딩된 색을 `currentColor`로 바꾸고, `fill-rule` 같은 속성을 JSX용 camelCase로 고치세요. 원본 아이콘 이름을 코멘트로 남기세요.
- 기억에 의존해서 글리프를 손으로 그리거나 비슷하게 만들지 말고, 실제로 export된 path 데이터를 쓰세요.

<!-- MANUAL: -->

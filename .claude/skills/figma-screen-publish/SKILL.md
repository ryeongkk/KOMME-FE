---
name: figma-screen-publish
description: Figma MCP와 기존 디자인 토큰(`src/app/globals.css`)을 근거로 KOMME-FE 화면을 퍼블리싱한다. 색상·간격·타이포를 눈대중으로 고르지 않고 Figma 파일 `mGriQB29mZ6VpIDQDpo5F6`에서 노드 단위로 값을 뽑아 쓰고, 이미 있는 토큰/아이콘/컴포넌트를 먼저 재사용한 뒤 없을 때만 새로 추출한다. Use this whenever the user asks to implement, publish, or build a screen/route from Figma ("화면 구현해줘", "퍼블리싱해줘", "이 피그마 화면 만들어줘", "로그인 화면처럼 ~ 만들어줘"), pastes a figma.com URL for this project, or asks to add a new design token/icon sourced from Figma.
---

# Figma 화면 퍼블리싱 (KOMME-FE)

Figma MCP로 뽑은 값과 기존 디자인 토큰을 근거로 화면을 구현한다. 로그인/약관 화면에서 이미 쓰고 있는 패턴을 그대로 따른다.

## 왜 이렇게 하는가

이 프로젝트의 디자인 토큰(`globals.css`)과 아이콘(`icons.tsx`)은 전부 Figma 파일 `mGriQB29mZ6VpIDQDpo5F6`의 특정 노드에서 뽑은 값이라는 근거가 있다. 색이나 간격을 감으로 정하면 그 근거가 깨지고, 나중에 디자이너가 값을 바꿨을 때 뭘 다시 봐야 하는지 알 수 없게 된다. 반대로 이미 추출해둔 토큰이 있는데 또 새로 뽑으면 같은 의미의 값이 globals.css에 중복으로 쌓인다. 그래서 순서가 중요하다: **이미 있는 토큰/아이콘/컴포넌트 재사용 → 없을 때만 Figma에서 새로 추출 → 그것도 없으면 만든다.**

## 절차

### 1. 대상 노드 파악
사용자가 Figma 링크를 줬으면 그 노드를, 안 줬으면 무슨 화면인지 먼저 확인한다. 이 프로젝트의 와이어프레임은 파일 `mGriQB29mZ6VpIDQDpo5F6`, 페이지 `wireframe`, 루트 노드 `0:1`에 있다. 필요하면 `get_metadata`로 하위 노드를 훑어 화면 이름과 노드 ID를 특정한다.

### 2. 디자인 컨텍스트 확보
`get_design_context`(구조·스펙)와 `get_screenshot`(레이아웃 확인)으로 해당 노드를 읽는다. 여러 화면이 비슷하면 이미 퍼블리싱된 `src/components/login/login-screen.tsx`, `terms-screen.tsx`를 같이 열어 이 저장소에서 Figma 스펙을 코드로 옮기는 실제 관례(간격은 `mt-[150.5px]` 같은 임의값으로, 색/타이포는 토큰 클래스로)를 확인한다.

### 3. 디자인 토큰 — 있는 것부터
새 색상/타이포가 필요하면 먼저 `src/app/globals.css`의 `@theme inline` 블록에 이미 있는지 확인한다 (`gray-50~900`, `primary`, `secondary-100~400`, `negative`, `text-title-*`/`text-body-*` 등 11개 타이포 토큰). 있으면 그대로 쓴다.

정말 없을 때만 Figma MCP `get_variable_defs`(색상은 보통 노드 `142:2027`, Color System)로 정확한 값을 뽑아 같은 블록에 추가하고, **나중에 재검증할 수 있도록 노드 ID를 코멘트로 남긴다.** 절대 스크린샷을 보고 눈대중으로 hex 값을 찍지 않는다.

### 4. 아이콘 — 있는 것부터
필요한 아이콘이 `src/components/icons.tsx`의 기존 25개 중에 있는지 먼저 확인한다 (`import { XIcon } from "@/components/icons"`). 없을 때만 Figma MCP `download_assets`(아이콘 섹션 노드 `157:2536` 근처)로 받아 `components/AGENTS.md`에 정리된 절차를 따른다:
- export에 딸려오는 캔버스 배경 rect, 아트보드 프레임 path(좌표가 음수인 것)는 지우고 `<g id="icon/NAME">` 안쪽만 남긴다.
- 레이어 `id` 속성 제거, 하드코딩된 색은 `currentColor`로, `fill-rule` 등 속성은 JSX camelCase로 바꾼다.
- 원본 아이콘 이름을 코멘트로 남긴다.
- 크기·색은 아이콘 안에 박지 않는다 — 호출부에서 `className="size-6 text-gray-400"` 식으로 준다.
- 새 라이브러리 의존성(`lucide-react` 등)을 추가하지 않는다. 이미 그렇게 안 하기로 정한 이유가 있다 (`components/AGENTS.md` 참고).

아이콘 라이브러리 없이 인라인으로 버티는 건 지금 규모(25개)에서 합리적인 선택이지, 앞으로도 무조건 그래야 한다는 뜻은 아니다 — 아이콘이 100개를 넘거나 계속 새로 추가돼서 병목이 되면 그때 재판단한다.

### 5. 컴포넌트 배치
화면 전용 컴포넌트는 `src/components/<screen>/` 아래 화면 이름을 딴 파일로 만든다 (예: `src/components/onboarding/onboarding-screen.tsx`). 여러 화면이 공유하는 범용 프리미티브만 `src/components/ui/`에 둔다 — 한 화면에서만 쓰는 걸 미리 `ui/`에 넣지 않는다, 두 번째 사용처가 생기면 그때 옮긴다.

라우트의 `src/app/<route>/page.tsx`는 이 컴포넌트를 렌더링만 하는 얇은 래퍼로 유지한다:
```tsx
import { XScreen } from "@/components/x/x-screen";

export default function Page() {
  return <XScreen />;
}
```

### 6. 스타일링
Tailwind v4 유틸리티를 쓰되, 색상/타이포는 토큰 클래스(`text-gray-900`, `text-body-m-14` 등)로, Figma 스펙에만 있는 간격·크기는 임의값 클래스(`mt-[150.5px]`, `size-[60px]`)로 그대로 옮긴다. `@/*` 경로 별칭으로 import하고, 다른 라우트 폴더로 상대 경로 import하지 않는다.

현재는 영어 버전만 서비스한다 — 다른 언어 폰트나 i18n 라우팅을 미리 추가하지 않는다.

### 7. 완료 기준
아직 테스트 스위트가 없으므로 `pnpm build`와 `pnpm lint` 통과가 완료 기준이다.

### 8. 구조가 바뀌면 AGENTS.md도 같이
새 라우트/컴포넌트 폴더가 생기거나 규칙이 달라지면 해당 디렉토리의 `AGENTS.md`(예: `src/app/AGENTS.md`의 하위 디렉토리 표, `src/components/AGENTS.md`)를 같은 턴에 업데이트한다. 나중으로 미루지 않는다.

<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-01 | Updated: 2026-08-21 -->

# app

## 목적

Next.js App Router 루트입니다: 라우트, 루트 레이아웃, 전역 스타일/디자인 토큰, PWA 메타데이터(매니페스트, 아이콘, 서비스워커 등록)가 모두 여기 있습니다.

## 주요 파일

| 파일              | 설명                                                                                                                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layout.tsx`      | 루트 레이아웃. `next/font/google`로 Raleway를 불러오고, PWA `metadata`/`viewport`를 설정하며, `RegisterServiceWorker`/`EnableMocking`을 마운트함. `children`을 `QueryProvider`로 감싼 뒤 `max-w-sm` 중앙 정렬 컨테이너로 감싸서 데스크톱 너비에서도 항상 모바일 폭으로 렌더링되고 양옆은 흰 여백임 |
| `page.tsx`        | 홈 라우트(`/`) — `src/components/home/home-screen.tsx`를 렌더링만 함 (Figma 노드 `137:1175`/`352:6583`, 하단 탭바 포함, 예정 코스(있음/없음 두 상태)·관심 주제·내 근처 인기 장소 섹션. 장소 이미지는 아직 사진 API가 없어 크기만 맞춘 회색 박스)      |
| `globals.css`     | Tailwind v4 테마: 색상 토큰(gray 50~900, `primary`, `secondary` 100~400, `negative`)과 11개 타이포그래피 토큰(`text-title-b-20`, `text-body-sb-16` 등). Figma 파일 `mGriQB29mZ6VpIDQDpo5F6`(Color System 노드 `142:2027`)에서 추출. 테마 블록 아래에 `.bottom-sheet` 슬라이드업 애니메이션(`@starting-style` + `transition-behavior: allow-discrete`)도 있음 — `ui/bottom-sheet.tsx`를 쓰는 모든 화면이 공유하는 클래스라 Tailwind 유틸리티 대신 순수 CSS로 둠 |
| `manifest.ts`     | PWA 매니페스트 — 이름, 아이콘, 테마 색상. `<html lang>`은 `en`인데 카피는 여전히 한국어임                                                                                                                                          |
| `register-sw.tsx` | 클라이언트 컴포넌트. `public/sw.js`를 프로덕션 빌드에서만 등록함                                                                                                                                                                   |
| `enable-mocking.tsx` | 클라이언트 컴포넌트. `src/mocks/browser.ts`(MSW)를 개발 모드에서만 기동함 — 백엔드 Swagger 미배포 구간을 메우는 임시 조치, `src/AGENTS.md` 참고 |
| `query-provider.tsx` | 클라이언트 컴포넌트. `QueryClient`를 `useState`로 한 번만 만들어(SSR에서 모듈 스코프에 두면 요청 간 캐시가 새는 문제 방지) `QueryClientProvider`로 감쌈 |
| `apple-icon.tsx`  | `next/og`의 `ImageResponse`로 생성하는 180×180 apple-touch-icon                                                                                                                                                                    |
| `favicon.ico`     | 정적 파비콘                                                                                                                                                                                                                        |

## 하위 디렉토리

| 디렉토리        | 설명                                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| `icon-192.png/` | 동적 PNG 아이콘 라우트 — `next/og`를 쓰는 `route.tsx`의 `GET` 핸들러 (`icon-192.png/AGENTS.md` 참고) |
| `icon-512.png/` | 512×512 버전, 패턴은 동일 (`icon-512.png/AGENTS.md` 참고)                                            |
| `login/`        | 로그인 플로우 라우트 — `/login`, `/login/terms`, `/login/email`, `/login/code`, `/login/password`, `/login/nickname`, `/login/reset/email`, `/login/reset/code`, `/login/reset/password`. 화면 컴포넌트는 `src/components/login/`에 있고 각 `page.tsx`는 그걸 렌더링만 함 — `reset/` 쪽 3개는 회원가입과 같은 화면 컴포넌트를 다른 문구/다음 라우트/`onSubmit` prop으로 재사용함 (`components/AGENTS.md` 참고). `email`/`code`/`password`/`nickname`/`reset/*` 7개 `page.tsx`는 전부 `onSubmit`/`onConfirm`/`onResend`에 클로저(세션 draft 저장, `lib/api/auth.ts` 호출)를 넘겨야 해서 `"use client"`입니다 — Server Component는 함수를 Client Component prop으로 못 넘김 |
| `my/`           | 마이페이지 라우트 — `/my`(하단 탭바 포함, 프로필 행 닉네임은 `getMyProfile()`로 조회, 클릭 시 `/my/account`로, Language Setting 행 클릭 시 `/my/language`로, Terms & Policies 행 클릭 시 `/my/terms`로 이동), `/my/account`(프로필 편집/로그아웃/계정 삭제, Edit Profile 행 클릭 시 `/my/account/edit`로 이동 — 로그아웃/계정 삭제 모두 실제 Auth API 연동됨, `components/AGENTS.md` 참고), `/my/account/edit`(닉네임 변경 — 형식 검증은 `login/nickname-screen.tsx`와 동일한 정규식·토스트 패턴 재사용, `assertNicknameAvailable()`+`updateNickname()`으로 User API 연동됨), `/my/language`(언어 선택 — 로그인 화면의 바텀시트와 달리 전용 페이지, Confirm이 `updatePreferredLanguage()` 호출), `/my/terms`(약관 및 정책 목록), `/my/terms/service`·`/my/terms/privacy`·`/my/terms/location`(각 약관 상세 — 헤더만 있고 본문은 Figma 와이어프레임에 아직 없어 비워둠). 화면 컴포넌트는 `src/components/my/`에 있고 각 `page.tsx`는 그걸 렌더링만 함. 하단 탭바(`Tapbar`)는 홈 화면이 생기면서 두 번째 사용처가 필요해져 `components/ui/tapbar.tsx`로 옮김 |
| `spots/`        | 스팟 라우트 — `/spots`(Figma 노드 `137:1243`, 뒤로가기 헤더 + Most Popular/All/토픽 필터 탭 + 스팟 카드 리스트, 탭바 없음. 홈 화면의 "Select a topic you're interested in" 섹션 More에서 진입), `/spots/[id]`(Figma 노드 `422:15341`, 카드 클릭 시 이동 — 사진 + 이름/평점/거리 + 주소·전화·영업시간 + 네이버 지도 열기 버튼). 스팟 데이터는 `src/components/spots/data.ts`에 정적 목록(`SPOTS`)으로 있고 리스트·상세·코스 상세·코스 지도 화면이 공유함(스팟 API 없음, id로 매칭, 없으면 `notFound()`; `lat`/`lng`는 지도용으로 수기 조사한 근사값). 화면 컴포넌트는 `src/components/spots/`에 있고 각 `page.tsx`는 그걸 렌더링만 함. 리스트의 스팟 카드는 `ui/spot-card.tsx`(두 번째 사용처인 코스 상세가 생기면서 이동). 정렬 바텀시트는 아직 없음(Figma에는 있으나 스코프 밖) — 스팟 이미지도 사진 API가 없어 회색 박스임. 네이버 지도 로고는 브랜드 마크라 다른 아이콘과 달리 `public/icons/naver-map.png`에 원본 그대로 저장(색상 재정의 불가) |
| `course/`       | 코스 라우트 — `/course`(하단 탭바 포함). Upcoming/History 세그먼트 탭은 로컬 state가 아니라 URL 쿼리(`?tab=history`, `router.replace()`)로 관리 + 우하단 FAB(+, `/course/create`로 연결). 두 탭 다 `getCourses(status)`(`GET /courses?status=`, Bearer 필요)로 실 API 연동됨. Upcoming 탭(Figma 노드 `137:1121`/`354:7845`)은 코스 카드 리스트(`ui/schedule-card.tsx` 재사용, D-DAY 뱃지 + Edit Schedule/View Course 버튼 2개 — D-day는 응답의 `visitDate`에서 클라이언트가 계산)를, History 탭(노드 `354:7785`/`354:7899`)은 `HistoryCard`(뱃지 없이 View Course 버튼 1개) 리스트를 보여주며, 둘 다 비어 있으면 같은 빈 상태("No courses created yet.")를 공유함. 두 카드의 View Course 버튼은 `/course/[id]`로 연결됨(Edit Schedule은 여전히 미연결). `/course/[id]`(Figma 노드 `358:10841`)는 뒤로가기+코스명 헤더(`GET /courses/{courseId}`의 `title` — 저장 전 코스라 `null`이면 Figma 플레이스홀더 "Course name"으로 폴백) + 지도 아이콘(`/course/create/complete/map`으로 링크, courseId 미연동 — 아래 참고)/삭제 아이콘 + 세로 점선 타임라인(원형 마커 + `course/course-spot-card.tsx` — Course API 스팟은 `saves`/`hours`/`address` 등이 없어 `ui/spot-card.tsx`와 별개 카드) + 정거장 사이 거리. `page.tsx`는 라우트 파라미터(`id`)만 클라이언트 컴포넌트에 prop으로 넘기고 조회 자체는 화면이 함(Bearer 토큰이 localStorage에 있어 서버 컴포넌트에서 미리 fetch 불가). 삭제 아이콘은 확인 다이얼로그(노드 `384:13130`)를 거쳐 `deleteCourse()`(`DELETE /courses/{courseId}`) 호출 후 코스 목록 쿼리를 무효화하고 `router.back()`으로 돌아감 — Upcoming/History 어느 탭에서 들어왔든 그 탭으로 복귀. `/course/create`(Figma 노드 `324:3543`/`340:4539`/`340:4584`/`347:6408`)는 코스 생성 플로우 1/3단계(장소 검색), 2/3(주제 선택), 3/3(스팟 개수+방문일, 노드 `352:7529`/`354:8127`/`357:8751`) — 3/3의 Next 버튼이 `createCourse()`(`POST /courses`)를 호출하고, 성공하면 응답 `courseId`를 쿼리 파라미터로 붙여 `/course/create/complete?courseId=`로 이동함(실패 시 인라인 에러 메시지, `lib/api/course-error-messages.ts`). `/course/create/complete`(Figma 노드 `357:8812`, `<Suspense>`로 감싸야 정적 빌드됨 — `useSearchParams`로 `courseId` 읽는 클라이언트 컴포넌트라서)는 코스 생성 완료 화면 — `getCourseDetail(courseId)`로 실제 스팟 타임라인을 보여주고, 헤더의 저장 아이콘이 코스 이름을 입력하는 Save Course 바텀시트를 엶 — 이름을 입력하고 Save를 누르면 `saveCourse(courseId, title)`(`PATCH /courses/{courseId}/save`) 호출 후 코스 목록 쿼리를 무효화하고 `/course`로 이동(`router.replace`라 뒤로가기 히스토리에 이 화면이 안 남음). 헤더의 back 화살표는 바로 나가지 않고 "Leave this page?" 확인 다이얼로그(노드 `390:13995`)를, 하단 "Try Again" 버튼(Figma 원본 카피 그대로)은 "Regenerate this course?" 확인 다이얼로그(노드 `390:14119`)를 먼저 띄움 — 둘 다 `/course/[id]`의 삭제 다이얼로그와 같은 패턴이라 `ConfirmDialog` 로컬 컴포넌트로 공유하고, 확정 시 `deleteCourse(courseId)`를 호출함(`POST /courses`가 이미 서버에 코스를 만들어 놓은 상태라 나가거나 다시 만들 때는 그 미저장 코스를 지워야 함). Leave는 `/course`로, Try Again은 위저드 1단계인 `/course/create`로 `router.replace` 이동. 헤더의 지도 아이콘은 여전히 `/course/create/complete/map`(Figma 노드 `357:8859` "지도로 보기")으로 연결되지만 courseId를 안 넘겨받는 정적 스텁임 — Course API 연동 시 지도 화면은 courseId 라우팅 구조 자체가 없어 범위에서 제외함(사용자 확인 후 보류). Naver Maps JS SDK(스크립트 태그, npm 패키지 아님, `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`)를 써서 1·2번 핀 + 그 사이 경로를 그림(`fitBounds`로 두 핀이 다 보이게 줌 조정). 경로는 `/api/course-directions`(NCP Direction 15, `/api/reverse-geocode`와 같은 서버 전용 secret 패턴)로 실제 도로 경로를 받아 그리고, 이 호출이 실패하면 직선으로 폴백함 — Direction 15는 자동차 경로만 공개돼 있어서(Naver에 보행자 경로 API가 없음) 도보 코스 표시엔 정확하지 않을 수 있음(3번 핀도 아직). 핀을 누르면 Place Info 바텀시트(Figma 노드 `358:9505`, `spots/spot-detail-screen.tsx`와 같은 내용을 시트로)가 뜨는데, 마커 아이콘이 실제 `<button popovertarget>` HTML이라 Naver Maps SDK 이벤트 리스너 없이 네이티브 popover만으로 동작함. `COURSE_STOPS`가 아직 스텁이라 3개 다 같은 스팟이라, 2번 핀은 `SPOTS[1]`을 임의로 씀 — 실제 코스 데이터 생기면 `COURSE_STOPS[1].spot`으로 교체 필요. 화면은 `fixed h-dvh` 루트를 flex-col로 두고 헤더(흰 바탕, back 화살표만, `pt-[env(safe-area-inset-top)]`로 노치 보정 — 이 화면이 `fixed`라 다른 화면들이 공짜로 받는 문서 흐름 기반 safe-area 처리를 못 받아서 직접 넣어야 함) + 지도(`flex-1`)로 구성. 지도 컨테이너는 `absolute inset-0`이 아니라 `w-full flex-1`로 크기를 잡는데, Naver SDK가 컨테이너에 인라인 `position: relative`를 직접 박아 넣어서 `position` 의존적인 사이징(`inset-0`)은 깨짐 — `flex-1`은 아이템 자신의 `position`값과 무관하게 flex 알고리즘으로 높이가 정해져서 이 문제를 안 받음. Naver Maps 타입은 `src/types/navermaps.d.ts`에 필요한 만큼만 앰비언트로 선언(패키지 미설치). 코스 스텁 데이터(`COURSE_STOPS`)는 `course/create-data.ts`에 남아 있고 이 지도 화면만 계속 씀(좌표 포함) |

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
- `EnableMocking`은 반대로 `NODE_ENV === "development"`에서만 동작합니다 — 프로덕션 빌드에는 MSW 워커가 기동되지 않습니다. 두 서비스워커(`sw.js`, `mockServiceWorker.js`)가 서로 다른 환경에서만 등록되므로 스코프 충돌은 없습니다.

## 의존성

### 내부

- `public/sw.js` — `register-sw.tsx`가 등록함
- `src/mocks/browser.ts` — `enable-mocking.tsx`가 등록함
- `src/components/icons.tsx` — 라우트 안에서 쓰는 아이콘 컴포넌트 25개

<!-- MANUAL: -->

<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-01 | Updated: 2026-08-01 -->

# public

## 목적

사이트 루트에서 서빙되는 정적 자산과 PWA 서비스워커가 있는 곳입니다.

## 주요 파일

| 파일 | 설명 |
|------|------|
| `sw.js` | 서비스워커: GET 요청에 대해 cache-first, 오프라인 폴백 페이지는 아직 없음. `src/app/register-sw.tsx`가 프로덕션 빌드에서만 등록함. 의도적으로 단순화한 부분에 `ponytail:` 표시가 있으니 확장하기 전에 `/ponytail-debt`로 확인해볼 것 |

`create-next-app` 스타터 SVG(`file`/`globe`/`window`/`next`/`vercel`)는 전부 삭제했습니다. 지금 이 디렉토리에 정적 이미지는 하나도 없습니다.

## AI 에이전트를 위한 안내

### 이 디렉토리에서 작업할 때
- UI 아이콘은 여기에 정적 파일로 두지 말고 `src/components/icons.tsx`에 Figma에서 뽑은 인라인 SVG 컴포넌트로 넣으세요 — `src/components/AGENTS.md` 참고.
- `sw.js`는 캐시 무효화를 위해 `CACHE_NAME`을 올리는 방식입니다. 캐시 동작을 바꿀 땐 버전 문자열(`komme-static-v1`)도 함께 바꾸세요.

<!-- MANUAL: -->

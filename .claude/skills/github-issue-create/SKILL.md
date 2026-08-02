---
name: github-issue-create
description: Draft and create a GitHub issue in this repo's own format — reads whatever template lives under .github/ISSUE_TEMPLATE/, writes a short, high-signal title and a checklist body broken down at commit granularity, and applies a type label (feat/fix/refactor/docs/chore/test) plus the repo owner as assignee via gh. Use this whenever the user asks to create/file/register a GitHub issue ("이슈 만들어줘", "이슈 파줘", "깃허브에 이슈 등록해줘", "이거 이슈로 남겨줘"), or describes a feature/bug/task they want tracked before starting work — even if they never say the word "이슈". Always preview the drafted issue and get explicit go-ahead before actually running `gh issue create`, since this action is visible to collaborators and can't be quietly undone.
---

# GitHub 이슈 생성

사용자가 설명한 작업을 이 저장소의 이슈 템플릿에 맞춰 다듬고, `gh issue create`로 실제 이슈를 만든다.

## 왜 이렇게 하는가

이슈 제목은 나중에 브랜치명·PR 제목·커밋 로그 어디서든 스치듯 보게 되는 텍스트다. 길고 상세하면 그 순간마다 다시 읽어야 하니, 제목은 "이게 뭐하는 이슈인지" 한눈에 알 수 있을 만큼만 짧게 쓰고, 대신 본문 체크리스트에 실제 작업 단위를 촘촘히 적어둔다. 체크리스트를 커밋 단위로 쪼개두면 작업하면서 그대로 커밋 메시지로 옮길 수 있고, 이슈 자체가 진행 상황판 역할을 한다.

## 절차

### 1. 작업 내용 파악
사용자가 이미 설명했으면 그걸 근거로, 애매하면 무엇을 만들려는 건지 한두 가지만 짚어 확인한다. 처음부터 취조하듯 여러 질문을 던지지 말 것 — 애매한 부분만.

### 2. 저장소 정보와 템플릿 읽기
```bash
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
cat .github/ISSUE_TEMPLATE/*.md 2>/dev/null | head -50
```
템플릿의 섹션 구조(제목 형식, 본문 헤딩)를 그대로 따른다. 템플릿이 없는 저장소라면 KOMME-FE에서 쓰는 `## 🛠 작업 내용` / `## 💡 참고 사항` 2단 구조를 기본값으로 쓴다.

### 3. 타입 라벨 확인 및 생성
`feat`(새 기능) / `fix`(버그) / `refactor`(리팩토링) / `docs`(문서) / `chore`(설정·빌드 등) / `test`(테스트) 여섯 개 중 이번 작업에 맞는 걸 하나 고른다. 저장소에 라벨이 없으면 그때 만든다:
```bash
declare -A LABELS=([feat]="0E8A16:새로운 기능" [fix]="D73A4A:버그 수정" [refactor]="FBCA04:코드 리팩토링" [docs]="0075CA:문서 수정" [chore]="BFD4F2:빌드/설정 등 기타 작업" [test]="5319E7:테스트 추가/수정")
EXISTING=$(gh label list --repo "$REPO" --json name -q '.[].name')
for name in "${!LABELS[@]}"; do
  echo "$EXISTING" | grep -qx "$name" || {
    color="${LABELS[$name]%%:*}"; desc="${LABELS[$name]#*:}"
    gh label create "$name" --repo "$REPO" --color "$color" --description "$desc"
  }
done
```

### 4. 제목 작성
`[TYPE] 핵심 요약` 형식 (예: `[FEAT] 로그인 페이지 구현`). 선택한 라벨의 대문자 버전을 태그로 쓰고, 요약은 무엇을 하는 이슈인지 명사구로 짧게 — 수단이나 세부 구현은 제목에 넣지 않는다.

### 5. 본문 작성 — 체크리스트는 커밋 단위로, 단 잘게 쪼개지 않는다
`## 🛠 작업 내용` 아래 체크리스트는 "이 작업을 마치면 의미 있는 커밋 하나가 나온다" 싶은 크기로 나눈다. 한 문장으로 뭉치기엔 크지만, 세부 구현 단계까지 늘어놓을 필요는 없는 자연스러운 크기를 찾는 게 핵심이다. 보통 3~5개면 충분하다 — 그보다 많아지면 너무 잘게 쪼갠 건 아닌지 의심한다.

예를 들어 "로그인 페이지 퍼블리싱"이라면:
```
- [ ] 로그인 페이지 레이아웃 마크업
- [ ] 공통 UI 컴포넌트 스타일 적용
- [ ] 반응형 대응 및 QA
```
처럼 큰 덩어리로 나누고, "포커스 상태 처리"·"에러 메시지 스타일" 같은 세부 항목까지 각각 체크박스로 만들지 않는다 — 그런 디테일은 작업하다 보면 자연스럽게 딸려오는 하위 작업이지, 별도로 추적할 단위가 아니다.

각 항목은 부연 설명 없이 짧은 명사구로 끝낸다. 괄호로 "(mutation)", "(예: ~)" 같은 보충 설명을 달지 않는다 — 필요한 부가 설명은 항목을 늘리지 말고 `## 💡 참고 사항`으로 뺀다.

`## 💡 참고 사항`에는 의존성, 디자인 링크, 범위에서 제외한 것 등 작업 전에 알아두면 좋은 걸 적는다. 특별히 없으면 빈 리스트로 둬도 된다.

### 6. 미리보기 후 확인
실제로 만들기 전에 채팅에 아래처럼 보여주고 승인을 받는다:
```
### 이슈 미리보기
**제목:** [FEAT] 로그인 페이지 구현
**라벨:** feat
**담당자:** <저장소 소유자 GitHub 로그인>

**본문:**
(본문 내용)

---
이대로 생성할까요?
```
담당자는 저장소를 조작하는 계정 본인(`gh api user -q .login`으로 확인)으로 고정한다.

### 7. 생성
승인받으면:
```bash
gh issue create --repo "$REPO" --title "<제목>" --body "<본문>" --label "<타입>" --assignee "<본인 로그인>"
```
생성된 이슈 URL을 그대로 사용자에게 전달한다. 수정 요청이 오면 다시 만들지 말고 `gh issue edit`으로 반영한다.

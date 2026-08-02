---
name: github-pr-create
description: Draft and open a GitHub PR for the current branch using this repo's own pull_request_template.md — title is copied verbatim from the linked issue, checkboxes and the work-summary section are filled from the actual commits/diff on the branch (not generic filler), and a type label plus the repo owner as assignee are applied via gh. Use this whenever the user asks to open/create/push a pull request ("PR 만들어줘", "PR 올려줘", "풀리퀘 생성", "이 브랜치 PR 파줘", "머지 요청 만들어줘"). Always preview the drafted PR and get explicit go-ahead before running `gh pr create`, since opening a PR is visible to collaborators and notifies them.
---

# GitHub PR 생성

현재 브랜치의 실제 커밋/변경사항을 바탕으로 이 저장소의 PR 템플릿을 채우고, `gh pr create`로 PR을 연다.

## 왜 이렇게 하는가

PR 제목이 연결된 이슈 제목과 다르면 나중에 이슈-PR-커밋을 오가며 추적할 때 "이게 그 이슈 맞나?" 하고 매번 확인해야 한다. 제목을 이슈와 완전히 동일하게 맞추면 그 확인 과정 자체가 없어진다. 본문도 마찬가지 이유로 실제 diff/커밋에서 뽑아 쓴다 — "버그 수정했습니다" 같은 뭉뚱그린 요약은 리뷰어가 결국 diff를 처음부터 다시 읽게 만든다.

## 절차

### 1. 브랜치 확인
```bash
BRANCH=$(git branch --show-current)
BASE=$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)
```
`$BRANCH`가 `$BASE`와 같으면 PR을 만들 수 없다고 알리고 중단한다.

### 2. 연결된 이슈 찾기
브랜치명에서 이슈 번호를 먼저 찾는다 (`feat/12-login`, `12-login` 등 숫자가 있으면 그걸 후보로). 커밋 메시지에 `#숫자`가 있으면 그것도 후보에 넣는다. 후보가 하나로 좁혀지지 않거나 없으면, 넘겨짚지 말고 어떤 이슈를 resolve하는 PR인지 사용자에게 직접 묻는다 — 제목을 이슈와 정확히 맞춰야 하는데 잘못된 이슈에 맞추면 더 나쁘다.

이슈 번호가 정해지면 정확한 제목을 가져온다:
```bash
ISSUE_TITLE=$(gh issue view <N> --repo "$REPO" --json title -q .title)
```

### 3. 실제 변경사항 수집
```bash
git log "$BASE"..HEAD --oneline
git diff "$BASE"...HEAD --stat
```
이 결과를 근거로 작업 사항을 쓴다. 커밋 메시지가 이미 `feat:`, `fix:` 같은 prefix를 쓰고 있다면 그 신호를 타입 판단과 체크박스 선택에 활용한다.

### 4. 타입 라벨 확인 및 생성
`feat`/`fix`/`refactor`/`docs`/`chore`/`test` 중 diff의 성격상 가장 지배적인 걸 하나 고른다. 라벨이 없으면 [github-issue-create](../github-issue-create/SKILL.md) 스킬의 3단계와 동일한 방식으로 만든다.

### 5. PR 템플릿 채우기
```bash
cat .github/pull_request_template.md
```
- **제목**: 2단계에서 가져온 `$ISSUE_TITLE` 그대로 (재작성 금지)
- **PR 유형 체크박스**: 실제 변경된 파일과 커밋 성격을 보고 해당하는 항목만 체크. 애매하면 과감하게 다 체크하지 말고 확실한 것만
- **관련 이슈**: `resolves #<N>`
- **작업 사항**: 커밋 로그/diff에 실제로 있는 변경을 근거로 구체적으로 — "OO 페이지에 XX 컴포넌트 추가", "YY API 연동 시 발생하던 에러 수정" 처럼 무엇을 왜 바꿨는지 알 수 있게. "기능 구현", "버그 수정" 같은 한 줄 요약만으로 끝내지 않는다
- **기타**: 배포 시 주의사항이나 리뷰어가 알아야 할 게 diff에서 보이면 적고, 없으면 비워둔다

### 6. 미리보기 후 확인
채팅에 제목/라벨/담당자/본문 전체를 보여주고 승인을 받는다. 담당자는 저장소를 조작하는 계정 본인(`gh api user -q .login`)으로 고정한다.

### 7. 생성
승인받으면:
```bash
gh pr create --repo "$REPO" --title "$ISSUE_TITLE" --body "<채운 템플릿>" --base "$BASE" --head "$BRANCH" --label "<타입>" --assignee "<본인 로그인>"
```
생성된 PR URL을 전달한다. 본문에 `resolves #N`이 들어가 있으므로 머지되면 이슈가 자동으로 닫힌다는 점을 함께 알려준다.

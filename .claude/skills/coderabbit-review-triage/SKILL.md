---
name: coderabbit-review-triage
description: Fetches CodeRabbit's review comments on a GitHub PR, judges each one against the actual code (bug vs. nitpick vs. intentional design), and applies only the fixes worth applying — locally, no GitHub reply, no commit, no push. Use whenever the user asks to check, handle, or respond to PR review comments ("PR 코멘트 확인해줘", "코드래빗 리뷰 반영해줘", "리뷰 지적사항 처리해줘", "코드래빗이 남긴 거 확인하고 고쳐줘", "이 PR 리뷰 대응해줘", "Needs human review 떴는데 확인해줘"), or right after CodeRabbit finishes reviewing a PR and the user wants to know what to do with the feedback. Do not use this for opening a new PR ([github-pr-create](../github-pr-create/SKILL.md)) or for a general code review with no existing PR comments to triage.
---

# CodeRabbit 리뷰 코멘트 대응

GitHub PR에 CodeRabbit이 남긴 리뷰 코멘트를 가져와서, 실제로 고칠 가치가 있는 것만 골라 로컬 코드에 반영한다.

## 왜 이렇게 하는가

CodeRabbit은 코멘트를 많이 남긴다 — 그중 상당수는 사소한 스타일 지적이거나, 이미 의도를 갖고 그렇게 짠 코드에 대한 오해다. 코멘트를 하나하나 다 반영하면 오히려 의도된 설계를 망가뜨리거나 노이즈만 늘어난다. 그렇다고 사람이 20개 코멘트를 처음부터 끝까지 읽는 것도 시간 낭비다. 이 스킬은 그 중간 판단을 대신한다 — 진짜 버그/실수만 골라 고치고, 나머지는 왜 스킵했는지 한 줄로 남긴다.

GitHub에 답글을 달거나 커밋/푸시까지 하지 않는 이유는, 이건 다른 협업자에게 보이는 행동이기 때문이다. 코드 반영까지는 이 스킬이 하지만, 그걸 리뷰어에게 어떻게 설명할지·언제 커밋할지는 사용자가 최종 판단한다.

## 절차

### 1. 대상 PR 확인
```bash
gh pr view --json number,url,headRefName,baseRefName
```
현재 브랜치에 연결된 PR이 없으면 실패한다 — 이 경우 사용자에게 PR 번호나 URL을 물어본다.

### 2. CodeRabbit 코멘트 수집
CodeRabbit은 두 군데에 코멘트를 남긴다:
- **요약 리뷰**: PR 전체에 대한 개요, "Actionable comments posted: N" 같은 카운트
- **인라인 리뷰 코멘트**: 실제 파일/라인에 달리는 코멘트 — 진짜 액션 아이템은 대부분 여기 있다

```bash
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
N=<PR 번호>

# 인라인 코멘트 (path, line, body, 스레드 구조)
gh api "repos/$REPO/pulls/$N/comments" --paginate \
  -q '.[] | {id, user: .user.login, path, line, body, in_reply_to_id}'
```
`user.login`이 `coderabbitai[bot]` 또는 `coderabbitai`인 것만 대상으로 삼는다.

**스레드 필터링**: `in_reply_to_id`로 같은 스레드를 묶어본다. 그 스레드에 CodeRabbit이 아닌 다른 사람(PR 작성자·리뷰어)이 이미 답글을 남겼다면, 그건 이미 사람이 검토하고 결론 낸 사안이다 — 건드리지 말고 스킵 목록에 "이미 논의됨"으로만 기록한다.

### 3. 코멘트별 판단
CodeRabbit은 코멘트 본문 맨 앞에 스스로 심각도 태그를 붙인다:
- `🧹 Nitpick` — 사소한 지적이라는 CodeRabbit 본인의 표시. 1차 신호로 삼아 기본 스킵 쪽에 둔다
- `⚠️ Potential issue`, `🛠️ Refactor suggestion` — 실제로 검토할 가치가 있는 것들

단, 이 태그는 참고용 신호일 뿐 그대로 자동 분류기로 쓰지 않는다. 태그와 무관하게 코멘트마다 실제로 파일을 열어 확인한다:
- **버그/실수가 맞는가**: 코멘트가 가리키는 코드를 읽고, 실제로 동작이 잘못될 시나리오가 있는지 확인한다.
- **의도된 설계인가**: 같은 패턴이 프로젝트 다른 곳에도 반복되는지(`grep`), 주변 코드나 커밋 메시지·AGENTS.md에 그렇게 짠 이유가 드러나는지 확인한다. 반복되는 컨벤션이거나 명시적 이유가 있으면 의도된 것으로 보고 스킵한다.

판단이 애매하면 반영보다 스킵 쪽에 무게를 둔다 — 사용자가 필요하면 나중에 명시적으로 요청할 수 있지만, 의도한 설계를 잘못 건드리면 되돌리는 게 더 번거롭다.

### 4. 반영
반영하기로 한 것만 실제로 코드 수정. 다 고친 뒤:
```bash
pnpm lint
```
루트 `AGENTS.md`에 따르면 이 저장소의 완료 기준은 `pnpm lint`와 `pnpm build` 통과이므로, 수정한 파일이 두 범위에 걸쳐 있으면 `pnpm build`도 같이 돌려 깨진 게 없는지 확인한다.

### 5. 결과 요약
채팅에 아래 형식으로 정리해서 보여준다:
```
### ✅ 반영함
- (파일:라인) 코멘트 요약 → 무엇을 고쳤는지

### ⏭️ 스킵함
- (파일:라인) 코멘트 요약 → 스킵 이유 (사소함 / 의도된 설계이고 근거: ... / 이미 사람이 논의함)
```
로컬 파일만 수정했고 커밋은 하지 않았다는 점, 확인 후 직접 커밋하라는 점을 마지막에 한 줄로 안내한다.

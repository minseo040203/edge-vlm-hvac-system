# Contributing Guide

Edge VLM HVAC System 프로젝트에 기여하는 방법을 안내합니다.

---

## 개발 환경

```bash
git clone https://github.com/minseo040203/edge-vlm-hvac-system.git
cd edge-vlm-hvac-system
```

프런트엔드 실행:

```bash
cd frontend
npm install
npm run dev
```

---

## 브랜치 전략

| 브랜치 | 설명 |
|--------|------|
| `main` | 안정 배포 브랜치 |
| `feature/*` | 기능 개발 |
| `fix/*` | 버그 수정 |
| `docs/*` | 문서 수정 |
| `test/*` | 테스트 추가 |

---

## PR 제출 전 확인

Pull Request를 만들기 전에 아래 명령을 실행합니다.

```bash
cd frontend
npm run test:coverage
npm run e2e
npm run build
```

---

## 커밋 메시지 규칙

| Prefix | 설명 |
|--------|------|
| `feat` | 새로운 기능 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 |
| `test` | 테스트 추가 |
| `ci` | CI/CD 수정 |
| `refactor` | 리팩토링 |
| `chore` | 기타 작업 |

예시:

```text
feat: add HVAC control recommendation logic
test: add Playwright E2E scenario
docs: update final project README
```

---

## 코드 리뷰 기준

PR은 다음 기준을 만족해야 합니다.

1. 테스트 통과
2. 주요 기능 설명 포함
3. 보안/비밀키 노출 없음
4. 문서 변경이 필요한 경우 README 업데이트
5. 기존 기능 회귀 없음

---

## Issue 작성 규칙

버그 리포트에는 다음 내용을 포함합니다.

```text
- 발생 환경
- 재현 방법
- 기대 동작
- 실제 동작
- 로그 또는 스크린샷
```

기능 제안에는 다음 내용을 포함합니다.

```text
- 문제 정의
- 제안 기능
- 기대 효과
- 대안 검토
```

---

## 테스트

프런트엔드 단위 테스트와 E2E 테스트를 실행합니다.

```bash
cd frontend
npm run test:coverage
npm run e2e
```

---

## 보안

다음 정보는 절대 커밋하지 않습니다.

1. API Key
2. GitHub Token
3. Vercel Token
4. 개인 인증 정보
5. `.env` 파일

---

## 문의

프로젝트 관련 문의는 GitHub Issue를 통해 남깁니다.
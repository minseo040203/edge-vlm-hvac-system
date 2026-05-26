# Runbook

## 목적

본 문서는 Edge VLM HVAC System의 운영, 장애 대응, 헬스체크, 롤백, 관측성 절차를 정리한 운영 문서이다.

최종 제출 요구사항 중 다음 항목을 충족하기 위해 작성하였다.

- main 배포
- 헬스체크
- 롤백 계획
- 관측성 로그/메트릭/대시보드
- 장애 대응 절차

---

## 1. 시스템 개요

Edge VLM HVAC System은 실내 환경 데이터를 기반으로 HVAC 제어 추천을 제공하는 AI 기반 공조 제어 프로젝트이다.

주요 구성은 다음과 같다.

| 구성 요소 | 설명 |
|----------|------|
| Frontend | React/Vite 기반 사용자 대시보드 |
| AI Logic | HVAC 제어 추천 및 PMV 점수 계산 |
| Feature Flag | 사용자/역할/환경 변수 기반 기능 토글 |
| A/B Test | 사용자 ID 기반 실험군 할당 |
| Experiment Logger | 사용자 이벤트 및 실험 로그 기록 |
| GitHub Actions | 테스트, 배포, 보안, 리포트 자동화 |
| Docker/GHCR | 컨테이너 이미지 빌드 및 배포 전략 |
| Health Check | 운영 URL 상태 확인 |
| Issues | 장애 및 주간 리포트 기록 |

---

## 2. 주요 GitHub Actions Workflow

| Workflow | 역할 |
|----------|------|
| `test-coverage.yml` | 단위 테스트, 80% coverage, Playwright E2E 실행 |
| `final-quality-gate.yml` | 최종 PR Gate, 문서 확인, 테스트, 미니 eval 실행 |
| `docker-build-push.yml` | Docker 이미지 빌드, 로컬 실행 검증, GHCR 푸시 |
| `security-scan.yml` | npm audit, Snyk, Python Safety 기반 보안 스캔 |
| `health-check.yml` | 운영 URL 헬스체크 및 실패 시 Issue 생성 |
| `npm-publish.yml` | GitHub Packages npm 패키지 배포 |
| `week13-experiment-report.yml` | 실험 리포트 생성 및 주간 리포트 자동화 |

---

## 3. 정상 운영 기준

정상 운영 상태는 다음 조건을 만족해야 한다.

| 항목 | 정상 기준 |
|------|----------|
| main 브랜치 | 최신 커밋 기준 workflow 성공 |
| Unit Test | 전체 테스트 통과 |
| Coverage | 80% 이상 |
| E2E | Playwright 시나리오 성공 |
| Docker Build | 이미지 빌드 및 로컬 실행 검증 성공 |
| Security Scan | 치명적 취약점 없음 |
| Health Check | 운영 URL HTTP 200~399 응답 |
| Release Tag | `v1.0.0` 이상 태그 존재 |

---

## 4. 배포 절차

### 4.1 main 브랜치 배포 흐름

1. `main` 브랜치에 코드가 push된다.
2. GitHub Actions가 자동 실행된다.
3. 테스트와 coverage를 확인한다.
4. Docker 이미지를 빌드한다.
5. 보안 스캔을 수행한다.
6. 운영 URL이 설정된 경우 헬스체크를 수행한다.
7. 실패 시 GitHub Issue 또는 Actions 로그를 통해 원인을 추적한다.

### 4.2 배포 전 확인 사항

| 확인 항목 | 명령 또는 위치 |
|----------|----------------|
| Git 상태 | `git status` |
| 최근 커밋 | `git log --oneline -5` |
| 프런트엔드 테스트 | `cd frontend && npm run test:coverage` |
| E2E 테스트 | `cd frontend && npm run e2e` |
| 프런트엔드 빌드 | `cd frontend && npm run build` |
| GitHub Actions | 저장소 Actions 탭 |
| 릴리스 태그 | 저장소 Tags 또는 Releases |

---

## 5. 헬스체크

운영 URL은 GitHub Repository Secret으로 관리한다.

| Secret | 설명 |
|--------|------|
| `PRODUCTION_URL` | 운영 프런트엔드 또는 API URL |

헬스체크 정상 기준은 다음과 같다.

| 항목 | 기준 |
|------|------|
| HTTP Status | 200 이상 399 이하 |
| Timeout | 지정 시간 내 응답 |
| Redirect | 정상 URL로 이동 가능 |
| 실패 처리 | GitHub Issue 생성 또는 Actions 실패 기록 |

헬스체크 실패 시 다음 항목을 확인한다.

1. `PRODUCTION_URL` Secret 값이 올바른지 확인한다.
2. 배포 대상 서비스가 실제로 실행 중인지 확인한다.
3. 최근 main 브랜치 커밋에서 배포 관련 변경이 있었는지 확인한다.
4. GitHub Actions의 `health-check.yml` 로그를 확인한다.
5. 필요하면 직전 안정 버전으로 롤백한다.

---

## 6. 장애 대응 절차

장애 발생 시 다음 순서로 대응한다.

1. 장애 발생 workflow 또는 서비스 위치를 확인한다.
2. GitHub Actions 로그에서 실패 step을 확인한다.
3. 최근 커밋과 변경 파일을 확인한다.
4. 장애 유형을 분류한다.
5. 임시 조치 또는 롤백을 수행한다.
6. GitHub Issue에 장애 내용과 조치 결과를 기록한다.
7. 동일 문제가 반복되지 않도록 테스트 또는 문서를 보강한다.

---

## 7. 장애 유형별 대응

| 장애 유형 | 원인 예시 | 대응 방법 |
|----------|----------|----------|
| 테스트 실패 | 로직 변경, selector 변경, dependency 문제 | 실패 테스트 확인 후 수정 |
| Coverage 실패 | 테스트 부족, 신규 코드 미검증 | 단위 테스트 추가 |
| E2E 실패 | UI 텍스트 변경, selector 중복 | role 기반 selector로 수정 |
| Docker 빌드 실패 | base image 오류, apt 패키지 문제 | CI 호환 이미지로 수정 |
| 보안 스캔 실패 | 취약 dependency | npm audit fix 또는 dependency 업데이트 |
| 헬스체크 실패 | URL 오류, 배포 실패 | Secret 확인 후 재배포 또는 롤백 |
| npm 배포 실패 | token 권한 문제, package scope 문제 | NPM_TOKEN 및 package name 확인 |

---

## 8. 롤백 계획

### 8.1 Git 커밋 롤백

최근 커밋으로 인해 장애가 발생한 경우 해당 커밋을 revert한다.

```bash
git revert <commit_sha>
git push origin main
```

### 8.2 이전 릴리스 태그로 롤백

안정 릴리스 태그가 있는 경우 해당 버전을 기준으로 복구한다.

```bash
git checkout v1.0.0
```

새 브랜치에서 복구 작업을 진행하는 경우:

```bash
git checkout -b hotfix/rollback-v1.0.0 v1.0.0
```

### 8.3 Docker 이미지 롤백

GHCR에 이전 안정 이미지가 있는 경우 해당 이미지를 사용한다.

```bash
docker pull ghcr.io/minseo040203/edge-vlm-hvac-system:<stable-tag>
docker run --rm ghcr.io/minseo040203/edge-vlm-hvac-system:<stable-tag>
```

### 8.4 Feature Flag 롤백

기능 장애가 특정 실험 기능에서 발생한 경우 Feature Flag를 비활성화한다.

| Flag | 롤백 방법 |
|------|----------|
| `hvacDashboardV2` | 환경 변수 또는 flag 설정에서 false 처리 |
| `energySavingTips` | 기능 노출 비율을 0%로 변경 |
| `vlmInsightPanel` | admin 대상 기능 비활성화 |

---

## 9. 관측성

본 프로젝트는 다음 관측성 정보를 제공한다.

| 항목 | 위치 |
|------|------|
| CI/CD 로그 | GitHub Actions |
| 테스트 결과 | `Test Coverage and E2E` workflow |
| Coverage Report | GitHub Actions Artifact |
| Playwright Report | GitHub Actions Artifact |
| E2E Screenshot/Video/Trace | `test-results`, `playwright-report` Artifact |
| 보안 스캔 결과 | GitHub Security, Actions 로그 |
| Docker 빌드 결과 | Docker workflow 로그 |
| 헬스체크 결과 | Health Check workflow 로그 |
| 실험 리포트 | `experiments/week13/generated-report.md` |
| 사용자 피드백 데이터 | `experiments/week13/user-personas-feedback.json` |
| Pivot/Persevere 결정 | `experiments/week13/pivot-or-persevere-decision.md` |

---

## 10. 메트릭

운영과 실험에서 추적하는 주요 메트릭은 다음과 같다.

| 메트릭 | 설명 |
|--------|------|
| Task Completion Rate | 사용자가 목표 작업을 완료한 비율 |
| CTA Click Rate | 주요 버튼 클릭률 |
| Feedback Rating | 사용자 피드백 평균 점수 |
| Session Duration | 평균 세션 체류 시간 |
| Test Pass Rate | CI 테스트 성공 여부 |
| Coverage | 단위 테스트 커버리지 |
| Build Success Rate | Docker/Frontend 빌드 성공 여부 |
| Health Check Status | 운영 URL 정상 응답 여부 |

---

## 11. 대시보드

본 프로젝트의 운영 대시보드는 GitHub 기반으로 구성한다.

| 대시보드 | 위치 |
|---------|------|
| CI/CD Dashboard | GitHub Actions 탭 |
| Security Dashboard | GitHub Security 탭 |
| Issue Dashboard | GitHub Issues |
| Experiment Dashboard | `experiments/week13` 문서 |
| Release Dashboard | GitHub Tags/Releases |
| Package Dashboard | GitHub Packages |

---

## 12. 릴리스 절차

릴리스는 `v1.0.0` 이상의 Git tag로 관리한다.

릴리스 태그 생성:

```bash
git tag -a v1.0.0 -m "release: final project submission"
git push origin v1.0.0
```

이미 태그가 존재하는 경우 더 높은 버전을 사용한다.

```bash
git tag -a v1.0.2 -m "release: final project submission"
git push origin v1.0.2
```

릴리스 전 확인 사항:

1. README 최신화
2. CHANGELOG 최신화
3. RETROSPECTIVE 작성
4. 테스트 workflow 성공
5. 보안 workflow 확인
6. 최종 quality gate 성공
7. 태그 push 완료

---

## 13. Incident Report 템플릿

장애가 발생하면 GitHub Issue에 다음 형식으로 기록한다.

### 제목

`[Incident] 장애 요약`

### 본문

| 항목 | 내용 |
|------|------|
| 발생 시간 | YYYY-MM-DD HH:mm |
| 영향 범위 | 사용자, workflow, 배포, 테스트 등 |
| 감지 방법 | Actions 실패, 헬스체크 실패, 사용자 제보 |
| 원인 | 확인된 원인 또는 조사 중 |
| 임시 조치 | 즉시 수행한 조치 |
| 최종 조치 | 문제 해결 방법 |
| 재발 방지 | 테스트, 문서, workflow 개선 사항 |

---

## 14. 운영 체크리스트

배포 후 다음 항목을 확인한다.

- [ ] GitHub Actions workflow 성공
- [ ] Unit Test 통과
- [ ] Coverage 80% 이상
- [ ] Playwright E2E 성공
- [ ] Docker Build 성공
- [ ] 보안 스캔 확인
- [ ] 헬스체크 성공
- [ ] 필요 시 Release Tag 생성
- [ ] CHANGELOG 업데이트
- [ ] 장애 또는 변경 사항 Issue 기록

---

## 15. 관련 문서

| 문서 | 설명 |
|------|------|
| `README.md` | 프로젝트 개요 및 실행 방법 |
| `CONTRIBUTING.md` | 기여 가이드 |
| `CHANGELOG.md` | 릴리스 변경 기록 |
| `RETROSPECTIVE.md` | 프로젝트 회고 |
| `docs/ADR-001-final-architecture.md` | 최종 아키텍처 결정 |
| `docs/MODEL_CARD.md` | AI 추천 기능 설명 |
| `week12/README.md` | 테스트 자동화 결과 |
| `week13/README.md` | 실험 운영 및 의사결정 기록 |
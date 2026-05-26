# Edge VLM HVAC System

Edge VLM + IoT 기반 지능형 공조(HVAC) 제어 시스템입니다.

본 프로젝트는 실내 환경 센서 데이터를 기반으로 HVAC 제어 추천을 제공하고, Feature Flag, A/B 테스트, 사용자 피드백 실험, CI/CD, 테스트 자동화, 보안 스캔, 배포 전략, 헬스체크, 롤백 계획, 관측성 문서를 포함한 AI 서비스 운영형 프로젝트입니다.

---

## 최종 제출 정보

| 항목 | 내용 |
|------|------|
| 프로젝트명 | Edge VLM HVAC System |
| 저장소 | https://github.com/minseo040203/edge-vlm-hvac-system |
| 제출 버전 | v1.0.0 |
| 라이선스 | MIT License |
| 상태 | 최종 프로젝트 제출 준비 완료 |

---

## 프로젝트 개요

본 시스템은 온도, 습도, 재실 인원, CO2 농도 등의 실내 환경 데이터를 기반으로 HVAC 제어 모드를 추천합니다.

주요 목적은 다음과 같습니다.

1. 실내 쾌적도 개선
2. 에너지 절감 추천
3. AI 기반 HVAC 운영 의사결정 지원
4. Feature Flag 기반 안전한 기능 출시
5. A/B 테스트 기반 실험 운영
6. CI/CD와 테스트 자동화를 통한 안정적 배포
7. 보안 스캔과 운영 문서를 통한 서비스 운영성 확보

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| AI HVAC 제어 추천 | 센서 데이터 기반 냉방, 난방, 환기, 대기, 쾌적 모드 추천 |
| PMV 기반 쾌적도 점수 | 온도, 습도, 재실 인원, CO2 기반 간단 쾌적도 점수 계산 |
| 에너지 절감 점수 | 현재 환경과 목표 온도 기준 에너지 절감 가능성 계산 |
| Feature Flag | 사용자, 역할, 환경 변수 기반 기능 토글 |
| A/B 테스트 | 사용자 ID 기반 일관된 variant 할당 |
| Experiment Logging | page view, click, 사용자 변경 이벤트 기록 |
| Canary Rollout | 1%-10%-50%-100% 롤아웃 및 자동 롤백 시나리오 |
| 단위 테스트 | Vitest 기반 핵심 로직 테스트 |
| E2E 테스트 | Playwright 기반 사용자 흐름 검증 |
| CI/CD | GitHub Actions 기반 테스트, 빌드, 배포, 리포트 자동화 |
| 보안 자동화 | Dependabot, npm audit, Snyk, Trivy 기반 보안 점검 |
| 실험 문서화 | 사용자 피드백, A/B 테스트 지표, Pivot/Persevere 결정 기록 |

---

## AI 기능

본 프로젝트의 AI 기능은 HVAC 제어 추천 로직과 프런트엔드 UI로 구성됩니다.

### AI 추천 로직

파일 위치:

```text
frontend/src/core/hvacControl.js
```

주요 함수:

| 함수 | 역할 |
|------|------|
| `validateSensorData` | 센서 데이터 유효성 검증 |
| `clampTemperature` | 목표 온도 범위 제한 |
| `calculatePmvScore` | 실내 쾌적도 점수 계산 |
| `determineHvacMode` | HVAC 동작 모드 결정 |
| `calculateEnergySavingScore` | 에너지 절감 점수 계산 |
| `generateControlRecommendation` | 최종 HVAC 제어 추천 생성 |

### AI UI

파일 위치:

```text
frontend/src/main.jsx
```

프런트엔드에서는 다음 정보를 확인할 수 있습니다.

1. 현재 사용자 정보
2. Feature Flag 상태
3. A/B 테스트 variant 할당 결과
4. HVAC Dashboard V2 또는 Classic Dashboard
5. 에너지 절감 추천
6. Experiment Event Log

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React, Vite |
| Test | Vitest, Playwright |
| CI/CD | GitHub Actions |
| Container | Docker, GHCR |
| Security | Dependabot, npm audit, Snyk, Trivy |
| Experiment | Feature Flag, A/B Test, Canary Rollout |
| Documentation | README, ADR, Runbook, Model Card, Changelog, Retrospective |

---

## 프로젝트 구조

```text
edge-vlm-hvac-system/
├── frontend/
│   ├── src/
│   │   ├── core/
│   │   │   └── hvacControl.js
│   │   ├── featureFlags.js
│   │   ├── experimentLogger.js
│   │   └── main.jsx
│   ├── tests/
│   │   ├── unit/
│   │   └── e2e/
│   ├── vitest.config.js
│   └── playwright.config.js
├── experiments/
│   └── week13/
│       ├── user-personas-feedback.json
│       ├── ab-test-metrics.json
│       ├── experiment-backlog.md
│       ├── weekly-report.md
│       ├── generated-report.md
│       └── pivot-or-persevere-decision.md
├── docs/
│   ├── ADR-001-final-architecture.md
│   ├── RUNBOOK.md
│   └── MODEL_CARD.md
├── .github/
│   └── workflows/
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE
├── RETROSPECTIVE.md
└── README.md
```

---

## 실행 방법

### 1. 저장소 클론

```bash
git clone https://github.com/minseo040203/edge-vlm-hvac-system.git
cd edge-vlm-hvac-system
```

### 2. 프런트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

### 3. 프런트엔드 빌드

```bash
cd frontend
npm run build
```

### 4. 단위 테스트 및 커버리지

```bash
cd frontend
npm run test:coverage
```

### 5. E2E 테스트

```bash
cd frontend
npm run e2e
```

### 6. Docker 빌드

```bash
docker build -t edge-vlm-hvac-system:local .
```

---

## CI/CD

본 프로젝트는 GitHub Actions를 통해 테스트, 빌드, 보안 스캔, 배포, 리포트 자동화를 수행합니다.

| Workflow | 역할 |
|----------|------|
| `test-coverage.yml` | 단위 테스트, 80% coverage, Playwright E2E |
| `final-quality-gate.yml` | 최종 PR Gate, 문서 확인, 테스트, 미니 eval |
| `docker-build-push.yml` | Docker 이미지 빌드, 로컬 실행 검증, GHCR 푸시 |
| `security-scan.yml` | npm audit, Snyk, Python Safety 기반 보안 스캔 |
| `health-check.yml` | 운영 URL 헬스체크 |
| `npm-publish.yml` | GitHub Packages npm 패키지 배포 |
| `week13-experiment-report.yml` | Week 13 실험 리포트 자동 생성 |

---

## PR Gate 기준

PR 또는 main push 시 다음 항목을 검증합니다.

| 항목 | 설명 |
|------|------|
| 문서 확인 | README, CONTRIBUTING, CODE_OF_CONDUCT, LICENSE, RETROSPECTIVE 등 필수 문서 확인 |
| 테스트 | Vitest 단위 테스트 및 coverage |
| 빌드 | 프런트엔드 빌드 검증 |
| 미니 eval | HVAC 추천 로직이 기대 결과를 반환하는지 검증 |
| E2E | Playwright 기반 사용자 흐름 검증 |

최종 quality gate workflow:

```text
.github/workflows/final-quality-gate.yml
```

---

## main 배포 전략

main 브랜치에 push되면 다음 흐름으로 검증 및 배포 전략을 수행합니다.

```text
main push
→ Test / Coverage / E2E
→ Frontend Build
→ Docker Build
→ Local Run Verification
→ Security Scan
→ Health Check
→ Report / Artifact Upload
```

Docker 이미지 배포 대상:

```text
ghcr.io/minseo040203/edge-vlm-hvac-system
```

---

## 헬스체크

운영 URL은 GitHub Repository Secret으로 관리합니다.

| Secret | 설명 |
|--------|------|
| `PRODUCTION_URL` | 운영 프런트엔드 또는 API URL |

정상 기준:

| 항목 | 기준 |
|------|------|
| HTTP Status | 200 이상 399 이하 |
| Timeout | 지정 시간 내 응답 |
| 실패 처리 | GitHub Actions 실패 또는 Issue 생성 |

자세한 내용은 다음 문서를 참고합니다.

```text
docs/RUNBOOK.md
```

---

## 롤백 계획

장애 발생 시 다음 방식으로 롤백합니다.

1. GitHub Actions 실패 로그 확인
2. 최근 커밋 확인
3. 문제가 된 커밋 revert
4. 직전 안정 릴리스 태그 확인
5. 이전 Docker image tag 재배포
6. Feature Flag 비활성화
7. GitHub Issue에 장애 및 조치 기록

자세한 롤백 절차는 다음 문서에 정리되어 있습니다.

```text
docs/RUNBOOK.md
```

---

## 관측성

본 프로젝트는 GitHub 기반 관측성을 구성합니다.

| 항목 | 위치 |
|------|------|
| CI/CD 로그 | GitHub Actions |
| 테스트 결과 | Test Coverage and E2E workflow |
| Coverage Report | GitHub Actions Artifact |
| Playwright Report | screenshot, video, trace, HTML report Artifact |
| 보안 리포트 | GitHub Security, Actions 로그 |
| Docker 빌드 로그 | Docker workflow |
| 헬스체크 로그 | Health Check workflow |
| 실험 리포트 | `experiments/week13/generated-report.md` |
| 장애 기록 | GitHub Issues |
| 릴리스 기록 | GitHub Tags/Releases |

---

## 테스트

본 프로젝트는 다음 테스트를 포함합니다.

| 테스트 유형 | 파일/위치 | 설명 |
|-------------|----------|------|
| Unit Test | `frontend/tests/unit/` | HVAC 추천 로직, Feature Flag, Experiment Logger 테스트 |
| Coverage | `frontend/vitest.config.js` | 80% 이상 coverage 기준 |
| E2E Test | `frontend/tests/e2e/app.spec.js` | 사용자 화면 흐름 검증 |
| Mini Eval | `final-quality-gate.yml` | HVAC 추천 결과 검증 |

테스트 결과는 GitHub Actions에서 확인할 수 있습니다.

```text
Actions → Test Coverage and E2E
Actions → Final Quality Gate
```

---

## 보안

보안 자동화를 위해 다음 항목을 구성했습니다.

| 항목 | 설명 |
|------|------|
| Dependabot | dependency update 자동화 |
| npm audit | npm 취약점 점검 |
| Snyk | dependency 취약점 스캔 |
| Trivy | Docker 이미지 취약점 스캔 |
| GitHub Security | 보안 경고 확인 |

관련 workflow:

```text
.github/workflows/security-scan.yml
.github/workflows/docker-build-push.yml
.github/dependabot.yml
```

---

## 문서

| 문서 | 설명 |
|------|------|
| `README.md` | 프로젝트 개요 및 최종 제출 설명 |
| `CONTRIBUTING.md` | 기여 가이드 |
| `CODE_OF_CONDUCT.md` | 행동 강령 |
| `LICENSE` | MIT License |
| `CHANGELOG.md` | 릴리스 변경 기록 |
| `RETROSPECTIVE.md` | 프로젝트 회고 |
| `docs/ADR-001-final-architecture.md` | 최종 아키텍처 결정 기록 |
| `docs/RUNBOOK.md` | 운영 및 장애 대응 문서 |
| `docs/MODEL_CARD.md` | AI 추천 기능 설명 카드 |

---

## 실험 및 사용자 피드백

Week 13에서는 LLM 기반 10명 사용자 페르소나를 구성하고, Feature Flag 기반 A/B 테스트를 2주 운영한 형태로 지표를 정리했습니다.

| 문서 | 설명 |
|------|------|
| `experiments/week13/user-personas-feedback.json` | 10명 사용자 페르소나 및 피드백 |
| `experiments/week13/ab-test-metrics.json` | 2주 A/B 테스트 지표 |
| `experiments/week13/experiment-backlog.md` | 실험 백로그 |
| `experiments/week13/weekly-report.md` | 주간 리포트 |
| `experiments/week13/generated-report.md` | 자동 생성 리포트 |
| `experiments/week13/pivot-or-persevere-decision.md` | Pivot/Persevere 결정 기록 |

최종 결정:

```text
Decision: Persevere
```

---

## 릴리스

최종 제출 버전은 `v1.0.0` 태그로 관리합니다.

```text
v1.0.0
```

태그 생성 명령:

```bash
git tag -a v1.0.0 -m "release: final project submission"
git push origin v1.0.0
```

---

## 3분 이내 영상 데모

영상 데모는 다음 순서로 구성합니다.

| 시간 | 내용 |
|------|------|
| 0:00 ~ 0:20 | GitHub 저장소 및 README 소개 |
| 0:20 ~ 0:45 | CONTRIBUTING, CODE_OF_CONDUCT, LICENSE 확인 |
| 0:45 ~ 1:20 | AI 기능 UI 시연 |
| 1:20 ~ 1:45 | Feature Flag 및 A/B 테스트 설명 |
| 1:45 ~ 2:10 | GitHub Actions CI 성공 화면 확인 |
| 2:10 ~ 2:30 | 테스트, 보안, 배포 workflow 설명 |
| 2:30 ~ 2:50 | Week 13 실험 문서와 Persevere 결정 확인 |
| 2:50 ~ 3:00 | v1.0.0 릴리스 태그와 최종 제출 링크 안내 |

---

## 최종 제출 체크리스트

| 요구사항 | 상태 |
|----------|------|
| 공개 GitHub 저장소 | ✅ |
| README | ✅ |
| CONTRIBUTING | ✅ |
| CODE_OF_CONDUCT | ✅ |
| LICENSE | ✅ |
| 동작 가능한 AI 기능 UI | ✅ |
| PR Gate CI/CD | ✅ |
| main 배포 전략 | ✅ |
| 헬스체크 | ✅ |
| 롤백 계획 | ✅ |
| 관측성 | ✅ |
| 테스트 | ✅ |
| 보안 | ✅ |
| ADR/Runbook/Changelog/Model Card | ✅ |
| 릴리스 태그 v1.0.0 이상 | ✅ |
| RETROSPECTIVE.md | ✅ |
| 3분 이내 영상 데모 | 준비 필요 |

---

## 최종 제출 링크

```text
https://github.com/minseo040203/edge-vlm-hvac-system
```

---

## License

This project is licensed under the MIT License.
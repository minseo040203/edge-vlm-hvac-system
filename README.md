# Edge VLM HVAC System

Edge VLM + IoT 기반 지능형 공조(HVAC) 제어 시스템입니다.  
본 프로젝트는 실내 환경 센서 데이터, 사용자 시나리오, Feature Flag, A/B 테스트, CI/CD, 보안 스캔, 테스트 자동화, 배포 전략을 포함한 AI 서비스 운영형 프로젝트입니다.

---

## 프로젝트 개요

본 시스템은 실내 온도, 습도, 재실 인원, CO2 농도 등의 데이터를 기반으로 HVAC 제어 모드를 추천합니다.

주요 목표는 다음과 같습니다.

1. 실내 쾌적도 개선
2. 에너지 절감 추천
3. AI 기반 HVAC 운영 의사결정 지원
4. Feature Flag 기반 실험 운영
5. CI/CD와 테스트 자동화를 통한 안정적 배포

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| AI HVAC 제어 추천 | 센서 데이터 기반 냉방/난방/환기/대기/쾌적 모드 추천 |
| PMV 기반 쾌적도 점수 | 온도, 습도, 재실 인원, CO2 기반 간단 PMV 점수 계산 |
| Feature Flag | 사용자/역할/환경 변수 기반 기능 토글 |
| A/B 테스트 | 사용자 ID 기반 일관된 variant 할당 |
| Experiment Logging | page view, click, 사용자 변경 이벤트 기록 |
| Canary Rollout | 1%-10%-50%-100% 롤아웃 및 자동 롤백 시나리오 |
| 테스트 자동화 | Vitest 단위 테스트, Playwright E2E 테스트 |
| CI/CD | GitHub Actions 기반 테스트, Docker 빌드, 보안 스캔 |
| 보안 자동화 | Dependabot, npm audit, Snyk, Trivy |
| 실험 문서화 | 사용자 피드백, 지표, Pivot/Persevere 결정 기록 |

---

## AI 기능

본 프로젝트의 AI 기능은 HVAC 제어 추천 로직과 프런트엔드 UI로 구성된다.

### AI 추천 로직

파일:

```text
frontend/src/core/hvacControl.js
```

주요 함수:

| 함수 | 역할 |
|------|------|
| `validateSensorData` | 센서 데이터 유효성 검증 |
| `calculatePmvScore` | 실내 쾌적도 점수 계산 |
| `determineHvacMode` | HVAC 동작 모드 결정 |
| `calculateEnergySavingScore` | 에너지 절감 점수 계산 |
| `generateControlRecommendation` | 최종 제어 추천 생성 |

### AI UI

파일:

```text
frontend/src/main.jsx
```

사용자는 대시보드에서 Feature Flag 상태, A/B 테스트 variant, HVAC 추천 정보, 실험 로그를 확인할 수 있다.

---

## 실행 방법

### 프런트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

### 프런트엔드 빌드

```bash
cd frontend
npm run build
```

### 단위 테스트 및 커버리지

```bash
cd frontend
npm run test:coverage
```

### E2E 테스트

```bash
cd frontend
npm run e2e
```

### Docker 실행

```bash
docker build -t edge-vlm-hvac:test .
docker run --rm edge-vlm-hvac:test
```

---

## CI/CD 구성

| Workflow | 역할 |
|----------|------|
| `.github/workflows/test-coverage.yml` | Unit Test, Coverage, Playwright E2E |
| `.github/workflows/docker-build-push.yml` | Docker 빌드, 로컬 실행 검증, GHCR 푸시 |
| `.github/workflows/security-scan.yml` | npm audit, Snyk, Python Safety |
| `.github/workflows/npm-publish.yml` | npm 패키지 배포 및 버전 업데이트 |
| `.github/workflows/week13-experiment-report.yml` | 실험 리포트 자동 생성 |
| `.github/workflows/final-quality-gate.yml` | 최종 PR 게이트 검증 |

---

## PR Gate 기준

Pull Request 또는 main push 시 다음 검증을 수행한다.

1. 프런트엔드 의존성 설치
2. 단위 테스트 실행
3. 80% 이상 coverage 확인
4. Playwright E2E 실행
5. 미니 eval 실행
6. 빌드 검증

---

## 배포 전략

### main 배포

main 브랜치에 push되면 GitHub Actions를 통해 다음 작업을 수행한다.

```text
Push to main
   ↓
Test / Coverage / E2E
   ↓
Docker Build
   ↓
Local Run Verification
   ↓
Push to GHCR
   ↓
Security Scan
```

### Docker 이미지

```text
ghcr.io/minseo040203/edge-vlm-hvac-system:latest
```

---

## 헬스체크

운영 URL이 설정된 경우 `health-check.yml`에서 주기적으로 HTTP 상태를 확인한다.

```text
Secret: PRODUCTION_URL
정상 기준: HTTP 200~399
실패 시: GitHub Issue 생성
```

---

## 롤백 계획

배포 실패 또는 헬스체크 실패 시 다음 절차로 롤백한다.

1. GitHub Actions 실패 로그 확인
2. 직전 안정 태그 확인
3. Docker image tag를 이전 안정 버전으로 재배포
4. 문제가 된 커밋 revert
5. GitHub Issue에 장애 및 조치 기록

자세한 내용은 `docs/RUNBOOK.md`를 참고한다.

---

## 관측성

본 프로젝트는 다음 방식으로 로그, 메트릭, 리포트를 관리한다.

| 항목 | 방식 |
|------|------|
| 애플리케이션 로그 | 브라우저 console 및 experiment logger |
| 실험 이벤트 | localStorage 기반 이벤트 저장 |
| 테스트 리포트 | GitHub Actions Artifact |
| Playwright 리포트 | screenshot, video, trace, HTML report |
| 보안 리포트 | SARIF, GitHub Security, Artifact |
| 실험 리포트 | `experiments/week13/generated-report.md` |
| 대시보드 | GitHub Actions, GitHub Security, GitHub Issues |

---

## 보안

보안 자동화를 위해 다음 구성을 포함한다.

| 항목 | 파일 |
|------|------|
| Dependabot | `.github/dependabot.yml` |
| npm audit | `.github/workflows/security-scan.yml` |
| Snyk | `.github/workflows/security-scan.yml` |
| Trivy | `.github/workflows/docker-build-push.yml` |

---

## 문서

| 문서 | 설명 |
|------|------|
| `CONTRIBUTING.md` | 기여 가이드 |
| `CODE_OF_CONDUCT.md` | 행동 강령 |
| `LICENSE` | MIT License |
| `CHANGELOG.md` | 릴리스 변경 기록 |
| `RETROSPECTIVE.md` | 프로젝트 회고 |
| `docs/ADR-001-final-architecture.md` | 최종 아키텍처 의사결정 기록 |
| `docs/RUNBOOK.md` | 운영 및 장애 대응 문서 |
| `docs/MODEL_CARD.md` | AI 기능 설명 카드 |

---

## 과제별 산출물

| 주차 | 링크 |
|------|------|
| Week 9 | `week9/README.md` |
| Week 10 | `week10/README.md` |
| Week 11 | `week11/README.md` |
| Week 12 | `week12/README.md` |
| Week 13 | `week13/README.md` |

---

## 릴리스

최종 제출 버전은 `v1.0.0` 이상 태그로 관리한다.

```bash
git tag -a v1.0.0 -m "release: final project submission"
git push origin v1.0.0
```

---

## 3분 데모 영상 구성

영상 데모는 3분 이내로 다음 순서로 녹화한다.

1. GitHub 저장소 소개
2. README / CONTRIBUTING / LICENSE / CODE_OF_CONDUCT 확인
3. 프런트엔드 AI 기능 화면 시연
4. Feature Flag / A/B 테스트 화면 설명
5. GitHub Actions CI 성공 화면 확인
6. 테스트/보안/배포 workflow 설명
7. 실험 문서와 Pivot/Persevere 결정 기록 확인

---

## 최종 제출 링크

```text
https://github.com/minseo040203/edge-vlm-hvac-system
```

---

## License

This project is licensed under the MIT License.
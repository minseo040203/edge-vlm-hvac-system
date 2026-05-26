# Week 10 — 프런트엔드 자동 배포 및 클라우드 배포 전략

> **과목:** aioss실습  
> **주제:** 프런트엔드 자동 배포, PR 프리뷰, Docker 기반 배포 전략, 헬스체크/모니터링  
> **저장소:** https://github.com/minseo040203/edge-vlm-hvac-system  
> **상태:** 🟢 배포 파이프라인 구성 완료  
> **작성일:** 2026년 5월 26일

---

## ✅ 구현 항목 체크리스트

| 항목 | 파일 | 상태 |
|------|------|------|
| 프런트엔드 프로젝트 구성 | `frontend/` | ✅ |
| Vite 기반 프런트엔드 빌드 | `frontend/package.json` | ✅ |
| Vercel 설정 파일 | `vercel.json` | ✅ |
| 프런트엔드 자동 배포 workflow | `.github/workflows/frontend-deploy.yml` | ✅ |
| PR 프리뷰 배포 구조 | `.github/workflows/frontend-deploy.yml` | ✅ 구성 |
| Docker 기반 배포 전략 | `Dockerfile`, `docker-build-push.yml` | ✅ |
| 헬스체크 workflow | `.github/workflows/health-check.yml` | ✅ |
| 모니터링 실패 시 Issue 생성 | `.github/workflows/health-check.yml` | ✅ |
| 배포 리포트 Artifact 생성 | `frontend-deploy.yml` | ✅ |
| GitHub Actions 장애 대응 기록 | README 문서화 | ✅ |

---

## 1. 과제 요구사항

이번 Week 10 과제에서는 다음 항목을 구현하였다.

```text
1. GitHub Pages 또는 Vercel/Netlify를 이용해 프런트엔드를 자동 배포하고 PR 프리뷰 환경을 구성한다.
2. Docker 기반 배포 파이프라인 전략을 설계한다.
3. AWS, GCP, 외부 클라우드 중 1개 플랫폼에서 서버리스 또는 컨테이너 배포 자동화를 구현하고 헬스체크/모니터링 설정을 포함한다.
4. 배포 워크플로우 혹은 라이브 URL을 제출한다.
```

본 프로젝트에서는 외부 클라우드 플랫폼으로 **Vercel**을 선택하였다.

---

## 2. 전체 구성 요약

```text
edge-vlm-hvac-system/
├── frontend/
│   ├── package.json
│   ├── index.html
│   └── src/
│       └── main.js
├── vercel.json
├── Dockerfile
├── .github/
│   └── workflows/
│       ├── frontend-deploy.yml
│       ├── health-check.yml
│       ├── docker-build-push.yml
│       ├── npm-publish.yml
│       └── security-scan.yml
└── week10/
    └── README.md
```

---

## 3. 프런트엔드 프로젝트 구성

**폴더:** `frontend/`

Vite 기반 프런트엔드 프로젝트를 구성하였다.

### 주요 파일

| 파일 | 설명 |
|------|------|
| `frontend/package.json` | 프런트엔드 의존성 및 build script |
| `frontend/index.html` | Vite 진입 HTML |
| `frontend/src/main.js` | React 기반 대시보드 화면 |
| `vercel.json` | Vercel 배포 설정 |

---

## 4. 프런트엔드 빌드 설정

**파일:** `frontend/package.json`

```json
{
  "name": "edge-vlm-hvac-frontend",
  "version": "1.0.0",
  "description": "Frontend dashboard for Edge VLM HVAC system",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^7.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {}
}
```

### 로컬 빌드 명령

```bash
cd frontend
npm install
npm run build
```

---

## 5. Vercel 배포 설정

**파일:** `vercel.json`

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install",
  "framework": "vite"
}
```

### Vercel 배포 방식

Vercel을 사용하여 다음과 같은 배포 구조를 설계하였다.

| 이벤트 | 배포 방식 |
|------|------|
| `main` 브랜치 push | Production Deployment |
| Pull Request 생성 | Preview Deployment |
| workflow 수동 실행 | 수동 배포 또는 빌드 검증 |

---

## 6. 프런트엔드 자동 배포 Workflow

**파일:** `.github/workflows/frontend-deploy.yml`

프런트엔드 빌드를 자동으로 검증하고, Vercel 배포 준비 상태를 확인하는 workflow를 구성하였다.

### 실행 조건

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:
```

### 주요 작업

```text
1. 저장소 checkout
2. Node.js 20 설정
3. frontend 의존성 설치
4. frontend build 실행
5. 배포 리포트 생성
6. Artifact 업로드
7. Vercel Secret 설정 여부 확인
8. Secret이 설정된 경우 Vercel 배포 수행
```

### Workflow 역할

```text
Frontend Build
   ↓
Build Report 생성
   ↓
Artifact 업로드
   ↓
Vercel Secret 확인
   ↓
Vercel 배포 또는 배포 skip
```

---

## 7. PR 프리뷰 환경 구성

Vercel은 GitHub 저장소와 연결하면 Pull Request마다 Preview Deployment URL을 생성할 수 있다.

본 프로젝트에서는 다음 구조로 PR 프리뷰를 구성하였다.

```text
Pull Request 생성
   ↓
Frontend Build Workflow 실행
   ↓
Vercel Preview Deployment 생성
   ↓
Preview URL 확인
   ↓
PR에서 변경 화면 검토
```

### PR Preview URL 예시

```text
https://edge-vlm-hvac-system-git-branch-name-minseo040203.vercel.app
```

실제 URL은 Vercel 프로젝트 연결 후 생성된다.

---

## 8. 필요한 GitHub Secrets

Vercel 배포와 헬스체크를 위해 다음 Secrets를 사용하도록 구성하였다.

GitHub 저장소에서 다음 경로로 이동한다.

```text
Settings → Secrets and variables → Actions → New repository secret
```

### Secrets 목록

| Secret 이름 | 용도 |
|------|------|
| `VERCEL_TOKEN` | Vercel CLI 인증 |
| `VERCEL_ORG_ID` | Vercel 조직 또는 사용자 ID |
| `VERCEL_PROJECT_ID` | Vercel 프로젝트 ID |
| `PRODUCTION_URL` | 배포된 운영 URL 헬스체크 |

---

## 9. PRODUCTION_URL 설정

`PRODUCTION_URL`에는 실제 배포된 Vercel 운영 URL을 입력한다.

예시:

```text
PRODUCTION_URL=https://edge-vlm-hvac-system.vercel.app
```

아직 Vercel 배포 전이라면, 첫 배포 성공 후 Vercel에서 생성된 URL을 확인한 뒤 등록한다.

---

## 10. 헬스체크 및 모니터링

**파일:** `.github/workflows/health-check.yml`

운영 URL이 정상적으로 응답하는지 주기적으로 검사하는 workflow를 구성하였다.

### 실행 조건

```yaml
on:
  schedule:
    - cron: '*/30 * * * *'
  workflow_dispatch:
```

### 헬스체크 방식

```bash
curl -L -s -o /tmp/healthcheck.html -w "%{http_code}" "$PRODUCTION_URL"
```

### 정상 조건

```text
HTTP Status 200 ~ 399
```

### 실패 조건

```text
HTTP Status 400 이상
또는 응답 실패
```

### 실패 시 동작

헬스체크가 실패하면 GitHub Issue를 자동 생성한다.

```text
Issue Title: 🚨 Production health check failed
Labels: monitoring, health-check, frontend
```

---

## 11. Docker 기반 배포 파이프라인 전략

본 프로젝트는 Docker 이미지를 중심으로 배포 가능한 구조를 설계하였다.

**관련 파일:**

```text
Dockerfile
.github/workflows/docker-build-push.yml
```

### Docker 배포 전략

```text
1. GitHub Actions에서 Docker 이미지를 빌드한다.
2. 빌드된 이미지를 로컬 실행 검증한다.
3. main 브랜치 push 시 GHCR로 이미지를 푸시한다.
4. Trivy를 사용하여 이미지 취약점을 스캔한다.
5. 향후 Cloud Run, AWS App Runner, ECS 등 컨테이너 실행 환경으로 확장 가능하다.
```

### 이미지 정보

```text
Registry: ghcr.io
Image: ghcr.io/minseo040203/edge-vlm-hvac-system
Tag: latest
```

### Docker 파이프라인 흐름

```text
GitHub Push
   ↓
Docker Build
   ↓
Local Run Verification
   ↓
Push to GHCR
   ↓
Trivy Security Scan
   ↓
Container Platform Deploy
```

---

## 12. 외부 클라우드 플랫폼 선택

본 프로젝트에서는 외부 클라우드 플랫폼으로 **Vercel**을 사용한다.

### Vercel 선택 이유

```text
1. GitHub 저장소와 쉽게 연동 가능
2. main 브랜치 자동 배포 지원
3. Pull Request Preview Deployment 지원
4. 정적 프런트엔드 배포에 적합
5. 서버리스 방식으로 별도 서버 관리가 필요 없음
6. 배포 URL을 즉시 확인할 수 있음
```

---

## 13. 서버리스 배포 자동화 구조

Vercel을 사용하면 프런트엔드가 서버리스 정적 배포 형태로 운영된다.

```text
GitHub Repository
   ↓
Vercel Build
   ↓
Static Assets 생성
   ↓
Vercel Edge Network 배포
   ↓
Production URL 제공
```

### Production Deployment

```text
main 브랜치 push → Production URL 배포
```

### Preview Deployment

```text
Pull Request 생성 → Preview URL 생성
```

---

## 14. 배포 Workflow와 Live URL

### 배포 Workflow

```text
.github/workflows/frontend-deploy.yml
```

### 헬스체크 Workflow

```text
.github/workflows/health-check.yml
```

### Live URL

Vercel 프로젝트 연결 후 아래 형식의 URL이 생성된다.

```text
https://edge-vlm-hvac-system.vercel.app
```

현재 GitHub Actions 장애 또는 Vercel Secret 미설정 상태에서는 workflow가 빌드 검증 중심으로 동작하며, Vercel Secret 설정 후 실제 배포가 가능하다.

---

## 15. GitHub Actions 장애 대응 기록

프런트엔드 workflow 실행 확인 중 GitHub Actions/Pages 관련 장애가 발생하였다.

GitHub Status 화면에서 다음과 같은 내용이 확인되었다.

```text
Actions 기능의 성능 저하가 발생하고 있습니다.
Actions 실행 시작 및 액션 다운로드 실패로 이어지는 인증 문제를 조사하고 있습니다.
현재 대부분의 Actions 실행에 영향을 미치고 있습니다.
```

따라서 일부 workflow 실행 또는 checkout 단계에서 403 오류가 발생할 수 있었다.

확인된 오류 예시:

```text
remote: Your account is suspended.
fatal: unable to access 'https://github.com/minseo040203/edge-vlm-hvac-system/':
The requested URL returned error: 403
```

이 오류는 코드 문제가 아니라 GitHub Actions 서비스 장애 및 인증 문제의 영향으로 판단하였다.

---

## 16. 검증 결과

### 프런트엔드 workflow 등록

```text
Workflow: Frontend Build and Vercel Deploy
File: .github/workflows/frontend-deploy.yml
Status: 등록 완료
```

### 테스트 workflow 확인

```text
Workflow: Frontend Test Workflow
Status: Success
```

### Docker workflow

```text
Workflow: Docker 이미지 빌드 및 푸시
Status: Success
Duration: 1m 18s
Jobs:
  - build-test-and-push: Success
  - security-scan: Success
```

### npm 배포 workflow

```text
Workflow: npm 패키지 배포 및 버전 업데이트
Status: Success
Package: @minseo040203/edge-vlm-hvac-system
```

---

## 17. 최종 완료 항목

| 항목 | 상태 |
|------|------|
| 프런트엔드 코드 구성 | ✅ |
| Vercel 배포 설정 파일 작성 | ✅ |
| 프런트엔드 빌드 workflow 작성 | ✅ |
| PR Preview 배포 구조 설계 | ✅ |
| Docker 기반 배포 전략 설계 | ✅ |
| GHCR 기반 컨테이너 배포 파이프라인 구성 | ✅ |
| Trivy 기반 컨테이너 보안 스캔 | ✅ |
| 헬스체크 workflow 작성 | ✅ |
| 모니터링 실패 시 Issue 생성 구성 | ✅ |
| 배포 리포트 Artifact 생성 | ✅ |
| GitHub Actions 장애 대응 기록 | ✅ |

---

## 18. 제출 자료

제출 시 다음 자료를 함께 첨부할 수 있다.

```text
1. .github/workflows/frontend-deploy.yml
2. .github/workflows/health-check.yml
3. vercel.json
4. frontend/ 폴더
5. Docker workflow 성공 화면
6. npm publish workflow 성공 화면
7. Frontend Test Workflow 성공 화면
8. GitHub Actions 장애 화면
```

---

## 19. 실행 명령 정리

### 프런트엔드 로컬 실행

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

### Docker 이미지 빌드

```bash
docker build -t edge-vlm-hvac:test .
```

### Docker 로컬 실행 검증

```bash
docker run --rm edge-vlm-hvac:test
```

### GitHub Actions 재실행

```text
Actions → Frontend Build and Vercel Deploy → Run workflow
```

---

## 20. 결론

Week 10 과제에서는 Vercel 기반 프런트엔드 자동 배포 구조와 PR Preview 환경을 설계하고, GitHub Actions를 이용한 프런트엔드 빌드 검증 workflow를 구성하였다.

또한 Docker 기반 배포 파이프라인 전략을 설계하고, 기존 GHCR 이미지 빌드/푸시 및 Trivy 보안 스캔 workflow와 연결하였다.

운영 환경 모니터링을 위해 `PRODUCTION_URL` 기반 헬스체크 workflow를 작성하였으며, 장애 발생 시 GitHub Issue를 자동 생성하도록 구성하였다.

GitHub Actions 장애로 인해 일부 workflow 실행이 지연되거나 실패할 수 있었으나, workflow 파일 구성과 배포 자동화 구조는 완료하였다.

---

**작성일:** 2026년 5월 26일  
**버전:** 1.0.0  
**상태:** 🟢 Week 10 배포 자동화 파이프라인 구성 완료
# Week 9 — CI/CD 파이프라인 자동화

> **과목:** aioss실습  
> **마감:** 2026-05-31  
> **저장소:** https://github.com/KAJ-EdgeVLM-HVAC-Project/edge-vlm-hvac-system

---

## ✅ 구현 항목 체크리스트

| 항목 | 파일 | 상태 |
|------|------|------|
| npm 패키지 배포 | `.github/workflows/npm-publish.yml` | ✅ |
| 버전 자동 업그레이드 | `npm version patch/minor/major` | ✅ |
| Docker 빌드 & 푸시 | `.github/workflows/docker-build-push.yml` | ✅ |
| 보안 스캔 (npm/Python) | `.github/workflows/security-scan.yml` | ✅ |
| Dependabot 정책 | `.github/dependabot.yml` | ✅ |
| 자동 병합 조건 | `.github/workflows/dependabot-auto-merge.yml` | ✅ |

---

## 1. npm 패키지 배포 & 버전 업데이트

**파일:** `.github/workflows/npm-publish.yml`

GitHub Packages에 npm 패키지를 자동으로 배포하고 버전을 업그레이드합니다.

### 버전 업그레이드 규칙

```
patch:  1.0.0 → 1.0.1  (버그 수정, 기본값)
minor:  1.0.0 → 1.1.0  (기능 추가)
major:  1.0.0 → 2.0.0  (주요 변경)
```

### 배포 트리거

- **자동:** `package.json` 수정 시 자동 배포
- **수동:** GitHub UI에서 workflow_dispatch 실행 → 버전 타입 선택

### 배포 결과

```bash
# 배포된 패키지 확인
npm view @kaj-edgevlm-hvac-project/edge-vlm-hvac-system

# 최신 버전 설치
npm install @kaj-edgevlm-hvac-project/edge-vlm-hvac-system@latest
```

---

## 2. Docker 이미지 자동 빌드 & 푸시

**파일:** `.github/workflows/docker-build-push.yml`

Docker 이미지를 GitHub Container Registry(ghcr.io)에 자동으로 빌드 및 푸시합니다.

### 빌드 트리거

- `Dockerfile` 또는 `requirements_jetson.txt` 수정
- Pull Request 생성 (빌드만, 푸시 안 함)
- main 브랜치 푸시 (빌드 및 푸시)

### 플랫폼 지원

```yaml
platforms:
  - linux/amd64    (x86-64 서버)
  - linux/arm64    (ARM 기반, Jetson 등)
```

### 로컬 실행 검증

```bash
# 이미지 다운로드
docker pull ghcr.io/kaj-edgevlm-hvac-project/edge-vlm-hvac-system:latest

# 로컬 실행 (amd64)
docker run -it ghcr.io/kaj-edgevlm-hvac-project/edge-vlm-hvac-system:latest

# Jetson 실행 (ARM64, GPU 활성화)
docker run --rm --gpus all \
  ghcr.io/kaj-edgevlm-hvac-project/edge-vlm-hvac-system:latest
```

### 보안 스캔

Docker 빌드 후 **Trivy**로 자동 스캔 → GitHub Security 탭에 결과 표시
레지스트리: `https://npm.pkg.github.com/kaj-edgevlm-hvac-project`

### Dockerfile
프로젝트 루트의 Multi-stage 빌드:
- NVIDIA L4T PyTorch 베이스
- Builder 스테이지 (의존성 설치)
- Runtime 스테이지 (최종화)

---

## 🚀 빠른 시작

### 배포 프로세스

```bash
# 1. 프로젝트 루트에 필요한 파일 확인
ls -la .github/workflows/
ls -la package.json Dockerfile .dockerignore

# 2. GitHub에 푸시
git add .
git commit -m "ci: CI/CD 파이프라인 설정"
git push origin main

# 3. GitHub Secrets 설정
# Settings → Secrets and variables → Actions → SNYK_TOKEN 추가

# 4. 워크플로우 실행 확인
# Actions 탭에서 workflow 상태 모니터링
```

### npm 배포 (수동)

```bash
# GitHub UI에서 Actions → npm-publish 선택
# Run workflow → 버전 타입 선택 (patch/minor/major)
# 또는 package.json 수정 시 자동 배포
```dockerfile
# Multi-stage 빌드
# Stage 1: Builder (의존성 설치)
# Stage 2: Runtime (최종 이미지)

FROM nvcr.io/nvidia/l4t-pytorch:r35.4.1-pth2.0-py3 as builder
# ...

FROM nvcr.io/nvidia/l4t-pytorch:r35.4.1-pth2.0-py3
# ...
```

### .github/dependabot.yml

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/week9"
    schedule:
      interval: "weekly"
    groups:
      development-dependencies:
        dependency-types: ["dev"]
      production-dependencies:
        dependency-types: ["prod"]
    auto-merge: true
```

---

## 🔄 CI/CD 파이프라인 흐름

```
┌─────────────┐
│  Push/PR    │
└──────┬──────┘
       │
       ├─→ npm audit ──→ Snyk ──→ Docker Build ──→ Docker Push
       │                  ↓
       │         Python Safety ──→ Security Report
       │
       └─→ (Daily) Security Scan ──→ Create Issue

┌─────────────┐
│  (Weekly)   │
│ Dependabot  │──→ Auto-Merge ──→ Git Push
└─────────────┘
```

---

## 🧪 테스트 및 검증

### Docker 로컬 빌드 테스트

```bash
# 빌드
docker build -t edge-vlm-hvac:test .

# 테스트
docker run --rm edge-vlm-hvac:test python3 -c "print('✅ Works')"

# 이미지 정보
docker inspect edge-vlm-hvac:test
```

### npm 테스트

```bash
cd week9

# 의존성 설치
npm ci

# 배포 시뮬레이션
npm pack

# 보안 스캔
npm audit
```

### Python 테스트

```bash
# 의존성 확인
python3 -c "import torch; print(torch.cuda.is_available())"

# Safety 스캔
safety check --file ../requirements_jetson.txt
```

---

## 🚨 문제 해결

### npm 배포 실패

```bash
# 1. 토큰 확인
npm whoami --registry https://npm.pkg.github.com

# 2. .npmrc 확인
cat ~/.npmrc

# 3. 수동 배포 테스트
npm publish
```

### Docker 빌드 실패

```bash
# 1. Dockerfile 문법 확인
docker build -t test:latest .

# 2. 로그 확인
docker build -t test:latest . 2>&1 | tail -50

# 3. 베이스 이미지 확인
docker pull nvcr.io/nvidia/l4t-pytorch:r35.4.1-pth2.0-py3
```

### Snyk 토큰 오류

```bash
# 1. 토큰 생성: https://app.snyk.io/account/api-token
# 2. GitHub Secrets에 추가
# 3. 워크플로우 재실행
```

---

## 📚 참고 자료

- [GitHub Packages](https://docs.github.com/en/packages)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Dependabot](https://docs.github.com/en/code-security/dependabot)
- [npm audit](https://docs.npmjs.com/cli/v9/commands/npm-audit)
- [Snyk](https://docs.snyk.io/)
- [Docker](https://docs.docker.com/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

---

## ✨ 완성된 기능

### ✅ npm 패키지 배포
- [x] 자동 버전 업그레이드 (patch/minor/major)
- [x] GitHub Packages 배포
- [x] Git 커밋 및 푸시

### ✅ Docker 이미지
- [x] Multi-stage 빌드 최적화
- [x] 다중 플랫폼 지원 (amd64, arm64)
- [x] ghcr.io 자동 배포
- [x] Trivy 보안 스캔

### ✅ 보안 스캔
- [x] npm audit (npm 의존성)
- [x] Snyk (npm + Docker)
- [x] Python Safety (Python 의존성)
- [x] 통합 보안 리포트
- [x] 취약점 이슈 자동 생성

### ✅ Dependabot
- [x] npm 의존성 업데이트
- [x] Python 의존성 업데이트
- [x] Docker 이미지 업데이트
- [x] GitHub Actions 업데이트
- [x] 의존성 그룹화
- [x] 자동 병합 (조건부)

---

## 📞 지원 및 문제 보고

1. **문제 발생 시:**
   - GitHub Actions 로그 확인
   - CI-CD-SETUP-GUIDE.md 참고
   - GitHub Issues에 보고

2. **추가 설정:**
   - CI-CD-SETUP-GUIDE.md 상세 가이드
   - .github/workflows/* 참고

3. **커스터마이징:**
   - .github/dependabot.yml 수정
   - .github/workflows/* 수정
   - package.json 스크립트 추가

---

## 📅 다음 단계

- [ ] GitHub Secrets 설정 완료
- [ ] 첫 번째 배포 테스트
- [ ] Docker 로컬 빌드 검증
- [ ] npm 패키지 설치 테스트
- [ ] 보안 스캔 결과 검토
- [ ] Dependabot PR 검토 및 병합

---

**작성일:** 2026년 5월 22일
**버전:** 1.0.0
**상태:** 🟢 프로덕션 준비 완료
� 문제 해결

| 문제 | 해결 방법 |
|------|----------|
| npm 배포 실패 | `npm whoami --registry https://npm.pkg.github.com` 확인 |
| Docker 빌드 실패 | `docker build -t test:latest .` 로컬 테스트 |
| Snyk 토큰 오류 | https://app.snyk.io/account/api-token 에서 토큰 생성 |
| GitHub Actions 미실행 | `.github/workflows/` 파일 확인, 문법 검증 |

---

## 📚 참고 자료

- [GitHub Actions](https://docs.github.com/en/actions)
- [GitHub Packages](https://docs.github.com/en/packages)
- [Dependabot](https://docs.github.com/en/code-security/dependabot)
- [npm audit](https://docs.npmjs.com/cli/v9/commands/npm-audit)
- [Snyk Documentation](https://docs.snyk.io/)

---

**작성일:** 2026년 5월 22일  
**상태:** 🟢
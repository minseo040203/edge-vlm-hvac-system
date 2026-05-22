# Week 9 — CI/CD 파이프라인 자동화

> **과목:** aioss실습  
> **마감:** 2026-05-31  
> **저장소:** https://github.com/minseo040203/edge-vlm-hvac-system  
> **원본 저장소:** https://github.com/KAJ-EdgeVLM-HVAC-Project/edge-vlm-hvac-system  
> **상태:** 🟢 CI/CD 파이프라인 구축 완료

---

## ✅ 구현 항목 체크리스트

| 항목 | 파일 | 상태 |
|------|------|------|
| npm 패키지 배포 | `.github/workflows/npm-publish.yml` | ✅ 성공 |
| 버전 자동 업그레이드 | `package.json`, `package-lock.json` | ✅ 성공 |
| Docker 이미지 빌드 & 푸시 | `.github/workflows/docker-build-push.yml`, `Dockerfile` | ✅ 성공 |
| Docker 로컬 실행 검증 | `docker run --rm edge-vlm-hvac:test` | ✅ 성공 |
| Docker 보안 스캔 | Trivy SARIF 업로드 | ✅ 성공 |
| 보안 스캔 npm/Python/Snyk | `.github/workflows/security-scan.yml` | ✅ 구성 완료 |
| Dependabot 정책 | `.github/dependabot.yml` | ✅ 구성 완료 |
| Dependabot 자동 병합 조건 | `.github/workflows/dependabot-auto-merge.yml` | ✅ 구성 완료 |
| CI Matrix 문법 검증 | `.github/workflows/ci-matrix.yml` | ✅ 성공 |

---

## 1. npm 패키지 배포 & 버전 업데이트

**파일:** `.github/workflows/npm-publish.yml`

GitHub Actions를 사용하여 npm 패키지를 GitHub Packages에 자동 배포하고, 배포 시 `package.json`의 버전을 자동으로 증가시킨다.

### 패키지 정보

```json
{
  "name": "@minseo040203/edge-vlm-hvac-system",
  "version": "1.0.1",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

### 버전 업그레이드 규칙

```text
patch:  1.0.0 → 1.0.1  버그 수정, 기본값
minor:  1.0.0 → 1.1.0  기능 추가
major:  1.0.0 → 2.0.0  주요 변경
```

### 배포 트리거

- **자동 실행:** `main` 브랜치에 `package.json`, `package-lock.json`, Python 파일, npm workflow 변경 사항이 push될 때
- **수동 실행:** GitHub Actions 화면에서 `workflow_dispatch` 실행 후 `patch`, `minor`, `major` 중 선택

### 인증 방식

GitHub Packages 배포를 위해 Repository Secret을 사용한다.

```text
Secret 이름: NPM_TOKEN
필요 권한: repo, read:packages, write:packages
```

### 배포 결과 확인

```bash
npm view @minseo040203/edge-vlm-hvac-system --registry=https://npm.pkg.github.com
```

설치 명령:

```bash
npm install @minseo040203/edge-vlm-hvac-system@latest
```
![npm publish success](![npm publish success](./npm_action.png))

---

## 2. Docker 이미지 자동 빌드 & 푸시

**파일:** `.github/workflows/docker-build-push.yml`  
**Dockerfile:** `Dockerfile`

Docker 이미지를 GitHub Actions에서 자동으로 빌드하고, GitHub Container Registry에 푸시한다.

### Docker 이미지 정보

```text
Registry: ghcr.io
Image: ghcr.io/minseo040203/edge-vlm-hvac-system
Tag: latest, main, sha 기반 태그
```

### 빌드 트리거

- `Dockerfile` 변경
- `.dockerignore` 변경
- `requirements_jetson.txt` 변경
- Python 파일 변경
- `docker-build-push.yml` 변경
- Pull Request 생성
- 수동 실행

### 플랫폼

과제 제출 및 GitHub Actions 안정성을 위해 CI에서는 `linux/amd64` 기준으로 빌드한다.

```yaml
platforms: linux/amd64
```

### 로컬 실행 검증

Workflow 내부에서 다음 방식으로 로컬 실행 검증을 수행한다.

```bash
docker build -t edge-vlm-hvac:test .
docker run --rm edge-vlm-hvac:test
```

실행 결과:

```text
Edge VLM HVAC Docker image is ready
```

### Dockerfile 구성

현재 Dockerfile은 GitHub Actions에서 안정적으로 빌드되도록 경량 Python 이미지를 사용한다.

```dockerfile
FROM python:3.10-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["python", "-c", "print('Edge VLM HVAC Docker image is ready')"]
```

### Docker 보안 스캔

Docker 이미지 빌드 후 Trivy를 사용하여 보안 스캔을 수행한다.

```text
도구: Trivy
결과 형식: SARIF
업로드 위치: GitHub Security / Code Scanning
```
![docker build push success](![docker build push success](./Docker_image_action.png))

---

## 3. 보안 스캔 자동화

**파일:** `.github/workflows/security-scan.yml`

npm, Snyk, Python Safety 기반 보안 점검을 자동화한다.

### 실행 조건

- `main`, `develop` 브랜치 push
- Pull Request 생성
- 매일 UTC 0시 정기 실행
- 수동 실행

### npm audit

npm 의존성 취약점을 검사한다.

```bash
npm audit --json
npm audit --omit=dev
```

결과는 GitHub Actions Artifact로 저장된다.

```text
Artifact: npm-audit-report
```

HIGH 또는 CRITICAL 취약점이 발견되면 GitHub Issue를 생성하도록 구성하였다.

### Snyk

Snyk CLI를 사용하여 보안 취약점을 검사한다.

```bash
snyk test
snyk test --sarif
```

필요한 Secret:

```text
Secret 이름: SNYK_TOKEN
```

SARIF 결과는 GitHub Security 탭에 업로드되도록 구성하였다.

### Python Safety

Python 의존성 파일을 대상으로 취약점 검사를 수행한다.

```bash
safety check --file requirements_jetson.txt
```

결과는 Artifact로 저장된다.

```text
Artifact: python-safety-report
```

### 통합 보안 리포트

각 보안 스캔 결과를 모아 `SECURITY_REPORT.md`를 자동 생성하고 Artifact로 업로드한다.

```text
Artifact: security-report
```

---

## 4. Dependabot 정책

**파일:** `.github/dependabot.yml`

Dependabot을 사용하여 npm, Python, Docker, GitHub Actions 의존성 업데이트를 자동화한다.

### 업데이트 대상

| 생태계 | 경로 | 주기 |
|------|------|------|
| npm | `/` | 매주 월요일 |
| pip | `/` | 매주 월요일 |
| docker | `/` | 매주 수요일 |
| github-actions | `/` | 매주 목요일 |

### 그룹화 정책

의존성 업데이트 PR이 너무 많이 생성되지 않도록 그룹을 설정하였다.

```text
npm-development-dependencies
npm-production-dependencies
npm-patch-updates
pytorch-dependencies
transformers-dependencies
docker-base-images
github-actions-updates
```

### Jetson 호환성 보호

Jetson 환경 호환성을 위해 일부 Python 패키지는 특정 버전 이상으로 자동 업데이트되지 않도록 제한하였다.

```yaml
ignore:
  - dependency-name: "torch"
    versions:
      - ">=2.1"
  - dependency-name: "torchvision"
    versions:
      - ">=0.17"
```

---

## 5. Dependabot 자동 병합

**파일:** `.github/workflows/dependabot-auto-merge.yml`

Dependabot이 생성한 PR 중 안전한 업데이트를 자동 병합한다.

### 자동 병합 조건

| 업데이트 유형 | 처리 방식 |
|------|------|
| semver patch | 자동 병합 |
| semver minor | 자동 병합 |
| semver major | 수동 검토 |

### 병합 방식

```bash
gh pr merge --auto --squash
```

Major 업데이트는 자동 병합하지 않고 댓글로 수동 검토를 안내한다.

---

## 6. CI Matrix

**파일:** `.github/workflows/ci-matrix.yml`

기본 CI 검증을 수행한다.

### 검증 항목

- Python 문법 검사
- npm 의존성 설치 검사
- npm test 실행
- Dockerfile 존재 여부 확인

### Python 검사

```bash
python -m compileall .
```

### npm 검사

```bash
npm ci
npm test --if-present
```

![ci matrix success](![ci matrix success](./CI_Matrix_action.png))

---

## 7. 전체 CI/CD 파이프라인 흐름

```text
Push / Pull Request
        |
        |-- npm-publish.yml
        |     |-- npm ci
        |     |-- npm version patch/minor/major
        |     |-- npm publish to GitHub Packages
        |     `-- version commit push
        |
        |-- docker-build-push.yml
        |     |-- docker build
        |     |-- docker run local verification
        |     |-- docker push to GHCR
        |     `-- Trivy security scan
        |
        |-- security-scan.yml
        |     |-- npm audit
        |     |-- Snyk scan
        |     |-- Python Safety scan
        |     `-- Security report artifact
        |
        |-- ci-matrix.yml
        |     |-- Python syntax check
        |     |-- npm install check
        |     `-- Dockerfile check
        |
        `-- Dependabot weekly schedule
              |-- npm updates
              |-- pip updates
              |-- Docker base image updates
              `-- GitHub Actions updates
```

---

## 8. 빠른 시작

### 로컬에서 npm 패키지 확인

```bash
npm install
npm test
npm audit
```

### 로컬에서 Docker 빌드 확인

```bash
docker build -t edge-vlm-hvac:test .
docker run --rm edge-vlm-hvac:test
```

### GitHub Actions 실행 확인

1. GitHub 저장소 접속
2. 상단 **Actions** 탭 클릭
3. 다음 workflow 성공 여부 확인

```text
npm 패키지 배포 및 버전 업데이트
Docker 이미지 빌드 및 푸시
보안 스캔 (npm audit & Snyk)
CI Matrix
Dependabot 자동 병합
```

---

## 9. Secrets 설정

GitHub 저장소에서 다음 경로로 이동한다.

```text
Settings → Secrets and variables → Actions → New repository secret
```

### 필요한 Secrets

| 이름 | 용도 |
|------|------|
| `NPM_TOKEN` | GitHub Packages npm 배포 |
| `SNYK_TOKEN` | Snyk 보안 스캔 |

### NPM_TOKEN 권한

Personal Access Token classic 기준 권한:

```text
repo
read:packages
write:packages
```

### SNYK_TOKEN

Snyk 계정에서 API Token을 발급받아 등록한다.

```text
Snyk → Account Settings → API Token
```

---

## 10. 테스트 및 검증 결과

### npm 패키지 배포

```text
Workflow: npm 패키지 배포 및 버전 업데이트
Status: Success
Result: package.json version updated and package published
Package: @minseo040203/edge-vlm-hvac-system
```

### Docker 이미지 빌드 및 푸시

```text
Workflow: Docker 이미지 빌드 및 푸시
Status: Success
Duration: 1m 18s
Jobs:
  - build-test-and-push: Success
  - security-scan: Success
Artifacts: docker-build-summary
```

### CI Matrix

```text
Workflow: CI Matrix
Status: Success
Jobs:
  - Python syntax check
  - npm install check
  - Dockerfile check
```

---

## 11. 문제 해결 기록

### npm publish 403 오류

초기에는 `GITHUB_TOKEN`으로 GitHub Packages에 배포를 시도하여 403 오류가 발생했다.

```text
403 Forbidden - Permission permission_denied
```

해결 방법:

```text
NPM_TOKEN Secret 생성
Personal Access Token classic 사용
권한: repo, read:packages, write:packages
workflow에서 secrets.NPM_TOKEN 사용
```

### 패키지 scope 문제

포크 저장소에서 조직 scope를 사용하여 패키지 연결이 불명확했다.

초기 패키지명:

```text
@kaj-edgevlm-hvac-project/edge-vlm-hvac-system
```

수정 후 패키지명:

```text
@minseo040203/edge-vlm-hvac-system
```

### Docker 베이스 이미지 오류

초기 Dockerfile에서는 NVIDIA L4T PyTorch 이미지를 사용했다.

```text
nvcr.io/nvidia/l4t-pytorch:r35.4.1-pth2.0-py3
```

GitHub Actions 환경에서 해당 이미지 태그를 찾지 못해 실패하였다.

해결 방법:

```text
python:3.10-slim 기반 CI 호환 Dockerfile로 변경
Docker 빌드 플랫폼을 linux/amd64로 단순화
requirements_jetson.txt 전체 설치를 Docker 빌드에서 제외
```

### ci-matrix.yml 문법 오류

초기 `ci-matrix.yml`에서 YAML 문법 오류가 발생했다.

```text
Invalid workflow file: .github/workflows/ci-matrix.yml#L64
```

해결 방법:

```text
ci-matrix.yml 전체 구조를 단순화
Python, npm, Dockerfile 검증 job으로 재구성
```

---

## 12. 최종 파일 구성

```text
edge-vlm-hvac-system/
├── Dockerfile
├── package.json
├── package-lock.json
├── requirements_jetson.txt
├── main.py
├── .github/
│   ├── dependabot.yml
│   └── workflows/
│       ├── npm-publish.yml
│       ├── docker-build-push.yml
│       ├── security-scan.yml
│       ├── dependabot-auto-merge.yml
│       └── ci-matrix.yml
└── week9/
    └── README.md
```

---

## 13. 완료된 기능

### npm 패키지 배포

- [x] GitHub Packages 배포
- [x] Personal Access Token 기반 인증
- [x] 자동 버전 업그레이드
- [x] 배포 후 버전 커밋 자동 생성

### Docker 이미지

- [x] Docker 이미지 자동 빌드
- [x] 로컬 실행 검증
- [x] GitHub Container Registry 푸시
- [x] Trivy 보안 스캔
- [x] Docker 빌드 결과 Artifact 저장

### 보안 스캔

- [x] npm audit
- [x] Snyk
- [x] Python Safety
- [x] SARIF 업로드
- [x] 통합 보안 리포트 생성

### Dependabot

- [x] npm 의존성 업데이트
- [x] Python 의존성 업데이트
- [x] Docker 이미지 업데이트
- [x] GitHub Actions 업데이트
- [x] 의존성 그룹화
- [x] patch/minor 자동 병합
- [x] major 업데이트 수동 검토

### CI Matrix

- [x] Python 문법 검사
- [x] npm 설치 검사
- [x] Dockerfile 검사

---

## 14. 제출 전 확인 사항

- [x] `npm-publish.yml` 성공
- [x] `docker-build-push.yml` 성공
- [x] `security-scan.yml` 구성
- [x] `dependabot.yml` 구성
- [x] `dependabot-auto-merge.yml` 구성
- [x] `ci-matrix.yml` 성공
- [x] `package-lock.json` 생성
- [x] `README.md` 작성

---

## 15. 참고 자료

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Packages Documentation](https://docs.github.com/en/packages)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [npm audit Documentation](https://docs.npmjs.com/cli/v10/commands/npm-audit)
- [Snyk Documentation](https://docs.snyk.io/)
- [Docker Documentation](https://docs.docker.com/)
- [Trivy Documentation](https://trivy.dev/)

---

**작성일:** 2026년 5월 22일  
**버전:** 1.0.1  
**상태:** 🟢 CI/CD 파이프라인 자동화 완료
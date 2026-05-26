# Changelog

## [v1.0.0] - 2026-05-26

### Added

- AI 기반 HVAC 제어 추천 로직 추가
- Feature Flag 3개 이상 구현
- A/B 테스트 2개 구성
- Experiment Logger 추가
- Canary Rollout 시뮬레이션 추가
- Vitest 단위 테스트 및 coverage 80% 기준 추가
- Playwright E2E 테스트 추가
- Docker 빌드 및 GHCR 푸시 workflow 추가
- npm GitHub Packages 배포 workflow 추가
- Dependabot 및 보안 스캔 자동화 추가
- Week 13 실험 문서 및 Pivot/Persevere 결정 기록 추가
- 최종 프로젝트 README, Runbook, ADR, Model Card, Retrospective 추가

### Changed

- 프런트엔드 진입 파일을 `main.jsx`로 정리
- CI/CD workflow를 과제 요구사항에 맞게 분리
- Docker 빌드 시간을 줄이기 위해 CI 호환 Dockerfile로 개선

### Security

- npm audit, Snyk, Trivy 기반 스캔 구성
- Dependabot 업데이트 정책 구성

### Release

- Final project release tag: `v1.0.0`
# Retrospective

## 프로젝트 회고

본 프로젝트는 Edge VLM + IoT 기반 HVAC 제어 시스템을 주제로, AI 기능 구현뿐 아니라 CI/CD, 테스트, 보안, 배포, 실험 운영까지 포함한 서비스 운영형 프로젝트로 진행하였다.

---

## 잘한 점

1. GitHub Actions를 활용해 테스트, Docker 빌드, 보안 스캔, 리포트 생성을 자동화하였다.
2. Feature Flag와 A/B 테스트를 도입하여 실험 기반 의사결정 구조를 만들었다.
3. Vitest와 Playwright를 통해 단위 테스트와 E2E 테스트를 구성하였다.
4. Dependabot, npm audit, Snyk, Trivy를 통해 보안 자동화 요소를 포함하였다.
5. 사용자 페르소나 10명과 실험 지표를 기반으로 Persevere 결정을 문서화하였다.

---

## 어려웠던 점

1. GitHub Actions workflow 경로와 실행 조건 설정에서 오류가 발생하였다.
2. Docker 빌드에서 Jetson 기반 이미지가 GitHub Actions 환경과 맞지 않아 CI 호환 이미지로 조정해야 했다.
3. Playwright E2E 테스트에서 중복 텍스트 선택자 문제가 발생하여 안정적인 role 기반 selector로 수정하였다.
4. GitHub push/rebase 과정에서 원격 브랜치와 로컬 브랜치 동기화 문제가 있었다.

---

## 배운 점

1. CI/CD는 단순히 workflow 파일을 만드는 것이 아니라 실행 환경, 권한, 경로 조건까지 함께 고려해야 한다.
2. Feature Flag는 기능 출시뿐 아니라 실험과 롤백 전략에도 유용하다.
3. 테스트 자동화는 리팩토링 안정성을 확보하는 핵심 장치다.
4. 실험 결과는 단순 수치뿐 아니라 사용자 피드백과 함께 해석해야 한다.
5. 운영 문서 Runbook, ADR, Changelog, Retrospective가 프로젝트 완성도를 높인다.

---

## 다음 개선 방향

1. 실제 센서 데이터 연동
2. VLM 모델 추론 API 연동
3. 실시간 대시보드 메트릭 수집
4. Prometheus/Grafana 기반 관측성 강화
5. 실제 Vercel 또는 Cloud Run 라이브 배포 URL 확보
6. 사용자 피드백 수집 자동화 고도화

---

## 최종 결정

본 프로젝트는 MVP 수준에서 핵심 기능과 운영 자동화 구조를 갖추었으므로, 현재 방향을 유지하는 **Persevere** 전략을 선택한다.
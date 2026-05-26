# Week 13 Experiment Backlog

## 목적

Feature Flag 기반 A/B 테스트와 사용자 피드백 수집을 통해 HVAC Dashboard V2의 지속 여부를 판단한다.

---

## 실험 백로그

| ID | 항목 | 우선순위 | 상태 | 담당 |
|----|------|----------|------|------|
| EXP-001 | 10명 LLM 페르소나 사용자 피드백 생성 | High | Done | minseo040203 |
| EXP-002 | Feature Flag 기반 A/B 테스트 지표 정의 | High | Done | minseo040203 |
| EXP-003 | 2주 운영 지표 데이터 정리 | High | Done | minseo040203 |
| EXP-004 | Dashboard V2와 Classic Dashboard 비교 | High | Done | minseo040203 |
| EXP-005 | 사용자 피드백 패턴 분석 | Medium | Done | minseo040203 |
| EXP-006 | 주간 리포트 자동 생성 스크립트 작성 | Medium | Done | minseo040203 |
| EXP-007 | GitHub Actions 기반 리포트 자동화 | Medium | Done | minseo040203 |
| EXP-008 | Pivot 또는 Persevere 결정 문서화 | High | Done | minseo040203 |

---

## 핵심 지표

| 지표 | 설명 |
|------|------|
| Task Completion Rate | 사용자가 목표 작업을 완료한 비율 |
| CTA Click Rate | 주요 버튼 클릭 비율 |
| Feedback Rating | 사용자 피드백 평균 점수 |
| Session Duration | 평균 세션 체류 시간 |

---

## 실험 가설

Dashboard V2를 사용하는 사용자는 기존 Dashboard 사용자보다 작업 완료율과 CTA 클릭률이 높을 것이다.

---

## 성공 기준

1. Task Completion Rate가 Control 대비 10% 이상 개선
2. Feedback Rating이 Control 대비 15% 이상 개선
3. CTA Click Rate가 Control 대비 20% 이상 개선
4. 치명적인 부정 피드백 패턴이 발견되지 않을 것

---

## 실험 운영 방식

1. Feature Flag `hvacDashboardV2`를 기준으로 Control과 Variant A를 나눈다.
2. Control 그룹은 기존 Classic Dashboard를 사용한다.
3. Variant A 그룹은 Dashboard V2를 사용한다.
4. 2주 동안 Task Completion Rate, CTA Click Rate, Feedback Rating, Session Duration을 비교한다.
5. 10명의 LLM 기반 사용자 페르소나 피드백을 수집한다.

---

## 의사결정 기준

| 조건 | 결정 |
|------|------|
| 핵심 지표가 의미 있게 개선됨 | Persevere |
| 지표 개선이 없고 부정 피드백이 많음 | Pivot |
| 일부 지표만 개선되고 UX 문제가 큼 | Partial Pivot |

---

## 최종 판단 자료

| 문서 | 설명 |
|------|------|
| `user-personas-feedback.json` | 10명 사용자 페르소나 및 피드백 데이터 |
| `ab-test-metrics.json` | 2주 A/B 테스트 지표 |
| `weekly-report.md` | 주간 실험 리포트 |
| `pivot-or-persevere-decision.md` | 최종 의사결정 기록 |
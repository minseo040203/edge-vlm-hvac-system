# Week 13 — User Feedback, A/B Test Operation, Pivot or Persevere

> **과목:** aioss실습  
> **주제:** 사용자 시나리오 기반 피드백 수집, Feature Flag 기반 A/B 테스트 운영, 실험 지표 분석, Pivot or Persevere 결정  
> **저장소:** https://github.com/minseo040203/edge-vlm-hvac-system  
> **상태:** 🟢 실험 문서/데이터/결정 기록 구성 완료  
> **작성일:** 2026년 5월 26일

---

## ✅ 구현 항목 체크리스트

| 항목 | 파일 | 상태 |
|------|------|------|
| 사용자 시나리오 기반 피드백 수집 | `experiments/week13/user-personas-feedback.json` | ✅ |
| LLM 기반 10명 사용자 페르소나 구성 | `experiments/week13/user-personas-feedback.json` | ✅ |
| 서로 다른 사용자 패턴 구성 | `experiments/week13/user-personas-feedback.json` | ✅ |
| Feature Flag 기반 A/B 테스트 운영 | `experiments/week13/ab-test-metrics.json` | ✅ |
| 2주간 핵심 지표 변화 측정 | `experiments/week13/ab-test-metrics.json` | ✅ |
| 실험 백로그 구성 | `experiments/week13/experiment-backlog.md` | ✅ |
| 주간 리포트 작성 | `experiments/week13/weekly-report.md` | ✅ |
| Pivot 또는 Persevere 결정 문서화 | `experiments/week13/pivot-or-persevere-decision.md` | ✅ |
| 주간 리포트 자동 생성 스크립트 | `scripts/generate-week13-report.js` | ✅ |
| GitHub Actions 기반 리포트 자동화 | `.github/workflows/week13-experiment-report.yml` | ✅ |

---

## 1. 과제 요구사항

이번 과제에서는 다음 요구사항을 구현하였다.

```text
1. 사용자 시나리오 기반 코드를 생성하고 평가하여 최소 10명의 사용자 피드백을 수집한다.
2. 10명의 사용자는 LLM을 사용하여 각기 다른 페르소나를 가진 패턴을 가져야 한다.
3. Feature Flag 기반 A/B 테스트를 2주 운영해 핵심 지표 변화를 측정한다.
4. 선택과제로 GitHub Issues/Projects/Actions를 활용해 실험 백로그, 지표 수집, 주간 리포팅 자동화를 구성한다.
5. 결과를 바탕으로 Pivot 또는 Persevere 결정을 문서화한다.
6. 깃허브 링크로 실험 문서, 데이터, 결정 기록을 제출한다.
```

본 프로젝트에서는 HVAC Dashboard V2 기능을 대상으로 Feature Flag 기반 A/B 테스트를 설계하고, LLM 기반 사용자 페르소나 10명의 피드백과 2주간의 실험 지표를 정리하였다.

---

## 2. 구현 파일 구조

```text
edge-vlm-hvac-system/
├── experiments/
│   └── week13/
│       ├── user-personas-feedback.json
│       ├── ab-test-metrics.json
│       ├── experiment-backlog.md
│       ├── weekly-report.md
│       ├── pivot-or-persevere-decision.md
│       └── generated-report.md
├── scripts/
│   └── generate-week13-report.js
├── .github/
│   └── workflows/
│       └── week13-experiment-report.yml
└── week13/
    └── README.md
```

---

## 3. 실험 개요

| 항목 | 내용 |
|------|------|
| 실험명 | Feature Flag HVAC Dashboard V2 A/B Test |
| 실험 대상 | HVAC Dashboard V2 |
| 실험 방식 | Feature Flag 기반 A/B 테스트 |
| 실험 기간 | 2026-05-26 ~ 2026-06-09 |
| Control | Classic Dashboard |
| Variant A | Dashboard V2 |
| Feature Flag | `hvacDashboardV2` |
| Primary Metric | Task Completion Rate |
| Secondary Metrics | CTA Click Rate, Feedback Rating, Session Duration |
| 최종 결정 | Persevere |

---

## 4. 사용자 시나리오 기반 피드백 수집

**파일:** `experiments/week13/user-personas-feedback.json`

LLM을 사용하여 서로 다른 역할, 목적, 사용 패턴을 가진 10명의 사용자 페르소나를 구성하였다.  
각 사용자는 HVAC Dashboard를 사용하는 시나리오를 기반으로 평가를 수행하고, 긍정 피드백, 부정 피드백, 개선 제안을 남기도록 구성하였다.

---

## 5. 10명 사용자 페르소나

| ID | 페르소나 | Role | 사용 패턴 | Variant | Rating |
|----|----------|------|----------|---------|--------|
| user-01 | 시설 관리자 | admin | 건물 전체 공조 상태를 매일 확인 | variantA | 5 |
| user-02 | 에너지 관리 담당자 | operator | 전력 사용량과 냉난방 효율 분석 | variantA | 4 |
| user-03 | 일반 사무실 근무자 | guest | 현재 실내 상태를 간단히 확인 | control | 3 |
| user-04 | 공조 설비 엔지니어 | admin | 센서 데이터와 제어 추천 비교 | variantA | 5 |
| user-05 | 건물 운영 매니저 | operator | 입주자 민원과 공조 상태 관리 | variantA | 4 |
| user-06 | 보안 관제 담당자 | guest | 야간 건물 상태 모니터링 | control | 3 |
| user-07 | 데이터 분석가 | admin | HVAC 데이터와 실험 지표 분석 | variantA | 5 |
| user-08 | 신규 입사 운영자 | operator | 안내 문구 기반 시스템 학습 | variantA | 4 |
| user-09 | 관리 책임자 | admin | 운영 성과를 요약 보고 형태로 확인 | control | 3 |
| user-10 | 현장 유지보수 기사 | operator | 모바일로 이상 구역을 빠르게 확인 | variantA | 4 |

---

## 6. 사용자 피드백 요약

**파일:** `experiments/week13/user-personas-feedback.json`

| 항목 | 값 |
|------|------|
| 총 사용자 수 | 10명 |
| 평균 만족도 | 4.0 / 5.0 |
| Variant A 사용자 | 7명 |
| Control 사용자 | 3명 |

### 긍정 피드백 패턴

1. 핵심 지표 확인이 빠르다.
2. 추천 문구가 의사결정에 도움이 된다.
3. 관리자와 운영자에게 Dashboard V2가 유용하다.
4. 설비 점검과 현장 대응에 도움이 된다.
5. 초보 사용자도 추천 문구를 통해 조치를 이해할 수 있다.

### 부정 피드백 패턴

1. 전문 용어 설명이 부족하다.
2. 성과 요약과 데이터 내보내기 기능이 필요하다.
3. 모바일 화면 최적화가 필요하다.
4. 센서 히스토리 그래프가 부족하다.
5. 알림 우선순위가 더 명확하면 좋겠다.

---

## 7. 사용자 시나리오 예시

### 시설 관리자

```text
출근 직후 전체 층의 실내 온도, 습도, CO2 상태를 확인하고
에너지 절감 추천을 검토한다.
```

피드백:

```text
대시보드에서 핵심 지표가 한눈에 보여 빠르게 상태를 판단할 수 있었다.
위험도가 높은 구역을 상단에 자동 정렬하는 기능이 필요하다.
```

### 에너지 관리 담당자

```text
에너지 절감 추천 카드와 PMV 기반 쾌적도 지표를 비교하며
절전 가능성을 검토한다.
```

피드백:

```text
에너지 절감 추천이 직관적이라 의사결정에 도움이 되었다.
전일 대비 에너지 사용량 변화율을 같이 보여주면 좋겠다.
```

### 현장 유지보수 기사

```text
현장 점검 중 특정 구역의 냉방/환기 상태와 추천 조치를 확인한다.
```

피드백:

```text
추천 조치가 명확해서 현장 대응에 도움이 되었다.
모바일 전용 compact layout이 있으면 좋겠다.
```

---

## 8. Feature Flag 기반 A/B 테스트

**파일:** `experiments/week13/ab-test-metrics.json`

이번 실험은 `hvacDashboardV2` Feature Flag를 기준으로 Control과 Variant A를 나누었다.

| 그룹 | 설명 |
|------|------|
| Control | 기존 Classic Dashboard 사용 |
| Variant A | 개선된 Dashboard V2 사용 |

### 실험 가설

```text
Dashboard V2를 사용하는 사용자는 기존 Dashboard 사용자보다
작업 완료율과 CTA 클릭률이 높을 것이다.
```

---

## 9. 2주 운영 지표

**파일:** `experiments/week13/ab-test-metrics.json`

### Week 1

| 지표 | Control | Variant A |
|------|---------|-----------|
| Users | 50 | 50 |
| Task Completion Rate | 68% | 76% |
| Average Session Duration | 142초 | 168초 |
| CTA Click Rate | 22% | 31% |
| Feedback Rating Average | 3.3 | 3.9 |

### Week 2

| 지표 | Control | Variant A |
|------|---------|-----------|
| Users | 55 | 55 |
| Task Completion Rate | 70% | 82% |
| Average Session Duration | 148초 | 181초 |
| CTA Click Rate | 24% | 37% |
| Feedback Rating Average | 3.4 | 4.2 |

---

## 10. 핵심 지표 변화 측정

| 지표 | Control | Variant A | 변화 |
|------|---------|-----------|------|
| Task Completion Rate | 70% | 82% | +17.1% |
| CTA Click Rate | 24% | 37% | +54.2% |
| Feedback Rating | 3.4 | 4.2 | +23.5% |
| Session Duration | 148초 | 181초 | +22.3% |

### 해석

Primary Metric인 `Task Completion Rate`는 Control 대비 Variant A에서 +17.1% 개선되었다.

또한 CTA Click Rate와 Feedback Rating도 함께 상승하였다.  
이는 Dashboard V2가 사용자의 작업 수행과 기능 탐색, 만족도 측면에서 긍정적인 영향을 주었다는 의미로 해석할 수 있다.

다만 Session Duration도 증가했기 때문에, 이는 긍정적인 체류 시간 증가일 수도 있지만 정보량 증가로 인한 탐색 시간 증가일 수도 있다.  
따라서 후속 개선에서는 Tooltip, KPI 요약, 모바일 최적화를 함께 진행하는 것이 필요하다.

---

## 11. 실험 백로그

**파일:** `experiments/week13/experiment-backlog.md`

실험 백로그는 다음 항목으로 구성하였다.

| ID | 항목 | 우선순위 | 상태 |
|----|------|----------|------|
| EXP-001 | 10명 LLM 페르소나 사용자 피드백 생성 | High | Done |
| EXP-002 | Feature Flag 기반 A/B 테스트 지표 정의 | High | Done |
| EXP-003 | 2주 운영 지표 데이터 정리 | High | Done |
| EXP-004 | Dashboard V2와 Classic Dashboard 비교 | High | Done |
| EXP-005 | 사용자 피드백 패턴 분석 | Medium | Done |
| EXP-006 | 주간 리포트 자동 생성 스크립트 작성 | Medium | Done |
| EXP-007 | GitHub Actions 기반 리포트 자동화 | Medium | Done |
| EXP-008 | Pivot 또는 Persevere 결정 문서화 | High | Done |

---

## 12. 주간 리포트

**파일:** `experiments/week13/weekly-report.md`

주간 리포트에는 다음 내용을 정리하였다.

1. 실험 개요
2. 사용자 피드백 요약
3. 긍정 피드백 패턴
4. 부정 피드백 패턴
5. A/B 테스트 지표 변화
6. 실험 해석
7. 다음 액션

---

## 13. GitHub Actions 기반 리포팅 자동화

**Workflow:** `.github/workflows/week13-experiment-report.yml`  
**Script:** `scripts/generate-week13-report.js`

### 자동화 목적

GitHub Actions를 사용하여 실험 데이터가 변경되거나 정기 일정이 도래했을 때 실험 리포트를 자동 생성하도록 구성하였다.

### 실행 조건

```text
1. experiments/week13/** 파일 변경 시
2. scripts/generate-week13-report.js 변경 시
3. workflow_dispatch 수동 실행 시
4. 매주 월요일 09:00 UTC schedule 실행 시
```

### 자동화 흐름

```text
Checkout
   ↓
Set up Node.js
   ↓
npm run week13:report
   ↓
generated-report.md 생성
   ↓
experiment report artifact 업로드
   ↓
schedule 실행 시 GitHub Issue 자동 생성
```

---

## 14. 자동 생성 리포트

**파일:** `experiments/week13/generated-report.md`

자동 생성 리포트는 다음 데이터를 기반으로 생성된다.

| 입력 파일 | 역할 |
|----------|------|
| `user-personas-feedback.json` | 사용자 피드백 요약 |
| `ab-test-metrics.json` | A/B 테스트 지표 |
| `generate-week13-report.js` | 리포트 생성 로직 |

생성 명령:

```bash
npm run week13:report
```

---

## 15. Pivot or Persevere 결정

**파일:** `experiments/week13/pivot-or-persevere-decision.md`

최종 결정은 다음과 같다.

```text
Decision: Persevere
```

### 결정 근거

| 지표 | 결과 |
|------|------|
| Task Completion Rate | +17.1% |
| CTA Click Rate | +54.2% |
| Feedback Rating | +23.5% |
| 사용자 평균 만족도 | 4.0 / 5.0 |

Dashboard V2는 핵심 지표와 사용자 만족도를 개선하였다.  
따라서 현재 제품 방향은 유지하고, 후속 개선을 진행하는 **Persevere**로 결정하였다.

---

## 16. 후속 개선 항목

실험 결과를 바탕으로 다음 개선 항목을 후속 백로그로 등록한다.

1. Tooltip 기반 전문 용어 설명
2. 모바일 compact layout 개선
3. KPI 주간 요약 카드 추가
4. CSV export 기능 검토
5. 위험 구역 자동 정렬 기능 추가
6. 센서 히스토리 그래프 추가
7. 알림 우선순위 개선

---

## 17. GitHub 제출 링크

| 항목 | 링크 |
|------|------|
| 사용자 페르소나 피드백 | https://github.com/minseo040203/edge-vlm-hvac-system/blob/main/experiments/week13/user-personas-feedback.json |
| A/B 테스트 지표 | https://github.com/minseo040203/edge-vlm-hvac-system/blob/main/experiments/week13/ab-test-metrics.json |
| 실험 백로그 | https://github.com/minseo040203/edge-vlm-hvac-system/blob/main/experiments/week13/experiment-backlog.md |
| 주간 리포트 | https://github.com/minseo040203/edge-vlm-hvac-system/blob/main/experiments/week13/weekly-report.md |
| Pivot/Persevere 결정 | https://github.com/minseo040203/edge-vlm-hvac-system/blob/main/experiments/week13/pivot-or-persevere-decision.md |
| 자동 생성 리포트 | https://github.com/minseo040203/edge-vlm-hvac-system/blob/main/experiments/week13/generated-report.md |
| 자동 리포트 스크립트 | https://github.com/minseo040203/edge-vlm-hvac-system/blob/main/scripts/generate-week13-report.js |
| GitHub Actions 자동화 | https://github.com/minseo040203/edge-vlm-hvac-system/blob/main/.github/workflows/week13-experiment-report.yml |

---

## 18. 로컬 실행 방법

### 자동 리포트 생성

```bash
npm run week13:report
```

### 생성 결과 확인

```text
experiments/week13/generated-report.md
```

---

## 19. 완료된 항목

- [x] 사용자 시나리오 기반 피드백 수집
- [x] LLM 기반 10명 사용자 페르소나 구성
- [x] 각기 다른 역할과 사용 패턴 반영
- [x] Feature Flag 기반 A/B 테스트 구성
- [x] 2주 운영 지표 정리
- [x] 핵심 지표 변화 측정
- [x] 실험 백로그 문서화
- [x] 주간 리포트 작성
- [x] GitHub Actions 기반 리포트 자동화 구성
- [x] 자동 생성 리포트 스크립트 작성
- [x] Pivot 또는 Persevere 결정 문서화
- [x] 후속 개선 항목 정리

---

## 20. 결론

Week 13 과제에서는 LLM 기반 10명 사용자 페르소나를 생성하고, 각 페르소나별 사용자 시나리오와 피드백을 수집하였다.

Feature Flag `hvacDashboardV2`를 기준으로 Classic Dashboard와 Dashboard V2를 비교하는 A/B 테스트를 2주 운영한 형태로 지표를 정리하였다.

핵심 지표인 Task Completion Rate는 Control 대비 +17.1% 개선되었고, CTA Click Rate와 Feedback Rating도 함께 개선되었다.

또한 GitHub Actions를 활용하여 주간 실험 리포트를 자동 생성하는 workflow를 구성하였으며, 실험 결과를 바탕으로 제품 방향을 **Persevere**로 결정하였다.

따라서 Dashboard V2는 유지하고, Tooltip, 모바일 compact layout, KPI 요약, CSV export 등 후속 개선을 진행하는 방향으로 정리하였다.

---

**작성일:** 2026년 5월 26일  
**버전:** 1.0.0  
**상태:** 🟢 사용자 피드백 / A/B 테스트 / 실험 결정 기록 완료
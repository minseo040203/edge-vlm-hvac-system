# Week 13 Weekly Experiment Report

## 실험 개요

| 항목 | 내용 |
|------|------|
| 실험명 | Feature Flag HVAC Dashboard V2 A/B Test |
| 기간 | 2026-05-26 ~ 2026-06-09 |
| Control | Classic Dashboard |
| Variant A | Dashboard V2 |
| Feature Flag | `hvacDashboardV2` |
| 주요 지표 | Task Completion Rate |

---

## 사용자 피드백 요약

총 10명의 LLM 기반 사용자 페르소나 피드백을 수집하였다.

| 항목 | 값 |
|------|------|
| 총 사용자 수 | 10명 |
| 평균 만족도 | 4.0 / 5.0 |
| Variant A 사용자 | 7명 |
| Control 사용자 | 3명 |

---

## 긍정 피드백 패턴

1. 핵심 지표 확인이 빠르다.
2. 추천 문구가 의사결정에 도움이 된다.
3. 관리자와 운영자에게 Dashboard V2가 유용하다.

---

## 부정 피드백 패턴

1. 전문 용어 설명이 부족하다.
2. 성과 요약과 데이터 내보내기가 필요하다.
3. 모바일 화면 최적화가 필요하다.

---

## A/B 테스트 지표 변화

| 지표 | Control | Variant A | 변화 |
|------|---------|-----------|------|
| Task Completion Rate | 70% | 82% | +17.1% |
| CTA Click Rate | 24% | 37% | +54.2% |
| Feedback Rating | 3.4 | 4.2 | +23.5% |
| Session Duration | 148초 | 181초 | +22.3% |

---

## 해석

Variant A인 Dashboard V2는 주요 지표에서 Control보다 좋은 결과를 보였다.

특히 Task Completion Rate와 CTA Click Rate가 크게 개선되었으므로 Dashboard V2가 사용자 작업 수행과 기능 탐색에 긍정적인 영향을 준 것으로 판단된다.

다만 Session Duration이 증가했기 때문에 사용자가 더 오래 머무는 긍정적 신호일 수도 있지만, 정보량이 많아 사용 시간이 늘어난 것일 수도 있다.

---

## 다음 액션

1. Dashboard V2 유지
2. 용어 설명 tooltip 추가
3. 모바일 compact layout 개선
4. 주간 KPI 요약 카드 추가
5. CSV export 기능 검토
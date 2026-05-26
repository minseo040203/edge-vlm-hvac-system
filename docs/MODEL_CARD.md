# Model Card: HVAC Recommendation Logic

## 모델/기능 이름

HVAC Control Recommendation Logic

---

## 개요

본 프로젝트의 AI 기능은 센서 데이터를 기반으로 HVAC 제어 모드를 추천하는 규칙 기반 AI 로직이다.

입력 데이터:

- temperature
- humidity
- occupancy
- co2

출력 데이터:

- HVAC mode
- PMV score
- energy saving score
- recommendation message

---

## 사용 목적

1. 실내 쾌적도 판단
2. 냉방/난방/환기/대기 모드 추천
3. 에너지 절감 가능성 판단
4. 운영자 의사결정 지원

---

## 주요 함수

| 함수 | 설명 |
|------|------|
| `validateSensorData` | 입력 데이터 유효성 검증 |
| `calculatePmvScore` | 쾌적도 점수 계산 |
| `determineHvacMode` | HVAC 모드 결정 |
| `calculateEnergySavingScore` | 에너지 절감 점수 계산 |
| `generateControlRecommendation` | 최종 추천 생성 |

---

## 제한 사항

1. 실제 VLM 모델 추론이 아닌 규칙 기반 추천 로직이다.
2. 실제 건물 센서 데이터가 아닌 시뮬레이션 데이터 기반이다.
3. PMV 계산은 단순화된 점수이며 공식 산업 표준 계산과 다를 수 있다.
4. 실제 HVAC 장비 제어 전에는 현장 검증이 필요하다.

---

## 리스크

| 리스크 | 설명 | 완화 방법 |
|--------|------|----------|
| 잘못된 센서 입력 | 비정상 데이터로 잘못된 추천 가능 | validateSensorData 적용 |
| 과도한 자동화 신뢰 | 운영자가 추천을 무조건 따를 위험 | Human-in-the-loop 운영 |
| 환경 차이 | 실제 건물마다 조건이 다름 | 현장 보정 필요 |
| 모델 단순화 | 실제 쾌적도와 차이 가능 | 실제 데이터 기반 개선 필요 |

---

## 평가 방법

1. 단위 테스트
2. E2E 테스트
3. 사용자 피드백
4. A/B 테스트 지표
5. 실험 리포트

---

## 최종 판단

현재 기능은 MVP 수준의 HVAC 추천 기능으로 적합하다.  
실제 운영 적용 전에는 실제 센서 데이터와 VLM 모델 연동을 통한 추가 검증이 필요하다.
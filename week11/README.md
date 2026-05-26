# Week 11 — Feature Flag, A/B Test, Canary Rollout

> **과목:** aioss실습  
> **주제:** Feature Flag, A/B 테스트, Canary Rollout  
> **저장소:** https://github.com/minseo040203/edge-vlm-hvac-system  
> **상태:** 🟢 기능 플래그 및 실험 로직 구성 완료  
> **작성일:** 2026년 5월 26일

---

## ✅ 구현 항목 체크리스트

| 항목 | 파일 | 상태 |
|------|------|------|
| Feature Flag 3개 이상 도입 | `frontend/src/featureFlags.js` | ✅ |
| 환경 변수 기반 토글 | `frontend/src/featureFlags.js` | ✅ |
| 대상 사용자/역할 기준 토글 | `frontend/src/featureFlags.js` | ✅ |
| A/B 테스트 2개 variant 구성 | `frontend/src/featureFlags.js` | ✅ |
| 사용자 할당 일관성 | `hashString`, `getUserBucket` | ✅ |
| 이벤트 추적 로직 | `frontend/src/experimentLogger.js` | ✅ |
| 이벤트 로그 저장 | `localStorage`, console log | ✅ |
| Canary 1%-10%-50%-100% 설정 | `config/canary-rollout.json` | ✅ |
| 헬스체크 기반 롤백 시나리오 | `scripts/simulate-canary-rollout.js` | ✅ |
| 실험 로그 | `week11/canary-rollout-log.md` | ✅ |

---

## 1. 과제 요구사항

이번 과제에서는 다음 요구사항을 구현하였다.

```text
1. 앱에 최소 3개 이상의 Feature Flag를 도입하고 환경 변수/대상 사용자 기준으로 토글 제어를 구현한다.
2. A/B 테스트 2개 variant를 구성해 사용자 할당 일관성 및 이벤트 추적 로직을 추가한다.
3. 선택과제로 Canary 1%-10%-50%-100% 롤아웃과 헬스체크 기반 자동 롤백 시나리오를 검증한다.
4. 깃허브 링크로 플래그 코드, 실험 로그, 롤아웃 설정을 제출한다.
```

---

## 2. 구현 파일 구조

```text
edge-vlm-hvac-system/
├── frontend/
│   └── src/
│       ├── featureFlags.js
│       ├── experimentLogger.js
│       └── main.jsx
├── config/
│   └── canary-rollout.json
├── scripts/
│   └── simulate-canary-rollout.js
└── week11/
    ├── README.md
    └── canary-rollout-log.md
```

---

## 3. Feature Flag 구현

**파일:** `frontend/src/featureFlags.js`

총 3개의 Feature Flag를 구성하였다.

| Flag 이름 | 설명 | 기본 상태 | 제어 기준 |
|------|------|------|------|
| `hvacDashboardV2` | 새로운 HVAC 대시보드 UI | ON | 환경 변수, 사용자 role, 대상 user |
| `energySavingTips` | 에너지 절감 추천 카드 | ON | 환경 변수, role, rollout percentage |
| `vlmInsightPanel` | VLM 인사이트 패널 | OFF | 환경 변수, admin role, 대상 user |

---

## 4. 환경 변수 기반 토글

Vite 환경 변수로 Feature Flag를 제어할 수 있도록 구성하였다.

```text
VITE_FLAG_HVAC_DASHBOARD_V2=true
VITE_FLAG_ENERGY_SAVING_TIPS=true
VITE_FLAG_VLM_INSIGHT_PANEL=false
```

환경 변수 값이 `false`이면 해당 기능은 사용자 조건을 만족해도 비활성화된다.

---

## 5. 대상 사용자 기준 토글

Feature Flag는 사용자 ID와 role 기준으로 제어된다.

```javascript
targetRoles: ["admin", "operator"]
targetUsers: ["minseo040203", "demo-user"]
```

예시:

```text
admin 사용자 → VLM Insight Panel 확인 가능
guest 사용자 → 일부 기능 제한
operator 사용자 → Dashboard V2와 Energy Saving Tips 확인 가능
```

---

## 6. Rollout Percentage 기반 제어

사용자 ID를 해시하여 0~99 bucket에 할당하고, rollout percentage 안에 들어오는 사용자만 기능을 활성화한다.

```javascript
function getUserBucket(userId, salt = "") {
  const hash = hashString(`${userId}:${salt}`);
  return hash % 100;
}
```

이 방식으로 같은 사용자는 항상 같은 bucket에 들어가므로 기능 노출이 일관된다.

---

## 7. A/B 테스트 구성

A/B 테스트 2개를 구성하였다.

| Experiment | Variants | 설명 |
|------|------|------|
| `comfortAlgorithmCard` | `control`, `variantA` | 쾌적도 알고리즘 카드 문구 실험 |
| `dashboardLayout` | `classic`, `compact` | 대시보드 레이아웃 실험 |

---

## 8. 사용자 할당 일관성

사용자 ID와 experiment key를 함께 해시하여 variant를 결정한다.

```javascript
const bucket = getUserBucket(user.id, experimentKey);
const variantIndex = bucket % experiment.variants.length;
```

따라서 같은 사용자는 새로고침하거나 다시 접속해도 동일한 variant를 받는다.

예시:

```text
user=minseo040203
comfortAlgorithmCard → variantA
dashboardLayout → compact
```

---

## 9. 이벤트 추적 로직

**파일:** `frontend/src/experimentLogger.js`

A/B 테스트 및 Feature Flag 이벤트를 추적한다.

### 추적 이벤트

| 이벤트 | 설명 |
|------|------|
| `page_view` | 페이지 진입 시 현재 user, flags, experiments 기록 |
| `user_changed` | 데모 사용자 변경 시 기록 |
| `cta_click` | 주요 버튼 클릭 시 기록 |

### 저장 위치

```text
localStorage: edge_vlm_hvac_experiment_events
console.log: [experiment-event]
```

---

## 10. 이벤트 로그 예시

```json
{
  "eventName": "page_view",
  "payload": {
    "user": {
      "id": "minseo040203",
      "role": "admin",
      "region": "KR"
    },
    "flags": {
      "hvacDashboardV2": true,
      "energySavingTips": true,
      "vlmInsightPanel": true
    },
    "experiments": {
      "comfortAlgorithmCard": "variantA",
      "dashboardLayout": "compact"
    }
  },
  "timestamp": "2026-05-26T00:00:00.000Z"
}
```

---

## 11. Canary Rollout 설정

**파일:** `config/canary-rollout.json`

선택과제 요구사항에 맞게 4단계 롤아웃을 구성하였다.

| Stage | Traffic | Duration | Health Check |
|------|------|------|------|
| stage-1 | 1% | 10분 | success rate, error rate, latency |
| stage-2 | 10% | 20분 | success rate, error rate, latency |
| stage-3 | 50% | 30분 | success rate, error rate, latency |
| stage-4 | 100% | 60분 | success rate, error rate, latency |

---

## 12. 헬스체크 기반 자동 롤백

각 단계는 다음 기준을 검사한다.

```text
successRateThreshold
maxErrorRate
maxP95LatencyMs
```

조건을 만족하지 못하면 자동 롤백 시나리오가 실행된다.

```json
"rollbackOnFailure": true
```

롤백 전략:

```text
restore-previous-stable-version
```

---

## 13. Canary 시뮬레이션

**파일:** `scripts/simulate-canary-rollout.js`

실행 명령:

```bash
npm run canary:simulate
```

시뮬레이션 결과로 다음 파일이 생성된다.

```text
week11/canary-rollout-log.md
```

---

## 14. Canary 시뮬레이션 결과

본 시뮬레이션에서는 다음 결과가 나오도록 구성하였다.

```text
stage-1: 1% 트래픽 PASS
stage-2: 10% 트래픽 PASS
stage-3: 50% 트래픽 FAIL
자동 롤백 triggered
stage-4: 100% 트래픽 진행하지 않음
```

즉, 50% Canary 단계에서 error rate와 p95 latency가 기준을 초과하여 자동 롤백 시나리오가 검증된다.

---

## 15. GitHub 제출 링크

아래 파일들을 GitHub 링크로 제출한다.

| 항목 | 파일 |
|------|------|
| Feature Flag 코드 | `frontend/src/featureFlags.js` |
| A/B 테스트 및 사용자 할당 코드 | `frontend/src/featureFlags.js` |
| 이벤트 추적 코드 | `frontend/src/experimentLogger.js` |
| 프런트엔드 적용 코드 | `frontend/src/main.jsx` |
| Canary Rollout 설정 | `config/canary-rollout.json` |
| Canary 시뮬레이션 코드 | `scripts/simulate-canary-rollout.js` |
| 실험 로그 | `week11/canary-rollout-log.md` |

---

## 16. 검증 방법

### 프런트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 사용자 쿼리 파라미터를 변경하여 토글을 확인할 수 있다.

```text
http://localhost:5173/?user=minseo040203&role=admin
http://localhost:5173/?user=guest-001&role=guest
http://localhost:5173/?user=operator-001&role=operator
```

### 빌드 검증

```bash
cd frontend
npm run build
```

### Canary 시뮬레이션

```bash
npm run canary:simulate
```

---

## 17. 완료된 기능

- [x] Feature Flag 3개 이상 구현
- [x] 환경 변수 기반 Feature Flag 제어
- [x] 사용자 ID 기반 Feature Flag 제어
- [x] role 기반 Feature Flag 제어
- [x] rollout percentage 기반 점진적 노출
- [x] A/B 테스트 2개 구성
- [x] 사용자별 일관된 variant 할당
- [x] page view, user change, click 이벤트 추적
- [x] localStorage 기반 실험 로그 저장
- [x] Canary 1%-10%-50%-100% 설정
- [x] 헬스체크 기반 자동 롤백 시나리오 검증

---

## 18. 결론

Week 11 과제에서는 프런트엔드 앱에 Feature Flag와 A/B 테스트 로직을 도입하였다.

Feature Flag는 환경 변수, 사용자 ID, role, rollout percentage 기준으로 제어되며, A/B 테스트는 사용자 ID 기반 해시를 사용하여 동일 사용자가 항상 같은 variant에 할당되도록 구현하였다.

또한 이벤트 추적 로직을 추가하여 page view, 사용자 변경, CTA 클릭 이벤트를 localStorage와 console log에 기록하도록 하였다.

선택과제로 Canary 1%-10%-50%-100% 롤아웃 설정과 헬스체크 기반 자동 롤백 시나리오를 구성하고, 시뮬레이션 스크립트로 롤백 과정을 검증하였다.

---

**작성일:** 2026년 5월 26일  
**버전:** 1.0.0  
**상태:** 🟢 Feature Flag / A/B Test / Canary Rollout 구성 완료
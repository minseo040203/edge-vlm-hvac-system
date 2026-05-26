# Canary Rollout Simulation Log

- Service: edge-vlm-hvac-system
- Strategy: canary
- Environment: production
- Created At: 2026-05-26T12:44:43.022Z

## Rollout Results

| Stage | Traffic | Success Rate | Error Rate | P95 Latency | Result | Action |
|------|---------|--------------|------------|-------------|--------|--------|
| stage-1 | 1% | 99.5% | 0.5% | 420ms | PASS | continue |
| stage-2 | 10% | 98.4% | 1.6% | 620ms | PASS | continue |
| stage-3 | 50% | 94.1% | 5.9% | 1200ms | FAIL | rollback |

## Final Decision

Canary rollout stopped at stage-3.
Automatic rollback scenario was triggered because health check thresholds were not met.

## Rollback Policy

- Strategy: restore-previous-stable-version
- Notify: github-issue, actions-log
- Artifact: canary-rollout-report

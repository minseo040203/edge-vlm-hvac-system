import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  getCurrentUser,
  getFeatureFlagState,
  getExperimentAssignments,
  setDemoUser
} from "./featureFlags";
import {
  trackEvent,
  getExperimentEvents,
  clearExperimentEvents
} from "./experimentLogger";

function App() {
  const [user, setUser] = useState(getCurrentUser());
  const [events, setEvents] = useState(getExperimentEvents());

  const flags = useMemo(() => getFeatureFlagState(user), [user]);
  const experiments = useMemo(() => getExperimentAssignments(user), [user]);

  useEffect(() => {
    trackEvent("page_view", {
      user,
      flags,
      experiments
    });

    setEvents(getExperimentEvents());
  }, [user, flags, experiments]);

  const changeUser = (nextUser) => {
    setDemoUser(nextUser);
    setUser(nextUser);

    trackEvent("user_changed", {
      user: nextUser
    });

    setEvents(getExperimentEvents());
  };

  const trackClick = (target) => {
    trackEvent("cta_click", {
      target,
      user,
      flags,
      experiments
    });

    setEvents(getExperimentEvents());
  };

  const clearLogs = () => {
    clearExperimentEvents();
    setEvents([]);
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.badge}>Week 11 Feature Flags & Experiments</p>
        <h1 style={styles.title}>Edge VLM HVAC System</h1>
        <p style={styles.description}>
          Feature Flag, A/B 테스트, Canary Rollout 전략을 적용한 지능형 공조 제어 시스템 데모입니다.
        </p>
      </section>

      <section style={styles.card}>
        <h2>현재 사용자</h2>
        <p>
          <strong>ID:</strong> {user.id} / <strong>Role:</strong> {user.role} /{" "}
          <strong>Region:</strong> {user.region}
        </p>

        <div style={styles.buttonGroup}>
          <button
            style={styles.button}
            onClick={() =>
              changeUser({
                id: "minseo040203",
                email: "minseo040203@example.com",
                role: "admin",
                region: "KR"
              })
            }
          >
            Admin 사용자
          </button>

          <button
            style={styles.button}
            onClick={() =>
              changeUser({
                id: "operator-001",
                email: "operator@example.com",
                role: "operator",
                region: "KR"
              })
            }
          >
            Operator 사용자
          </button>

          <button
            style={styles.button}
            onClick={() =>
              changeUser({
                id: "guest-001",
                email: "guest@example.com",
                role: "guest",
                region: "KR"
              })
            }
          >
            Guest 사용자
          </button>
        </div>
      </section>

      <section style={styles.grid}>
        <div style={styles.card}>
          <h2>Feature Flags</h2>
          <ul>
            <li>
              HVAC Dashboard V2:{" "}
              <strong>{flags.hvacDashboardV2 ? "ON" : "OFF"}</strong>
            </li>
            <li>
              Energy Saving Tips:{" "}
              <strong>{flags.energySavingTips ? "ON" : "OFF"}</strong>
            </li>
            <li>
              VLM Insight Panel:{" "}
              <strong>{flags.vlmInsightPanel ? "ON" : "OFF"}</strong>
            </li>
          </ul>
        </div>

        <div style={styles.card}>
          <h2>A/B Test Assignments</h2>
          <ul>
            <li>
              Comfort Algorithm Card:{" "}
              <strong>{experiments.comfortAlgorithmCard}</strong>
            </li>
            <li>
              Dashboard Layout: <strong>{experiments.dashboardLayout}</strong>
            </li>
          </ul>
          <p style={styles.note}>
            사용자 ID 기반 해시를 사용하므로 같은 사용자는 항상 같은 variant에 할당됩니다.
          </p>
        </div>
      </section>

      {flags.hvacDashboardV2 ? (
        <section style={styles.card}>
          <h2>HVAC Dashboard V2</h2>
          <p>새로운 대시보드 UI가 Feature Flag에 의해 활성화되었습니다.</p>
          <button style={styles.primaryButton} onClick={() => trackClick("dashboard_v2")}>
            새 대시보드 확인
          </button>
        </section>
      ) : (
        <section style={styles.card}>
          <h2>Classic HVAC Dashboard</h2>
          <p>기존 대시보드 UI가 표시됩니다.</p>
        </section>
      )}

      <section style={styles.grid}>
        <div style={styles.card}>
          <h2>
            {experiments.comfortAlgorithmCard === "variantA"
              ? "AI 기반 쾌적도 최적화"
              : "쾌적도 알고리즘"}
          </h2>
          <p>
            {experiments.comfortAlgorithmCard === "variantA"
              ? "실시간 센서와 VLM 분석을 활용해 더 정밀한 HVAC 제어를 제공합니다."
              : "PMV 기반 쾌적도 계산으로 실내 환경을 제어합니다."}
          </p>
          <button style={styles.button} onClick={() => trackClick("comfort_card")}>
            자세히 보기
          </button>
        </div>

        <div style={styles.card}>
          <h2>
            {experiments.dashboardLayout === "compact"
              ? "Compact Layout"
              : "Classic Layout"}
          </h2>
          <p>
            {experiments.dashboardLayout === "compact"
              ? "핵심 지표를 압축적으로 보여주는 실험군 레이아웃입니다."
              : "기존 카드형 레이아웃입니다."}
          </p>
        </div>
      </section>

      {flags.energySavingTips && (
        <section style={styles.card}>
          <h2>에너지 절감 추천</h2>
          <p>현재 실내 조건에서는 목표 온도를 1도 조정하면 에너지 사용량을 줄일 수 있습니다.</p>
        </section>
      )}

      {flags.vlmInsightPanel && (
        <section style={styles.card}>
          <h2>VLM Insight Panel</h2>
          <p>관리자 대상 사용자에게만 활성화되는 VLM 분석 인사이트 패널입니다.</p>
        </section>
      )}

      <section style={styles.card}>
        <h2>Experiment Event Log</h2>
        <button style={styles.button} onClick={clearLogs}>
          로그 초기화
        </button>
        <pre style={styles.logBox}>
          {JSON.stringify(events.slice(-10), null, 2)}
        </pre>
      </section>
    </main>
  );
}

const styles = {
  page: {
    fontFamily: "system-ui, sans-serif",
    padding: "40px",
    maxWidth: "1100px",
    margin: "0 auto",
    color: "#111827",
    lineHeight: 1.6
  },
  hero: {
    marginBottom: "28px"
  },
  badge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#3730a3",
    fontWeight: 700,
    fontSize: "14px"
  },
  title: {
    fontSize: "42px",
    margin: "12px 0"
  },
  description: {
    fontSize: "18px",
    color: "#4b5563"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
    marginBottom: "16px"
  },
  card: {
    padding: "20px",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    marginBottom: "16px",
    background: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)"
  },
  buttonGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "12px"
  },
  button: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    cursor: "pointer"
  },
  primaryButton: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer"
  },
  note: {
    color: "#6b7280",
    fontSize: "14px"
  },
  logBox: {
    marginTop: "12px",
    padding: "16px",
    background: "#111827",
    color: "#f9fafb",
    borderRadius: "12px",
    overflowX: "auto",
    fontSize: "12px"
  }
};

createRoot(document.getElementById("root")).render(<App />);
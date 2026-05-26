import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <main style={{
      fontFamily: "system-ui, sans-serif",
      padding: "40px",
      maxWidth: "900px",
      margin: "0 auto",
      lineHeight: 1.6
    }}>
      <h1>Edge VLM HVAC System</h1>
      <p>
        Edge VLM + IoT 기반 지능형 공조 제어 시스템의 프런트엔드 배포 페이지입니다.
      </p>

      <section style={{
        marginTop: "24px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "12px"
      }}>
        <h2>CI/CD Status</h2>
        <ul>
          <li>npm package publish: enabled</li>
          <li>Docker build & push: enabled</li>
          <li>Security scan: enabled</li>
          <li>Dependabot automation: enabled</li>
          <li>Frontend deployment: Vercel</li>
        </ul>
      </section>

      <section style={{
        marginTop: "24px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "12px"
      }}>
        <h2>Health Check</h2>
        <p>Status: OK - Deployed</p>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
// force frontend workflow run

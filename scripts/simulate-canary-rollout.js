import fs from "fs";

const configPath = "config/canary-rollout.json";
const reportPath = "week11/canary-rollout-log.md";

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

const simulatedMetrics = {
  "stage-1": {
    successRate: 99.5,
    errorRate: 0.5,
    p95LatencyMs: 420
  },
  "stage-2": {
    successRate: 98.4,
    errorRate: 1.6,
    p95LatencyMs: 620
  },
  "stage-3": {
    successRate: 94.1,
    errorRate: 5.9,
    p95LatencyMs: 1200
  },
  "stage-4": {
    successRate: 0,
    errorRate: 100,
    p95LatencyMs: 0
  }
};

function evaluateStage(stage, metrics) {
  const health = stage.healthCheck;

  const passed =
    metrics.successRate >= health.successRateThreshold &&
    metrics.errorRate <= health.maxErrorRate &&
    metrics.p95LatencyMs <= health.maxP95LatencyMs;

  return {
    stage: stage.name,
    trafficPercentage: stage.trafficPercentage,
    metrics,
    healthCheck: health,
    passed,
    action: passed ? "continue" : "rollback"
  };
}

function runSimulation() {
  const results = [];

  for (const stage of config.stages) {
    const metrics = simulatedMetrics[stage.name];
    const result = evaluateStage(stage, metrics);

    results.push(result);

    if (!result.passed && stage.rollbackOnFailure) {
      break;
    }
  }

  return results;
}

function createMarkdownReport(results) {
  const lines = [];

  lines.push("# Canary Rollout Simulation Log");
  lines.push("");
  lines.push(`- Service: ${config.service}`);
  lines.push(`- Strategy: ${config.strategy}`);
  lines.push(`- Environment: ${config.environment}`);
  lines.push(`- Created At: ${new Date().toISOString()}`);
  lines.push("");

  lines.push("## Rollout Results");
  lines.push("");

  lines.push("| Stage | Traffic | Success Rate | Error Rate | P95 Latency | Result | Action |");
  lines.push("|------|---------|--------------|------------|-------------|--------|--------|");

  for (const result of results) {
    lines.push(
      `| ${result.stage} | ${result.trafficPercentage}% | ${result.metrics.successRate}% | ${result.metrics.errorRate}% | ${result.metrics.p95LatencyMs}ms | ${result.passed ? "PASS" : "FAIL"} | ${result.action} |`
    );
  }

  const lastResult = results[results.length - 1];

  lines.push("");
  lines.push("## Final Decision");
  lines.push("");

  if (lastResult.passed) {
    lines.push("Canary rollout completed successfully.");
  } else {
    lines.push(`Canary rollout stopped at ${lastResult.stage}.`);
    lines.push("Automatic rollback scenario was triggered because health check thresholds were not met.");
  }

  lines.push("");
  lines.push("## Rollback Policy");
  lines.push("");
  lines.push(`- Strategy: ${config.rollback.strategy}`);
  lines.push(`- Notify: ${config.rollback.notify.join(", ")}`);
  lines.push(`- Artifact: ${config.rollback.artifact}`);
  lines.push("");

  return lines.join("\n");
}

const results = runSimulation();
const report = createMarkdownReport(results);

fs.mkdirSync("week11", { recursive: true });
fs.writeFileSync(reportPath, report);

console.log(report);
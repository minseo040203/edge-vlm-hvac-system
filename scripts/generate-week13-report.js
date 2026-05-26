import fs from "fs";

const feedbackPath = "experiments/week13/user-personas-feedback.json";
const metricsPath = "experiments/week13/ab-test-metrics.json";
const outputPath = "experiments/week13/generated-report.md";

const feedback = JSON.parse(fs.readFileSync(feedbackPath, "utf8"));
const metrics = JSON.parse(fs.readFileSync(metricsPath, "utf8"));

function createReport() {
  const lines = [];

  lines.push("# Generated Week 13 Experiment Report");
  lines.push("");
  lines.push(`- Experiment: ${metrics.experiment.name}`);
  lines.push(`- Period: ${metrics.experiment.period.start} ~ ${metrics.experiment.period.end}`);
  lines.push(`- Feature Flag: ${metrics.experiment.featureFlag}`);
  lines.push(`- Total Persona Feedback: ${feedback.summary.totalUsers}`);
  lines.push(`- Average Rating: ${feedback.summary.averageRating} / 5.0`);
  lines.push("");

  lines.push("## A/B Test Impact");
  lines.push("");
  lines.push("| Metric | Impact |");
  lines.push("|------|--------|");
  lines.push(`| Task Completion Rate | ${metrics.calculatedImpact.taskCompletionRateLift} |`);
  lines.push(`| CTA Click Rate | ${metrics.calculatedImpact.ctaClickRateLift} |`);
  lines.push(`| Feedback Rating | ${metrics.calculatedImpact.feedbackRatingLift} |`);
  lines.push(`| Session Duration | ${metrics.calculatedImpact.sessionDurationChange} |`);
  lines.push("");

  lines.push("## Positive Feedback Patterns");
  lines.push("");
  for (const item of feedback.summary.keyPositivePatterns) {
    lines.push(`- ${item}`);
  }

  lines.push("");
  lines.push("## Negative Feedback Patterns");
  lines.push("");
  for (const item of feedback.summary.keyNegativePatterns) {
    lines.push(`- ${item}`);
  }

  lines.push("");
  lines.push("## Recommendation");
  lines.push("");
  lines.push(metrics.interpretation.recommendation);
  lines.push("");

  fs.writeFileSync(outputPath, lines.join("\n"), "utf8");
}

createReport();

console.log(`Generated report: ${outputPath}`);
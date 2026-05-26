import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getCurrentUser,
  getFeatureFlagState,
  getExperimentVariant,
  getExperimentAssignments,
  isFeatureEnabled,
  setDemoUser
} from "../../src/featureFlags";

describe("featureFlags", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", "/");
    vi.restoreAllMocks();
  });

  it("returns default guest user", () => {
    expect(getCurrentUser()).toMatchObject({
      id: "guest-user",
      role: "guest",
      region: "KR"
    });
  });

  it("reads user from query string", () => {
    window.history.pushState(
      {},
      "",
      "/?user=minseo040203&email=test@example.com&role=admin&region=KR"
    );

    expect(getCurrentUser()).toMatchObject({
      id: "minseo040203",
      email: "test@example.com",
      role: "admin",
      region: "KR"
    });
  });

  it("stores and reads demo user from localStorage", () => {
    setDemoUser({
      id: "operator-001",
      email: "operator@example.com",
      role: "operator",
      region: "KR"
    });

    expect(getCurrentUser()).toMatchObject({
      id: "operator-001",
      role: "operator"
    });
  });

  it("enables target user feature when flag is enabled by default", () => {
    const enabled = isFeatureEnabled("hvacDashboardV2", {
      id: "minseo040203",
      email: "minseo040203@example.com",
      role: "admin",
      region: "KR"
    });

    expect(enabled).toBe(true);
  });

  it("keeps disabled feature off when environment/default flag is disabled", () => {
    const enabled = isFeatureEnabled("vlmInsightPanel", {
      id: "guest-001",
      email: "guest@example.com",
      role: "guest",
      region: "KR"
    });

    expect(enabled).toBe(false);
  });

  it("returns complete feature flag state", () => {
    const state = getFeatureFlagState({
      id: "minseo040203",
      email: "minseo040203@example.com",
      role: "admin",
      region: "KR"
    });

    expect(state).toHaveProperty("hvacDashboardV2");
    expect(state).toHaveProperty("energySavingTips");
    expect(state).toHaveProperty("vlmInsightPanel");
  });

  it("assigns stable experiment variant for same user", () => {
    const user = {
      id: "stable-user",
      email: "stable@example.com",
      role: "operator",
      region: "KR"
    };

    const first = getExperimentVariant("dashboardLayout", user);
    const second = getExperimentVariant("dashboardLayout", user);

    expect(first).toBe(second);
  });

  it("returns assignments for all experiments", () => {
    const assignments = getExperimentAssignments({
      id: "minseo040203",
      email: "minseo040203@example.com",
      role: "admin",
      region: "KR"
    });

    expect(assignments).toHaveProperty("comfortAlgorithmCard");
    expect(assignments).toHaveProperty("dashboardLayout");
  });
});
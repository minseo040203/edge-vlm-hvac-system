import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearExperimentEvents,
  getExperimentEvents,
  trackEvent
} from "../../src/experimentLogger";

describe("experimentLogger", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("tracks experiment event into localStorage", () => {
    const event = trackEvent("page_view", {
      userId: "minseo040203",
      variant: "control"
    });

    expect(event.eventName).toBe("page_view");
    expect(event.payload.userId).toBe("minseo040203");

    const events = getExperimentEvents();

    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe("page_view");
  });

  it("appends multiple events", () => {
    trackEvent("page_view", { userId: "user-1" });
    trackEvent("cta_click", { target: "dashboard" });

    const events = getExperimentEvents();

    expect(events).toHaveLength(2);
    expect(events[1].eventName).toBe("cta_click");
  });

  it("clears experiment events", () => {
    trackEvent("page_view", { userId: "user-1" });

    clearExperimentEvents();

    expect(getExperimentEvents()).toEqual([]);
  });
});
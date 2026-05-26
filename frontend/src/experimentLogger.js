const STORAGE_KEY = "edge_vlm_hvac_experiment_events";

export function trackEvent(eventName, payload = {}) {
  const event = {
    eventName,
    payload,
    timestamp: new Date().toISOString()
  };

  const previousEvents = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const nextEvents = [...previousEvents, event];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEvents, null, 2));

  console.log("[experiment-event]", event);

  return event;
}

export function getExperimentEvents() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function clearExperimentEvents() {
  localStorage.removeItem(STORAGE_KEY);
}
const DEFAULT_USER = {
  id: "guest-user",
  email: "guest@example.com",
  role: "guest",
  region: "KR"
};

const FEATURE_FLAGS = {
  hvacDashboardV2: {
    description: "새로운 HVAC 대시보드 UI 활성화",
    envKey: "VITE_FLAG_HVAC_DASHBOARD_V2",
    defaultEnabled: true,
    targetRoles: ["admin", "operator"],
    targetUsers: ["minseo040203", "demo-user"],
    rolloutPercentage: 100
  },
  energySavingTips: {
    description: "에너지 절감 추천 카드 활성화",
    envKey: "VITE_FLAG_ENERGY_SAVING_TIPS",
    defaultEnabled: true,
    targetRoles: ["admin", "operator", "guest"],
    targetUsers: [],
    rolloutPercentage: 80
  },
  vlmInsightPanel: {
    description: "VLM 분석 인사이트 패널 활성화",
    envKey: "VITE_FLAG_VLM_INSIGHT_PANEL",
    defaultEnabled: false,
    targetRoles: ["admin"],
    targetUsers: ["minseo040203"],
    rolloutPercentage: 30
  }
};

const AB_EXPERIMENTS = {
  comfortAlgorithmCard: {
    key: "comfortAlgorithmCard",
    description: "쾌적도 알고리즘 카드 문구 A/B 테스트",
    variants: ["control", "variantA"],
    trafficPercentage: 100
  },
  dashboardLayout: {
    key: "dashboardLayout",
    description: "대시보드 레이아웃 A/B 테스트",
    variants: ["classic", "compact"],
    trafficPercentage: 100
  }
};

function readEnvBoolean(envKey, fallback) {
  const value = import.meta.env[envKey];

  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return value === "true" || value === "1" || value === "yes";
}

function hashString(input) {
  let hash = 0;

  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

function getUserBucket(userId, salt = "") {
  const hash = hashString(`${userId}:${salt}`);
  return hash % 100;
}

export function getCurrentUser() {
  const params = new URLSearchParams(window.location.search);

  return {
    id: params.get("user") || localStorage.getItem("demo_user_id") || DEFAULT_USER.id,
    email: params.get("email") || localStorage.getItem("demo_user_email") || DEFAULT_USER.email,
    role: params.get("role") || localStorage.getItem("demo_user_role") || DEFAULT_USER.role,
    region: params.get("region") || localStorage.getItem("demo_user_region") || DEFAULT_USER.region
  };
}

export function setDemoUser(user) {
  localStorage.setItem("demo_user_id", user.id);
  localStorage.setItem("demo_user_email", user.email);
  localStorage.setItem("demo_user_role", user.role);
  localStorage.setItem("demo_user_region", user.region);
}

export function isFeatureEnabled(flagName, user = getCurrentUser()) {
  const flag = FEATURE_FLAGS[flagName];

  if (!flag) {
    return false;
  }

  const envEnabled = readEnvBoolean(flag.envKey, flag.defaultEnabled);

  if (!envEnabled) {
    return false;
  }

  const isTargetUser = flag.targetUsers.includes(user.id);
  const isTargetRole = flag.targetRoles.includes(user.role);
  const isInRollout = getUserBucket(user.id, flagName) < flag.rolloutPercentage;

  return isTargetUser || (isTargetRole && isInRollout);
}

export function getFeatureFlagState(user = getCurrentUser()) {
  return Object.keys(FEATURE_FLAGS).reduce((acc, flagName) => {
    acc[flagName] = isFeatureEnabled(flagName, user);
    return acc;
  }, {});
}

export function getExperimentVariant(experimentKey, user = getCurrentUser()) {
  const experiment = AB_EXPERIMENTS[experimentKey];

  if (!experiment) {
    return "unknown";
  }

  const bucket = getUserBucket(user.id, experimentKey);

  if (bucket >= experiment.trafficPercentage) {
    return "excluded";
  }

  const variantIndex = bucket % experiment.variants.length;
  return experiment.variants[variantIndex];
}

export function getExperimentAssignments(user = getCurrentUser()) {
  return Object.keys(AB_EXPERIMENTS).reduce((acc, experimentKey) => {
    acc[experimentKey] = getExperimentVariant(experimentKey, user);
    return acc;
  }, {});
}

export { FEATURE_FLAGS, AB_EXPERIMENTS };
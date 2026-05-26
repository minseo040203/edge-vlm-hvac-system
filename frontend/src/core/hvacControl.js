const MIN_TARGET_TEMPERATURE = 18;
const MAX_TARGET_TEMPERATURE = 30;

export function validateSensorData(sensorData) {
  if (!sensorData || typeof sensorData !== "object") {
    return {
      valid: false,
      reason: "sensor data is required"
    };
  }

  const requiredFields = ["temperature", "humidity", "occupancy", "co2"];

  for (const field of requiredFields) {
    if (sensorData[field] === undefined || sensorData[field] === null) {
      return {
        valid: false,
        reason: `${field} is required`
      };
    }
  }

  if (sensorData.temperature < -20 || sensorData.temperature > 60) {
    return {
      valid: false,
      reason: "temperature is out of range"
    };
  }

  if (sensorData.humidity < 0 || sensorData.humidity > 100) {
    return {
      valid: false,
      reason: "humidity is out of range"
    };
  }

  if (sensorData.occupancy < 0) {
    return {
      valid: false,
      reason: "occupancy must be positive"
    };
  }

  if (sensorData.co2 < 0) {
    return {
      valid: false,
      reason: "co2 must be positive"
    };
  }

  return {
    valid: true,
    reason: "ok"
  };
}

export function clampTemperature(targetTemperature) {
  if (Number.isNaN(Number(targetTemperature))) {
    return 24;
  }

  return Math.min(
    MAX_TARGET_TEMPERATURE,
    Math.max(MIN_TARGET_TEMPERATURE, Number(targetTemperature))
  );
}

export function calculatePmvScore(sensorData) {
  const validation = validateSensorData(sensorData);

  if (!validation.valid) {
    throw new Error(validation.reason);
  }

  const temperatureScore = (sensorData.temperature - 24) * 0.35;
  const humidityScore = (sensorData.humidity - 50) * 0.015;
  const occupancyScore = Math.min(sensorData.occupancy, 20) * 0.02;
  const co2Score = sensorData.co2 > 1000 ? 0.25 : 0;

  const pmv = temperatureScore + humidityScore + occupancyScore + co2Score;

  return Number(pmv.toFixed(2));
}

export function determineHvacMode(sensorData, targetTemperature = 24) {
  const validation = validateSensorData(sensorData);

  if (!validation.valid) {
    throw new Error(validation.reason);
  }

  const target = clampTemperature(targetTemperature);

  if (sensorData.occupancy === 0) {
    return "standby";
  }

  if (sensorData.temperature >= target + 1) {
    return "cooling";
  }

  if (sensorData.temperature <= target - 1) {
    return "heating";
  }

  if (sensorData.co2 >= 1200) {
    return "ventilation";
  }

  return "comfort";
}

export function calculateEnergySavingScore(sensorData, targetTemperature = 24) {
  const validation = validateSensorData(sensorData);

  if (!validation.valid) {
    throw new Error(validation.reason);
  }

  const target = clampTemperature(targetTemperature);
  const occupancyFactor = sensorData.occupancy === 0 ? 40 : 0;
  const temperatureGap = Math.abs(sensorData.temperature - target);
  const temperatureFactor = Math.max(0, 30 - temperatureGap * 6);
  const co2Penalty = sensorData.co2 > 1200 ? 10 : 0;

  const score = occupancyFactor + temperatureFactor - co2Penalty;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function generateControlRecommendation(sensorData, targetTemperature = 24) {
  const mode = determineHvacMode(sensorData, targetTemperature);
  const pmvScore = calculatePmvScore(sensorData);
  const energySavingScore = calculateEnergySavingScore(sensorData, targetTemperature);

  const messages = {
    standby: "공간이 비어 있어 절전 대기 모드를 권장합니다.",
    cooling: "현재 온도가 높아 냉방 운전을 권장합니다.",
    heating: "현재 온도가 낮아 난방 운전을 권장합니다.",
    ventilation: "CO2 농도가 높아 환기를 권장합니다.",
    comfort: "현재 실내 환경이 목표 쾌적 범위에 있습니다."
  };

  return {
    mode,
    pmvScore,
    energySavingScore,
    targetTemperature: clampTemperature(targetTemperature),
    message: messages[mode]
  };
}
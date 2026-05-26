import { describe, expect, it } from "vitest";
import {
  validateSensorData,
  clampTemperature,
  calculatePmvScore,
  determineHvacMode,
  calculateEnergySavingScore,
  generateControlRecommendation
} from "../../src/core/hvacControl";

describe("hvacControl TDD core functions", () => {
  const normalSensorData = {
    temperature: 24,
    humidity: 50,
    occupancy: 3,
    co2: 700
  };

  describe("validateSensorData", () => {
    it("validates normal sensor data", () => {
      expect(validateSensorData(normalSensorData)).toEqual({
        valid: true,
        reason: "ok"
      });
    });

    it("rejects missing required field", () => {
      expect(validateSensorData({ temperature: 24 })).toEqual({
        valid: false,
        reason: "humidity is required"
      });
    });

    it("rejects out of range humidity", () => {
      expect(
        validateSensorData({
          temperature: 24,
          humidity: 120,
          occupancy: 3,
          co2: 700
        })
      ).toEqual({
        valid: false,
        reason: "humidity is out of range"
      });
    });
  });

  describe("clampTemperature", () => {
    it("clamps low temperature to minimum", () => {
      expect(clampTemperature(10)).toBe(18);
    });

    it("clamps high temperature to maximum", () => {
      expect(clampTemperature(40)).toBe(30);
    });

    it("returns valid temperature as-is", () => {
      expect(clampTemperature(24)).toBe(24);
    });

    it("returns default temperature for invalid input", () => {
      expect(clampTemperature("invalid")).toBe(24);
    });
  });

  describe("calculatePmvScore", () => {
    it("calculates pmv score for normal condition", () => {
      expect(calculatePmvScore(normalSensorData)).toBe(0.06);
    });

    it("increases score for high temperature", () => {
      const score = calculatePmvScore({
        temperature: 28,
        humidity: 60,
        occupancy: 5,
        co2: 900
      });

      expect(score).toBeGreaterThan(1);
    });

    it("throws error for invalid sensor data", () => {
      expect(() => calculatePmvScore(null)).toThrow("sensor data is required");
    });
  });

  describe("determineHvacMode", () => {
    it("returns standby when no occupancy exists", () => {
      expect(
        determineHvacMode({
          temperature: 24,
          humidity: 50,
          occupancy: 0,
          co2: 700
        })
      ).toBe("standby");
    });

    it("returns cooling when current temperature is higher than target", () => {
      expect(
        determineHvacMode({
          temperature: 27,
          humidity: 50,
          occupancy: 3,
          co2: 700
        }, 24)
      ).toBe("cooling");
    });

    it("returns heating when current temperature is lower than target", () => {
      expect(
        determineHvacMode({
          temperature: 20,
          humidity: 50,
          occupancy: 3,
          co2: 700
        }, 24)
      ).toBe("heating");
    });

    it("returns ventilation when co2 is high", () => {
      expect(
        determineHvacMode({
          temperature: 24,
          humidity: 50,
          occupancy: 3,
          co2: 1300
        }, 24)
      ).toBe("ventilation");
    });

    it("returns comfort when conditions are normal", () => {
      expect(determineHvacMode(normalSensorData, 24)).toBe("comfort");
    });
  });

  describe("calculateEnergySavingScore", () => {
    it("returns score between 0 and 100", () => {
      const score = calculateEnergySavingScore(normalSensorData, 24);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("increases score when occupancy is zero", () => {
      const occupied = calculateEnergySavingScore(normalSensorData, 24);
      const empty = calculateEnergySavingScore({
        temperature: 24,
        humidity: 50,
        occupancy: 0,
        co2: 700
      }, 24);

      expect(empty).toBeGreaterThan(occupied);
    });
  });

  describe("generateControlRecommendation", () => {
    it("generates complete recommendation object", () => {
      const recommendation = generateControlRecommendation(normalSensorData, 24);

      expect(recommendation).toMatchObject({
        mode: "comfort",
        targetTemperature: 24
      });

      expect(recommendation.message).toContain("쾌적");
      expect(recommendation.pmvScore).toBeTypeOf("number");
      expect(recommendation.energySavingScore).toBeTypeOf("number");
    });

    it("generates cooling recommendation", () => {
      const recommendation = generateControlRecommendation({
        temperature: 29,
        humidity: 55,
        occupancy: 5,
        co2: 850
      }, 24);

      expect(recommendation.mode).toBe("cooling");
      expect(recommendation.message).toContain("냉방");
    });
  });
});
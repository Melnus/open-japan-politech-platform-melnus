import { describe, expect, it } from "vitest";
import { aggregateField, currentIntensity, type PheromoneState, reinforce } from "../pheromone";

describe("pheromone", () => {
  const baseState: PheromoneState = {
    intensity: 1.0,
    quality: 0.8,
    decayRate: 0.01,
    lastUpdated: 0,
  };

  describe("currentIntensity", () => {
    it("returns initial intensity at t=0", () => {
      expect(currentIntensity(baseState, 0)).toBeCloseTo(1.0);
    });

    it("decays exponentially over time", () => {
      // 1 hour later
      const oneHourMs = 1000 * 60 * 60;
      const result = currentIntensity(baseState, oneHourMs);
      // I(1) = 1.0 * exp(-0.01 * 1) ≈ 0.99005
      expect(result).toBeCloseTo(0.99005, 3);
    });

    it("decays significantly over long time", () => {
      const hundredHoursMs = 100 * 1000 * 60 * 60;
      const result = currentIntensity(baseState, hundredHoursMs);
      // I(100) = 1.0 * exp(-0.01 * 100) = exp(-1) ≈ 0.3679
      expect(result).toBeCloseTo(0.3679, 3);
    });
  });

  describe("reinforce", () => {
    it("increases intensity on support", () => {
      const oneHourMs = 1000 * 60 * 60;
      const reinforced = reinforce(baseState, 1.0, oneHourMs);
      // current ≈ 0.99005 + 0.8 * 1.0 = 1.79005
      expect(reinforced.intensity).toBeGreaterThan(1.5);
      expect(reinforced.lastUpdated).toBe(oneHourMs);
    });

    it("scales reinforcement by weight", () => {
      const r1 = reinforce(baseState, 1.0, 0);
      const r2 = reinforce(baseState, 2.0, 0);
      expect(r2.intensity).toBeGreaterThan(r1.intensity);
    });
  });

  describe("aggregateField", () => {
    it("returns zeros for empty array", () => {
      const result = aggregateField([], 0);
      expect(result).toEqual({ total: 0, avg: 0, max: 0 });
    });

    it("computes correct aggregates", () => {
      const states: PheromoneState[] = [
        { ...baseState, intensity: 2.0 },
        { ...baseState, intensity: 4.0 },
      ];
      const result = aggregateField(states, 0);
      expect(result.total).toBeCloseTo(6.0);
      expect(result.avg).toBeCloseTo(3.0);
      expect(result.max).toBeCloseTo(4.0);
    });
  });
});

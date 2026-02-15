import { describe, expect, it } from "vitest";
import { calculateFitness, landscapeStats, rankByFitness } from "../fitness";

describe("fitness", () => {
  describe("calculateFitness", () => {
    it("returns positive score for typical params", () => {
      const score = calculateFitness({
        supportCount: 5,
        argumentStrength: 0.8,
        rebuttalCount: 1,
        ageHours: 10,
        pheromoneIntensity: 1.0,
      });
      expect(score).toBeGreaterThan(0);
    });

    it("returns 0 for zero support", () => {
      const score = calculateFitness({
        supportCount: 0,
        argumentStrength: 0.8,
        rebuttalCount: 0,
        ageHours: 1,
        pheromoneIntensity: 1.0,
      });
      // ln(1+0) = 0 → fitness = 0
      expect(score).toBe(0);
    });

    it("increases with more support", () => {
      const base = {
        argumentStrength: 0.7,
        rebuttalCount: 0,
        ageHours: 5,
        pheromoneIntensity: 0.5,
      };
      const low = calculateFitness({ ...base, supportCount: 1 });
      const high = calculateFitness({ ...base, supportCount: 10 });
      expect(high).toBeGreaterThan(low);
    });

    it("decreases with more rebuttals", () => {
      const base = {
        supportCount: 5,
        argumentStrength: 0.8,
        ageHours: 5,
        pheromoneIntensity: 1.0,
      };
      const noRebuttal = calculateFitness({ ...base, rebuttalCount: 0 });
      const manyRebuttals = calculateFitness({ ...base, rebuttalCount: 5 });
      expect(manyRebuttals).toBeLessThan(noRebuttal);
    });

    it("decreases over time", () => {
      const base = {
        supportCount: 5,
        argumentStrength: 0.8,
        rebuttalCount: 0,
        pheromoneIntensity: 1.0,
      };
      const fresh = calculateFitness({ ...base, ageHours: 1 });
      const old = calculateFitness({ ...base, ageHours: 200 });
      expect(old).toBeLessThan(fresh);
    });
  });

  describe("rankByFitness", () => {
    it("returns indices sorted by descending fitness", () => {
      const result = rankByFitness([0.1, 0.5, 0.3]);
      expect(result).toEqual([1, 2, 0]);
    });

    it("handles empty array", () => {
      expect(rankByFitness([])).toEqual([]);
    });
  });

  describe("landscapeStats", () => {
    it("returns zeros for empty array", () => {
      const stats = landscapeStats([]);
      expect(stats.mean).toBe(0);
      expect(stats.giniCoefficient).toBe(0);
    });

    it("computes correct mean and variance", () => {
      const stats = landscapeStats([1, 2, 3]);
      expect(stats.mean).toBe(2);
      expect(stats.min).toBe(1);
      expect(stats.max).toBe(3);
      expect(stats.variance).toBeCloseTo(2 / 3, 5);
    });

    it("gini is 0 for equal values", () => {
      const stats = landscapeStats([5, 5, 5, 5]);
      expect(stats.giniCoefficient).toBeCloseTo(0);
    });
  });
});

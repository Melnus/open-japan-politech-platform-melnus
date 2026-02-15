import { describe, expect, it } from "vitest";
import {
  convergenceScore,
  determinePhase,
  type QuorumState,
  shannonDiversity,
  shannonEvenness,
} from "../quorum";

describe("quorum", () => {
  describe("shannonDiversity", () => {
    it("returns 0 for single cluster", () => {
      expect(shannonDiversity([10])).toBe(0);
    });

    it("returns 0 for empty array", () => {
      expect(shannonDiversity([])).toBe(0);
    });

    it("is maximized for equal-sized clusters", () => {
      const equal = shannonDiversity([10, 10, 10]);
      const unequal = shannonDiversity([25, 3, 2]);
      expect(equal).toBeGreaterThan(unequal);
    });

    it("returns ln(k) for perfectly even k clusters", () => {
      const H = shannonDiversity([10, 10]);
      expect(H).toBeCloseTo(Math.log(2), 5);
    });
  });

  describe("shannonEvenness", () => {
    it("returns 1 for single cluster", () => {
      expect(shannonEvenness([10])).toBe(1);
    });

    it("returns 1 for perfectly even clusters", () => {
      expect(shannonEvenness([10, 10, 10])).toBeCloseTo(1, 5);
    });

    it("returns less than 1 for uneven clusters", () => {
      expect(shannonEvenness([90, 5, 5])).toBeLessThan(1);
    });
  });

  describe("convergenceScore", () => {
    it("returns 0 for empty clusters", () => {
      expect(convergenceScore([])).toBe(0);
    });

    it("returns 1 for single cluster", () => {
      expect(convergenceScore([10])).toBe(1);
    });

    it("returns correct fraction for multiple clusters", () => {
      expect(convergenceScore([6, 3, 1])).toBeCloseTo(0.6);
    });
  });

  describe("determinePhase", () => {
    it("stays OPEN with few opinions", () => {
      const state: QuorumState = {
        phase: "OPEN",
        totalOpinions: 3,
        totalSupports: 1,
        clusterSizes: [3],
        avgPheromone: 0.5,
        convergenceScore: 0.5,
      };
      expect(determinePhase(state, 0.6)).toBe("OPEN");
    });

    it("transitions to DELIBERATION with enough opinions and supports", () => {
      const state: QuorumState = {
        phase: "OPEN",
        totalOpinions: 15,
        totalSupports: 10,
        clusterSizes: [5, 5, 5],
        avgPheromone: 1.0,
        convergenceScore: 0.33,
      };
      expect(determinePhase(state, 0.6)).toBe("DELIBERATION");
    });

    it("stays CLOSED once closed", () => {
      const state: QuorumState = {
        phase: "CLOSED",
        totalOpinions: 50,
        totalSupports: 40,
        clusterSizes: [40, 5, 5],
        avgPheromone: 3.0,
        convergenceScore: 0.8,
      };
      expect(determinePhase(state, 0.6)).toBe("CLOSED");
    });
  });
});

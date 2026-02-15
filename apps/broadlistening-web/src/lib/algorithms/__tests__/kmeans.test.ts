import { describe, expect, it } from "vitest";
import { autoKMeans, findOptimalK, kmeans } from "../kmeans";

describe("kmeans", () => {
  describe("kmeans", () => {
    it("handles empty input", () => {
      const result = kmeans([], 3);
      expect(result.assignments).toEqual([]);
      expect(result.centroids).toEqual([]);
    });

    it("assigns all points to one cluster when k=1", () => {
      const points = [
        [1, 0],
        [2, 0],
        [3, 0],
      ];
      const result = kmeans(points, 1);
      expect(result.assignments).toEqual([0, 0, 0]);
      expect(result.k).toBe(1);
    });

    it("correctly separates two obvious clusters", () => {
      const points = [
        [0, 0],
        [0.1, 0.1],
        [0.2, 0], // cluster A
        [10, 10],
        [10.1, 10.1],
        [10.2, 10], // cluster B
      ];
      const result = kmeans(points, 2);
      // First 3 should be in same cluster, last 3 in another
      expect(result.assignments[0]).toBe(result.assignments[1]);
      expect(result.assignments[1]).toBe(result.assignments[2]);
      expect(result.assignments[3]).toBe(result.assignments[4]);
      expect(result.assignments[4]).toBe(result.assignments[5]);
      expect(result.assignments[0]).not.toBe(result.assignments[3]);
    });

    it("handles k >= n points", () => {
      const points = [
        [1, 0],
        [2, 0],
      ];
      const result = kmeans(points, 5);
      // Should gracefully handle
      expect(result.assignments.length).toBe(2);
    });

    it("produces correct number of centroids", () => {
      const points = [
        [0, 0],
        [1, 0],
        [2, 0],
        [10, 0],
        [11, 0],
        [12, 0],
      ];
      const result = kmeans(points, 2);
      expect(result.centroids.length).toBe(2);
    });
  });

  describe("findOptimalK", () => {
    it("returns 1 for very few points", () => {
      expect(findOptimalK([[1, 0]])).toBe(1);
      expect(
        findOptimalK([
          [1, 0],
          [2, 0],
        ]),
      ).toBe(1);
    });

    it("finds reasonable k for obvious clusters", () => {
      const points = [
        [0, 0],
        [0.1, 0.1],
        [0.2, 0],
        [10, 10],
        [10.1, 10.1],
        [10.2, 10],
        [20, 0],
        [20.1, 0.1],
        [20.2, 0],
      ];
      const k = findOptimalK(points);
      // Should find 2-4 clusters for 3 obvious groups
      expect(k).toBeGreaterThanOrEqual(2);
      expect(k).toBeLessThanOrEqual(5);
    });
  });

  describe("autoKMeans", () => {
    it("returns valid result", () => {
      const points = [
        [0, 0],
        [1, 0],
        [2, 0],
        [10, 10],
        [11, 10],
        [12, 10],
      ];
      const result = autoKMeans(points);
      expect(result.assignments.length).toBe(6);
      expect(result.k).toBeGreaterThanOrEqual(1);
      expect(result.centroids.length).toBe(result.k);
    });
  });
});

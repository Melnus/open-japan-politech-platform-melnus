// Fitness landscape for opinion ecosystem
// fitness = robustness * ln(1 + support) * persistence

export interface FitnessParams {
  supportCount: number;
  argumentStrength: number; // avg confidence of arguments (0-1)
  rebuttalCount: number;
  ageHours: number;
  pheromoneIntensity: number;
}

/** Calculate opinion fitness score */
export function calculateFitness(params: FitnessParams): number {
  const { supportCount, argumentStrength, rebuttalCount, ageHours, pheromoneIntensity } = params;

  // Robustness: argument strength penalized by unaddressed rebuttals
  const robustness = argumentStrength * (1 / (1 + 0.3 * rebuttalCount));

  // Support factor: logarithmic growth to prevent runaway
  const supportFactor = Math.log(1 + supportCount);

  // Persistence: slow decay with age, boosted by pheromone
  const persistence = Math.exp(-0.005 * ageHours) * (1 + 0.5 * pheromoneIntensity);

  return robustness * supportFactor * persistence;
}

/** Rank opinions by fitness, return sorted indices */
export function rankByFitness(fitnesses: number[]): number[] {
  return fitnesses
    .map((f, i) => ({ fitness: f, index: i }))
    .sort((a, b) => b.fitness - a.fitness)
    .map((item) => item.index);
}

/** Calculate fitness landscape statistics */
export function landscapeStats(fitnesses: number[]): {
  mean: number;
  variance: number;
  max: number;
  min: number;
  giniCoefficient: number;
} {
  if (fitnesses.length === 0) return { mean: 0, variance: 0, max: 0, min: 0, giniCoefficient: 0 };

  const sorted = [...fitnesses].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  const variance = sorted.reduce((sum, f) => sum + (f - mean) ** 2, 0) / n;

  // Gini coefficient
  let giniSum = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      giniSum += Math.abs(sorted[i] - sorted[j]);
    }
  }
  const giniCoefficient = mean > 0 ? giniSum / (2 * n * n * mean) : 0;

  return {
    mean,
    variance,
    max: sorted[n - 1],
    min: sorted[0],
    giniCoefficient,
  };
}

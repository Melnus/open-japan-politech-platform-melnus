// Quorum sensing for automatic phase transition
// OPEN → DELIBERATION → CONVERGENCE → CLOSED
// Shannon diversity index for ecosystem health monitoring

export type Phase = "OPEN" | "DELIBERATION" | "CONVERGENCE" | "CLOSED";

export interface QuorumState {
  phase: Phase;
  totalOpinions: number;
  totalSupports: number;
  clusterSizes: number[]; // sizes of each cluster
  avgPheromone: number;
  convergenceScore: number; // max cluster fraction
}

/** Calculate Shannon diversity index H = -Σ(pi * ln(pi)) */
export function shannonDiversity(clusterSizes: number[]): number {
  const total = clusterSizes.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;

  let H = 0;
  for (const size of clusterSizes) {
    if (size > 0) {
      const p = size / total;
      H -= p * Math.log(p);
    }
  }
  return H;
}

/** Calculate normalized Shannon evenness (0-1) */
export function shannonEvenness(clusterSizes: number[]): number {
  const k = clusterSizes.filter((s) => s > 0).length;
  if (k <= 1) return 1;
  return shannonDiversity(clusterSizes) / Math.log(k);
}

/** Determine next phase based on quorum sensing */
export function determinePhase(state: QuorumState, threshold: number): Phase {
  const { phase, totalOpinions, totalSupports, clusterSizes, avgPheromone, convergenceScore } =
    state;

  switch (phase) {
    case "OPEN":
      // Transition to DELIBERATION when enough opinions gathered
      if (totalOpinions >= 10 && totalSupports >= totalOpinions * 0.5) {
        return "DELIBERATION";
      }
      return "OPEN";

    case "DELIBERATION": {
      // Transition to CONVERGENCE when dominant cluster emerges
      const evenness = shannonEvenness(clusterSizes);
      if (convergenceScore >= threshold && evenness < 0.7 && avgPheromone > 1.0) {
        return "CONVERGENCE";
      }
      return "DELIBERATION";
    }

    case "CONVERGENCE":
      // Transition to CLOSED when convergence is strong
      if (convergenceScore >= threshold * 1.2 && avgPheromone > 2.0) {
        return "CLOSED";
      }
      return "CONVERGENCE";

    case "CLOSED":
      return "CLOSED";
  }
}

/** Calculate convergence score (fraction of opinions in largest cluster) */
export function convergenceScore(clusterSizes: number[]): number {
  const total = clusterSizes.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  return Math.max(...clusterSizes) / total;
}

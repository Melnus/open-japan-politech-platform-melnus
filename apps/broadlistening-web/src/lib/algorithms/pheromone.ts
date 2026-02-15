// Digital pheromone dynamics based on stigmergy principle
// I(t) = I(0) * exp(-λt) — exponential decay
// Reinforcement on support: I += quality * weight

export interface PheromoneState {
  intensity: number;
  quality: number;
  decayRate: number;
  lastUpdated: number; // timestamp ms
}

/** Calculate current pheromone intensity with time decay */
export function currentIntensity(state: PheromoneState, now: number): number {
  const elapsed = (now - state.lastUpdated) / (1000 * 60 * 60); // hours
  return state.intensity * Math.exp(-state.decayRate * elapsed);
}

/** Reinforce pheromone on support event */
export function reinforce(state: PheromoneState, weight: number, now: number): PheromoneState {
  const current = currentIntensity(state, now);
  return {
    ...state,
    intensity: current + state.quality * weight,
    lastUpdated: now,
  };
}

/** Aggregate pheromone field for a set of opinions */
export function aggregateField(
  states: PheromoneState[],
  now: number,
): { total: number; avg: number; max: number } {
  if (states.length === 0) return { total: 0, avg: 0, max: 0 };
  const intensities = states.map((s) => currentIntensity(s, now));
  const total = intensities.reduce((a, b) => a + b, 0);
  return {
    total,
    avg: total / states.length,
    max: Math.max(...intensities),
  };
}

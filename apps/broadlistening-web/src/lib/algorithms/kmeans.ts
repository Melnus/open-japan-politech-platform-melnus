// k-means++ clustering with automatic k determination (elbow method)

export interface ClusterResult {
  assignments: number[]; // cluster index for each point
  centroids: number[][]; // centroid vectors
  k: number;
  inertia: number; // sum of squared distances
}

/** Euclidean distance between two vectors */
function euclidean(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
}

/** k-means++ initialization */
function initCentroids(points: number[][], k: number): number[][] {
  const centroids: number[][] = [];
  const n = points.length;

  // Pick first centroid randomly
  centroids.push([...points[Math.floor(Math.random() * n)]]);

  for (let c = 1; c < k; c++) {
    // Calculate distances to nearest centroid
    const distances = points.map((p) => {
      const minDist = Math.min(...centroids.map((c) => euclidean(p, c)));
      return minDist * minDist;
    });

    // Weighted random selection
    const total = distances.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < n; i++) {
      r -= distances[i];
      if (r <= 0) {
        centroids.push([...points[i]]);
        break;
      }
    }
    if (centroids.length <= c) {
      centroids.push([...points[Math.floor(Math.random() * n)]]);
    }
  }

  return centroids;
}

/** Run k-means with given k */
export function kmeans(points: number[][], k: number, maxIter = 100): ClusterResult {
  if (points.length === 0) return { assignments: [], centroids: [], k, inertia: 0 };
  if (points.length <= k) {
    return {
      assignments: points.map((_, i) => i),
      centroids: points.map((p) => [...p]),
      k: points.length,
      inertia: 0,
    };
  }

  const dim = points[0].length;
  let centroids = initCentroids(points, k);
  let assignments = new Array(points.length).fill(0);

  for (let iter = 0; iter < maxIter; iter++) {
    // Assignment step
    const newAssignments = points.map((p) => {
      let minDist = Infinity;
      let minIdx = 0;
      for (let c = 0; c < k; c++) {
        const d = euclidean(p, centroids[c]);
        if (d < minDist) {
          minDist = d;
          minIdx = c;
        }
      }
      return minIdx;
    });

    // Check convergence
    if (newAssignments.every((a, i) => a === assignments[i])) {
      assignments = newAssignments;
      break;
    }
    assignments = newAssignments;

    // Update step
    centroids = Array.from({ length: k }, (_, c) => {
      const members = points.filter((_, i) => assignments[i] === c);
      if (members.length === 0) return centroids[c];
      const centroid = new Array(dim).fill(0);
      for (const m of members) {
        for (let d = 0; d < dim; d++) centroid[d] += m[d];
      }
      return centroid.map((v) => v / members.length);
    });
  }

  // Calculate inertia
  let inertia = 0;
  for (let i = 0; i < points.length; i++) {
    inertia += euclidean(points[i], centroids[assignments[i]]) ** 2;
  }

  return { assignments, centroids, k, inertia };
}

/** Determine optimal k using elbow method */
export function findOptimalK(points: number[][], maxK = 10): number {
  if (points.length <= 2) return 1;
  const effectiveMax = Math.min(maxK, Math.floor(points.length / 2));

  const inertias: number[] = [];
  for (let k = 1; k <= effectiveMax; k++) {
    const result = kmeans(points, k);
    inertias.push(result.inertia);
  }

  // Find elbow: maximum second derivative
  if (inertias.length <= 2) return 1;

  let bestK = 1;
  let maxCurvature = 0;
  for (let i = 1; i < inertias.length - 1; i++) {
    const curvature = Math.abs(inertias[i - 1] - 2 * inertias[i] + inertias[i + 1]);
    if (curvature > maxCurvature) {
      maxCurvature = curvature;
      bestK = i + 1;
    }
  }

  return bestK;
}

/** Run k-means with automatic k determination */
export function autoKMeans(points: number[][]): ClusterResult {
  const k = findOptimalK(points);
  return kmeans(points, k);
}

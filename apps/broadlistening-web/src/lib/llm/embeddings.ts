/** Simple TF-IDF based text embeddings (no external API required) */

export interface Vocabulary {
  terms: string[];
  idf: number[];
}

/** Tokenize text into lowercased terms */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

/** Build vocabulary and IDF weights from a corpus */
export function buildVocabulary(documents: string[]): Vocabulary {
  const docFreq = new Map<string, number>();
  const allTerms = new Set<string>();

  for (const doc of documents) {
    const unique = new Set(tokenize(doc));
    for (const term of unique) {
      allTerms.add(term);
      docFreq.set(term, (docFreq.get(term) ?? 0) + 1);
    }
  }

  const terms = Array.from(allTerms).sort();
  const n = documents.length;
  const idf = terms.map((t) => Math.log((n + 1) / ((docFreq.get(t) ?? 0) + 1)) + 1);

  return { terms, idf };
}

/** Compute TF-IDF vector for a single document, truncated/padded to targetDim */
export function embed(text: string, vocab: Vocabulary, targetDim: number = 128): number[] {
  const tokens = tokenize(text);
  const tf = new Map<string, number>();
  for (const t of tokens) {
    tf.set(t, (tf.get(t) ?? 0) + 1);
  }

  const raw = vocab.terms.map((term, i) => {
    const termFreq = tf.get(term) ?? 0;
    return termFreq * vocab.idf[i];
  });

  // Truncate or pad to target dimension
  const vec = new Array<number>(targetDim).fill(0);
  for (let i = 0; i < Math.min(raw.length, targetDim); i++) {
    vec[i] = raw[i];
  }

  return normalize(vec);
}

/** L2-normalize a vector */
export function normalize(vec: number[]): number[] {
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
  if (norm === 0) return vec;
  return vec.map((v) => v / norm);
}

/** Generate embeddings for multiple texts, using corpus for vocabulary building */
export function generateEmbeddings(
  texts: string[],
  corpus?: string[],
  targetDim: number = 128,
): number[][] {
  const vocab = buildVocabulary(corpus ?? texts);
  return texts.map((text) => embed(text, vocab, targetDim));
}

/** Cosine similarity between two vectors */
export function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 0;
  return dot / denom;
}

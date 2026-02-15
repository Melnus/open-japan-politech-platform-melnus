export type { ArgumentRelation, ExtractedArguments } from "./argument-extractor";
export { extractArguments } from "./argument-extractor";
export { complete, extractApiKey, getClient } from "./client";
export type { Vocabulary } from "./embeddings";
export { buildVocabulary, cosineSimilarity, embed, normalize } from "./embeddings";
export type { ArgumentGap, GapDetectionInput, GapDetectionResult } from "./gap-detector";
export { detectGaps } from "./gap-detector";
export { generateClusterLabel } from "./label-generator";

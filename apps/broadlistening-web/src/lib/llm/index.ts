export { getClient, complete, extractApiKey } from "./client";
export { extractArguments } from "./argument-extractor";
export type { ExtractedArguments, ArgumentRelation } from "./argument-extractor";
export { buildVocabulary, embed, normalize, cosineSimilarity } from "./embeddings";
export type { Vocabulary } from "./embeddings";
export { generateClusterLabel } from "./label-generator";
export { detectGaps } from "./gap-detector";
export type { ArgumentGap, GapDetectionResult, GapDetectionInput } from "./gap-detector";

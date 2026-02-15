import { describe, expect, it } from "vitest";
import {
  buildVocabulary,
  cosineSimilarity,
  embed,
  generateEmbeddings,
  normalize,
} from "../embeddings";

describe("embeddings", () => {
  describe("buildVocabulary", () => {
    it("builds vocabulary from documents", () => {
      const vocab = buildVocabulary(["hello world", "world peace"]);
      expect(vocab.terms).toContain("hello");
      expect(vocab.terms).toContain("world");
      expect(vocab.terms).toContain("peace");
      expect(vocab.idf.length).toBe(vocab.terms.length);
    });
  });

  describe("embed", () => {
    it("produces vector of target dimension", () => {
      const vocab = buildVocabulary(["hello world", "world test"]);
      const vec = embed("hello world", vocab, 64);
      expect(vec.length).toBe(64);
    });

    it("produces normalized vector", () => {
      const vocab = buildVocabulary(["some text here", "other text"]);
      const vec = embed("some text here", vocab, 32);
      const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
      // Should be close to 1 (or 0 for zero vector)
      if (norm > 0) {
        expect(norm).toBeCloseTo(1, 3);
      }
    });
  });

  describe("normalize", () => {
    it("normalizes to unit length", () => {
      const result = normalize([3, 4]);
      const norm = Math.sqrt(result[0] ** 2 + result[1] ** 2);
      expect(norm).toBeCloseTo(1);
    });

    it("handles zero vector", () => {
      const result = normalize([0, 0, 0]);
      expect(result).toEqual([0, 0, 0]);
    });
  });

  describe("cosineSimilarity", () => {
    it("returns 1 for identical vectors", () => {
      expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1);
    });

    it("returns 0 for orthogonal vectors", () => {
      expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
    });

    it("returns -1 for opposite vectors", () => {
      expect(cosineSimilarity([1, 0], [-1, 0])).toBeCloseTo(-1);
    });
  });

  describe("generateEmbeddings", () => {
    it("generates embeddings for multiple texts", () => {
      const texts = ["少子化対策が必要", "経済成長を優先すべき"];
      const embeddings = generateEmbeddings(texts, texts, 64);
      expect(embeddings.length).toBe(2);
      expect(embeddings[0].length).toBe(64);
      expect(embeddings[1].length).toBe(64);
    });

    it("similar texts have higher similarity", () => {
      // Use texts with shared tokens (TF-IDF tokenizes by whitespace)
      const corpus = [
        "childcare support policy reform needed",
        "childcare support funding increase plan",
        "military defense budget foreign policy",
      ];
      const embs = generateEmbeddings(corpus, corpus, 128);
      const sim01 = cosineSimilarity(embs[0], embs[1]);
      const sim02 = cosineSimilarity(embs[0], embs[2]);
      // Texts sharing "childcare support" should be more similar
      expect(sim01).toBeGreaterThan(sim02);
    });
  });
});

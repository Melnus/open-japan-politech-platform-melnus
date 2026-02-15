import { complete } from "./client";

export interface ArgumentGap {
  description: string;
  type: "MISSING_EVIDENCE" | "UNADDRESSED_CLAIM" | "WEAK_PREMISE";
  priority: "high" | "medium" | "low";
}

export interface GapDetectionResult {
  gaps: ArgumentGap[];
}

const SYSTEM_PROMPT = `You are a deliberation quality analyst. Given the claims, evidence, and rebuttals from a discussion topic, identify gaps in the argumentation.

Return ONLY a JSON object:
{
  "gaps": [
    {
      "description": "Brief description of the gap",
      "type": "MISSING_EVIDENCE" | "UNADDRESSED_CLAIM" | "WEAK_PREMISE",
      "priority": "high" | "medium" | "low"
    }
  ]
}

Gap types:
- MISSING_EVIDENCE: A claim lacks supporting data or examples
- UNADDRESSED_CLAIM: An important perspective is absent from the discussion
- WEAK_PREMISE: An argument rests on an unsupported assumption

Return valid JSON only, no markdown fences.`;

export interface GapDetectionInput {
  claims: string[];
  evidence: string[];
  rebuttals: string[];
}

export async function detectGaps(input: GapDetectionInput): Promise<GapDetectionResult> {
  const userPrompt = [
    "## Claims",
    ...input.claims.map((c, i) => `${i + 1}. ${c}`),
    "",
    "## Evidence",
    ...input.evidence.map((e, i) => `${i + 1}. ${e}`),
    "",
    "## Rebuttals",
    ...input.rebuttals.map((r, i) => `${i + 1}. ${r}`),
  ].join("\n");

  const raw = await complete(SYSTEM_PROMPT, userPrompt);

  try {
    const parsed = JSON.parse(raw);
    const validTypes = ["MISSING_EVIDENCE", "UNADDRESSED_CLAIM", "WEAK_PREMISE"] as const;
    const validPriorities = ["high", "medium", "low"] as const;

    return {
      gaps: Array.isArray(parsed.gaps)
        ? parsed.gaps.filter(
            (g: unknown): g is ArgumentGap =>
              typeof g === "object" &&
              g !== null &&
              typeof (g as ArgumentGap).description === "string" &&
              validTypes.includes((g as ArgumentGap).type as (typeof validTypes)[number]) &&
              validPriorities.includes(
                (g as ArgumentGap).priority as (typeof validPriorities)[number],
              ),
          )
        : [],
    };
  } catch {
    return { gaps: [] };
  }
}

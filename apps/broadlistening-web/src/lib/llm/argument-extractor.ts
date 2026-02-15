import { complete } from "./client";

export interface ArgumentRelation {
  source: number;
  target: number;
  type: "ATTACK" | "SUPPORT" | "UNDERCUT";
}

export interface ExtractedArguments {
  claims: string[];
  premises: string[];
  evidence: string[];
  rebuttals: string[];
  relations: ArgumentRelation[];
}

const SYSTEM_PROMPT = `You are an argument mining expert. Analyze the given opinion text and extract structured argument components.

Return ONLY a JSON object with this exact structure:
{
  "claims": ["main assertions made in the text"],
  "premises": ["underlying assumptions or reasons supporting claims"],
  "evidence": ["facts, data, or examples cited"],
  "rebuttals": ["counter-arguments or objections addressed"],
  "relations": [
    {"source": 0, "target": 1, "type": "SUPPORT"}
  ]
}

For relations:
- source/target are zero-based indices referring to items across all arrays (claims first, then premises, evidence, rebuttals in order)
- type is one of: ATTACK, SUPPORT, UNDERCUT
  - ATTACK: source directly contradicts target
  - SUPPORT: source provides backing for target
  - UNDERCUT: source undermines the link between target and what it supports

Return valid JSON only, no markdown fences.`;

export async function extractArguments(
  opinionText: string,
  apiKey?: string,
): Promise<ExtractedArguments> {
  const raw = await complete(SYSTEM_PROMPT, opinionText, apiKey);

  try {
    const parsed = JSON.parse(raw);
    return {
      claims: Array.isArray(parsed.claims) ? parsed.claims : [],
      premises: Array.isArray(parsed.premises) ? parsed.premises : [],
      evidence: Array.isArray(parsed.evidence) ? parsed.evidence : [],
      rebuttals: Array.isArray(parsed.rebuttals) ? parsed.rebuttals : [],
      relations: Array.isArray(parsed.relations)
        ? parsed.relations.filter(
            (r: unknown): r is ArgumentRelation =>
              typeof r === "object" &&
              r !== null &&
              typeof (r as ArgumentRelation).source === "number" &&
              typeof (r as ArgumentRelation).target === "number" &&
              ["ATTACK", "SUPPORT", "UNDERCUT"].includes((r as ArgumentRelation).type),
          )
        : [],
    };
  } catch {
    return { claims: [], premises: [], evidence: [], rebuttals: [], relations: [] };
  }
}

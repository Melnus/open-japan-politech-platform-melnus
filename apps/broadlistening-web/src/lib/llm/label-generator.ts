import { complete } from "./client";

const SYSTEM_PROMPT = `You are a concise labeling assistant. Given representative opinion texts from a cluster, generate a single short descriptive label that captures the common theme.

Rules:
- Maximum 20 characters
- Use Japanese if the opinions are in Japanese, English otherwise
- Return ONLY the label text, nothing else
- Be specific and descriptive`;

export async function generateClusterLabel(
  representativeTexts: string[],
  apiKey?: string,
): Promise<string> {
  const userPrompt = `Generate a short label (max 20 chars) for this opinion cluster:\n\n${representativeTexts.map((t, i) => `${i + 1}. ${t}`).join("\n")}`;

  const raw = await complete(SYSTEM_PROMPT, userPrompt, apiKey);
  const label = raw.trim().slice(0, 20);
  return label || "Unlabeled";
}

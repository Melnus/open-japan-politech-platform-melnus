import Anthropic from "@anthropic-ai/sdk";

let defaultClient: Anthropic | null = null;

export function getClient(apiKey?: string): Anthropic {
  if (apiKey) {
    return new Anthropic({ apiKey });
  }
  if (!defaultClient) {
    defaultClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return defaultClient;
}

export async function complete(
  systemPrompt: string,
  userPrompt: string,
  apiKey?: string,
): Promise<string> {
  const anthropic = getClient(apiKey);
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });
  const block = response.content[0];
  if (block.type === "text") return block.text;
  return "";
}

/** Extract API key from request header */
export function extractApiKey(request: Request): string | undefined {
  return request.headers.get("x-anthropic-api-key") ?? undefined;
}

/**
 * In-memory Prompt Registry (prototype)
 * Provides getPrompt(key, locale) with seeded templates and version logging support.
 */

export type PromptKey =
  | "chat"
  | "suggestServices"
  | "summarizeServiceInfo"
  | "automation.fillForm";

export interface PromptTemplate {
  key: PromptKey;
  version: number;
  locale: string; // e.g., "en"
  template: string;
  metadata?: { maxTokens?: number; outputSchemaKey?: string };
}

const seeds: PromptTemplate[] = [
  {
    key: "chat",
    version: 1,
    locale: "en",
    template:
      "You are a helpful civic assistant. User message: {{message}}",
  },
  {
    key: "suggestServices",
    version: 1,
    locale: "en",
    template:
      "Given user query: {{query}} return a JSON array of up to 5 service slugs.",
    metadata: { outputSchemaKey: "stringArray" },
  },
  {
    key: "summarizeServiceInfo",
    version: 1,
    locale: "en",
    template:
      "Summarize the following service details: {{details}} in <=120 words.",
  },
  {
    key: "automation.fillForm",
    version: 1,
    locale: "en",
    template:
      "Using the field map {{fieldMapJson}} and user data {{userJson}} plan granular browser steps to submit the service form.",
  },
];

function latestForKey(key: PromptKey, locale: string): PromptTemplate | undefined {
  const list = seeds.filter((t) => t.key === key && t.locale === locale);
  if (list.length === 0) return undefined;
  return list.reduce((a, b) => (a.version >= b.version ? a : b));
}

export function getPrompt(key: PromptKey, locale: string = "en"): PromptTemplate | undefined {
  return latestForKey(key, locale);
}

/**
 * Automation Prompt Builder (prototype)
 * - Builds an "automationPrompt" JSON from a service schema, form data, and user profile.
 * - Mirrors docs/browser-automation-plan.md Sample Prompt JSON.
 */

import type { ServiceFormSchema } from "@/lib/service-schemas/passport-renewal";

export interface UserSnapshot {
  name?: string;
  nic?: string;
  email?: string;
}

export interface AutomationPrompt {
  goal: string;
  site: string;
  steps: Array<Record<string, unknown>>;
  constraints: { maxDurationSec: number; respectRobotsTxt?: boolean };
  hitlCheckpoints: Array<string | Record<string, unknown>>;
  fieldMap: Record<
    string,
    {
      selector: string;
      type: "text" | "file" | "select" | "date";
    }
  >;
}

function defaultFieldSelector(fieldId: string): string {
  // CSS selector convention based on sample
  return `input[name=${fieldId}]`;
}

export function buildAutomationPrompt(
  schema: ServiceFormSchema,
  data: Record<string, unknown>,
  user: UserSnapshot
): AutomationPrompt {
  // Construct field map from schema (best-effort)
  const fieldMap: AutomationPrompt["fieldMap"] = {};
  for (const f of schema.fields) {
    if (f.type === "select") {
      fieldMap[f.id] = { selector: `select[name=${f.id}]`, type: "select" };
    } else if (f.type === "date") {
      fieldMap[f.id] = { selector: defaultFieldSelector(f.id), type: "date" };
    } else if (f.type === "file") {
      fieldMap[f.id] = { selector: defaultFieldSelector(f.id), type: "file" };
    } else {
      fieldMap[f.id] = { selector: defaultFieldSelector(f.id), type: "text" };
    }
  }

  // Example target
  const site = "https://example.gov/passport/renew";

  // Build step plan from known schema fields with sample sequencing
  const steps: AutomationPrompt["steps"] = [
    { action: "goto", url: "https://example.gov/passport" },
    { action: "click", selector: "a#renew-link" },
  ];

  const pushTypeIf = (id: string) => {
    if (data[id] != null) {
      steps.push({ action: "type", selector: fieldMap[id]?.selector ?? defaultFieldSelector(id), value: String(data[id] ?? "") });
    }
  };

  // Fill known fields (best effort)
  pushTypeIf("fullName");
  pushTypeIf("nic");
  pushTypeIf("dob");

  if (data["photo"]) {
    steps.push({
      action: "upload",
      selector: fieldMap["photo"]?.selector ?? defaultFieldSelector("photo"),
      filePath: "/tmp/photo.jpg", // prototype placeholder; real path resolved by worker
    });
  }

  pushTypeIf("appointmentDate");

  if (data["urgency"] === "urgent") {
    steps.push({ action: "click", selector: "input[value=urgent]" });
  }

  steps.push(
    { action: "click", selector: "button[type=submit]" },
    { action: "waitForSelector", selector: "#confirmationNumber" },
    { action: "extractText", selector: "#confirmationNumber", as: "externalRef" }
  );

  const prompt: AutomationPrompt = {
    goal: "Submit passport renewal form",
    site,
    steps,
    constraints: { maxDurationSec: 180, respectRobotsTxt: false },
    hitlCheckpoints: ["captcha", "ambiguousField"],
    fieldMap,
  };

  return prompt;
}

/**
 * Dev Script: Print a sample automation prompt to stdout (prototype)
 * Run with: npx tsx scripts/dev-prompt-demo.ts
 */

import { passportRenewalSchema } from "../src/lib/service-schemas/passport-renewal";
import { buildAutomationPrompt } from "../src/lib/automation/prompt-builder";

async function main() {
  const sampleData = {
    fullName: "Jane Doe",
    nic: "902345678V",
    dob: "1992-05-10",
    photo: "data:image/jpeg;base64,AAAA",
    appointmentDate: "2025-09-01",
    urgency: "urgent",
  };

  const user = {
    name: "Jane Doe",
    nic: "902345678V",
    email: "jane@example.com",
  };

  const prompt = buildAutomationPrompt(passportRenewalSchema, sampleData, user);
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(prompt, null, 2));
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

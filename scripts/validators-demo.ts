/**
 * Dev Script: Validate application status transitions (prototype)
 * Run with: npx tsx scripts/validators-demo.ts
 */
import {
  isApplicationStatusTransitionAllowed,
  validateStatusSequence,
  type ApplicationStatus,
} from "../src/lib/security/validators";

function demo() {
  const seq1: ApplicationStatus[] = ["Pending", "In Progress", "Approved", "Completed"];
  const seq2: ApplicationStatus[] = ["Pending", "Approved"]; // invalid direct jump

  // eslint-disable-next-line no-console
  console.log("Allowed(Pending -> In Progress):", isApplicationStatusTransitionAllowed("Pending", "In Progress"));
  // eslint-disable-next-line no-console
  console.log("Allowed(Pending -> Approved):", isApplicationStatusTransitionAllowed("Pending", "Approved"));

  // eslint-disable-next-line no-console
  console.log("Sequence 1:", seq1, "=>", validateStatusSequence(seq1));
  // eslint-disable-next-line no-console
  console.log("Sequence 2:", seq2, "=>", validateStatusSequence(seq2));
}

demo();

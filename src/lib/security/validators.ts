/**
 * Application status transition validator (prototype)
 *
 * Sources:
 * - docs/firestore-rules-draft.md (Status Transition Constraints)
 * - src/lib/types.ts (Application.status union)
 *
 * Strict, pure utilities for client/server-side checks.
 */

export type ApplicationStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "In Progress"
  | "Completed"
  | "In Review"
  | "Pending Payment";

const allowedTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
  Pending: ["In Progress", "Pending Payment"],
  "Pending Payment": ["In Progress", "Rejected"],
  "In Progress": ["Approved", "Rejected", "Completed", "In Review"],
  "In Review": ["Approved", "Rejected"],
  Approved: ["Completed"],
  Rejected: [],
  Completed: [],
};

/**
 * Returns true if moving from `from` to `to` is allowed according to the policy.
 */
export function isApplicationStatusTransitionAllowed(
  from: ApplicationStatus,
  to: ApplicationStatus
): boolean {
  const nexts = allowedTransitions[from] ?? [];
  return nexts.includes(to);
}

/**
 * Validate a sequence of statuses; returns the first invalid pair if any.
 */
export function validateStatusSequence(
  sequence: ApplicationStatus[]
): { ok: true } | { ok: false; from: ApplicationStatus; to: ApplicationStatus; index: number } {
  for (let i = 0; i < sequence.length - 1; i++) {
    const from = sequence[i];
    const to = sequence[i + 1];
    if (!isApplicationStatusTransitionAllowed(from, to)) {
      return { ok: false, from, to, index: i + 1 };
    }
  }
  return { ok: true };
}

// Example usage (not executed here):
// validateStatusSequence(["Pending", "In Progress", "Approved", "Completed"]);

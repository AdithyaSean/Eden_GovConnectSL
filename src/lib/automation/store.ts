/* In-memory store for simulated automation runs and checkpoints (prototype) */

export type RunStatus = "running" | "pendingCheckpoint" | "completed" | "failed";

export interface AgentRun {
  id: string;
  status: RunStatus;
  createdAt: string;
  updatedAt: string;
  serviceSlug?: string;
  version?: number;
  submissionMode?: string;
  traceId?: string;
  values?: Record<string, unknown>;
  receipt?: {
    externalRef: string;
    completedAt: string;
  };
  checkpoints: string[]; // checkpoint ids
  events: Array<{ type: string; at: string; data?: any }>;
}

export type CheckpointStatus = "pending" | "resolved";

export interface Checkpoint {
  id: string;
  runId: string;
  type: "captcha";
  status: CheckpointStatus;
  createdAt: string;
  resolvedAt?: string;
  data: {
    prompt: string;
    imageHint?: string;
  };
}

interface AutoStore {
  runs: Map<string, AgentRun>;
  checkpoints: Map<string, Checkpoint>;
}

const globalAny = globalThis as unknown as { __autoStore?: AutoStore };

function createStore(): AutoStore {
  return {
    runs: new Map<string, AgentRun>(),
    checkpoints: new Map<string, Checkpoint>(),
  };
}

export const store: AutoStore = globalAny.__autoStore ?? createStore();
if (!globalAny.__autoStore) {
  globalAny.__autoStore = store;
}

function nowISO() {
  return new Date().toISOString();
}

function genId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    try {
      return `${prefix}_${(crypto as any).randomUUID()}`;
    } catch {
      // fallback
    }
  }
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createRun(params: {
  serviceSlug?: string;
  version?: number;
  submissionMode?: string;
  values?: Record<string, unknown>;
  traceId?: string;
}): AgentRun {
  const id = genId("run");
  const run: AgentRun = {
    id,
    status: "running",
    createdAt: nowISO(),
    updatedAt: nowISO(),
    serviceSlug: params.serviceSlug,
    version: params.version,
    submissionMode: params.submissionMode,
    values: params.values,
    traceId: params.traceId,
    checkpoints: [],
    events: [{ type: "RunCreated", at: nowISO(), data: { traceId: params.traceId } }],
  };
  store.runs.set(id, run);
  return run;
}

export function addCheckpoint(runId: string, data?: Partial<Checkpoint["data"]>): Checkpoint | null {
  const run = store.runs.get(runId);
  if (!run) return null;

  const cp: Checkpoint = {
    id: genId("cp"),
    runId,
    type: "captcha",
    status: "pending",
    createdAt: nowISO(),
    data: {
      prompt: "Please solve the captcha to proceed.",
      imageHint: "captcha.png",
      ...data,
    },
  };

  store.checkpoints.set(cp.id, cp);
  run.checkpoints.push(cp.id);
  run.status = "pendingCheckpoint";
  run.updatedAt = nowISO();
  run.events.push({ type: "CheckpointCreated", at: nowISO(), data: { checkpointId: cp.id } });
  store.runs.set(runId, run);
  return cp;
}

export function resolveCheckpoint(runId: string, checkpointId: string): { ok: boolean; reason?: string } {
  const run = store.runs.get(runId);
  if (!run) return { ok: false, reason: "run_not_found" };
  const cp = store.checkpoints.get(checkpointId);
  if (!cp || cp.runId !== runId) return { ok: false, reason: "checkpoint_not_found" };
  if (cp.status === "resolved") return { ok: true };

  cp.status = "resolved";
  cp.resolvedAt = nowISO();
  store.checkpoints.set(checkpointId, cp);

  run.updatedAt = nowISO();
  run.events.push({ type: "CheckpointResolved", at: nowISO(), data: { checkpointId } });
  store.runs.set(runId, run);

  return { ok: true };
}

export function completeRun(runId: string): { ok: boolean; reason?: string } {
  const run = store.runs.get(runId);
  if (!run) return { ok: false, reason: "run_not_found" };

  run.status = "completed";
  run.updatedAt = nowISO();
  run.receipt = {
    externalRef: genId("ext"),
    completedAt: nowISO(),
  };
  run.events.push({ type: "AutomationComplete", at: nowISO(), data: run.receipt });
  store.runs.set(runId, run);

  return { ok: true };
}

export function getRun(runId: string): AgentRun | undefined {
  return store.runs.get(runId);
}

export function listCheckpoints(status?: CheckpointStatus): Checkpoint[] {
  const arr = Array.from(store.checkpoints.values());
  return status ? arr.filter((c) => c.status === status) : arr;
}

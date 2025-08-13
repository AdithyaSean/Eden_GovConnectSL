import { NextResponse } from "next/server";
import { logger } from "@/lib/debug/logger";
import { createRun, addCheckpoint, completeRun } from "@/lib/automation/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function POST(req: Request) {
  const traceId =
    req.headers.get("x-trace-id") ??
    (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? (crypto as any).randomUUID()
      : Math.random().toString(36).slice(2));

  let body: any;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const schema = body?.schema ?? {};
  const values = body?.values ?? {};
  const serviceSlug: string | undefined = schema.serviceSlug;
  const version: number | undefined = schema.version;
  const submissionMode: string | undefined = schema.submissionMode;

  const run = createRun({
    serviceSlug,
    version,
    submissionMode,
    values,
    traceId,
  });

  logger.info("Automation run created", { traceId, runId: run.id, serviceSlug, version, submissionMode });

  // Simulate work asynchronously (do not block response)
  // 10% chance to emit a checkpoint; otherwise complete.
  // Times: 1500-2500ms for first event.
  const emitCheckpoint = Math.random() < 0.1;

  // Fire-and-forget async
  (async () => {
    try {
      await delay(1500 + Math.floor(Math.random() * 1000));
      if (emitCheckpoint) {
        const cp = addCheckpoint(run.id);
        logger.warn("Checkpoint emitted", { traceId, runId: run.id, checkpointId: cp?.id });
      } else {
        const res = completeRun(run.id);
        logger.info("Run completed automatically", { traceId, runId: run.id, ok: res.ok });
      }
    } catch (e: any) {
      logger.error("Simulation scheduling error", { traceId, error: String(e?.message ?? e) });
    }
  })();

  return NextResponse.json(
    {
      ok: true,
      runId: run.id,
      traceId,
      mode: "simulated",
    },
    { status: 200 }
  );
}

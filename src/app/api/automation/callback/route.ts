import { NextResponse } from "next/server";
import { logger } from "@/lib/debug/logger";
import { resolveCheckpoint, completeRun } from "@/lib/automation/store";

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

  const action = body?.action as string | undefined;

  if (action === "resolveCheckpoint") {
    const runId: string | undefined = body?.runId;
    const checkpointId: string | undefined = body?.checkpointId;

    if (!runId || !checkpointId) {
      logger.warn("resolveCheckpoint missing params", { traceId, runId, checkpointId });
      return NextResponse.json({ ok: false, error: "missing_params" }, { status: 400 });
    }

    const res = resolveCheckpoint(runId, checkpointId);
    logger.info("Checkpoint resolve requested", { traceId, runId, checkpointId, ok: res.ok, reason: res.reason });

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: res.reason }, { status: 404 });
    }

    // After resolving, simulate automation finishing shortly after
    (async () => {
      try {
        await delay(1200 + Math.floor(Math.random() * 800));
        const done = completeRun(runId);
        logger.info("Run completed after checkpoint resolve", { traceId, runId, ok: done.ok });
      } catch (e: any) {
        logger.error("Post-resolve completion error", { traceId, error: String(e?.message ?? e) });
      }
    })();

    return NextResponse.json({ ok: true, runId, checkpointId, traceId }, { status: 200 });
  }

  logger.warn("Unknown callback action", { traceId, action });
  return NextResponse.json({ ok: false, error: "unknown_action", traceId }, { status: 400 });
}

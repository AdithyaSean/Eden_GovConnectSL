import { NextResponse } from "next/server";
import { getRun } from "@/lib/automation/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  const run = getRun(id);
  if (!run) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    run: {
      id: run.id,
      status: run.status,
      createdAt: run.createdAt,
      updatedAt: run.updatedAt,
      serviceSlug: run.serviceSlug ?? null,
      version: run.version ?? null,
      submissionMode: run.submissionMode ?? null,
      receipt: run.receipt ?? null,
      checkpoints: run.checkpoints,
      events: run.events,
    },
  });
}

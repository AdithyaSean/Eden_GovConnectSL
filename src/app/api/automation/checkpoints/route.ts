import { NextResponse } from "next/server";
import { listCheckpoints } from "@/lib/automation/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status") as "pending" | "resolved" | null;
  const cps = listCheckpoints(statusParam ?? undefined);
  // Shape response minimally for UI
  return NextResponse.json({
    ok: true,
    checkpoints: cps.map((c) => ({
      id: c.id,
      runId: c.runId,
      status: c.status,
      createdAt: c.createdAt,
      resolvedAt: c.resolvedAt ?? null,
      data: c.data,
    })),
  });
}

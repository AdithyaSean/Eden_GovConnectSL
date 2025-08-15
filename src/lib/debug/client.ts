"use client";

/**
 * Lightweight client-side debug event emitter for the Dev Debug Panel.
 * Usage: emitDebug("event.name", { any: "payload" }, optionalTraceId)
 */

export type DebugEventDetail = {
  name: string;
  detail?: unknown;
  traceId?: string;
  ts: string;
};

export function emitDebug(name: string, detail?: unknown, traceId?: string) {
  if (typeof window === "undefined") return;
  const evtDetail: DebugEventDetail = {
    name,
    detail,
    traceId,
    ts: new Date().toISOString(),
  };
  try {
    window.dispatchEvent(new CustomEvent("dev:debug", { detail: evtDetail }));
    // Also mirror to console for redundancy
    // eslint-disable-next-line no-console
    console.debug(`[DevDebug] ${name}`, evtDetail);
  } catch {
    // no-op
  }
}

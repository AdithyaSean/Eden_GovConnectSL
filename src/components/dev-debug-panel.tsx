"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type DebugEventDetail = {
  name: string;
  detail?: unknown;
  traceId?: string;
  ts: string;
};

type Entry = DebugEventDetail & { id: string };

const MAX_EVENTS = 100;

function useKeyboardToggle(onToggle: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Alt + D
      if (e.altKey && (e.key === "d" || e.key === "D")) {
        e.preventDefault();
        onToggle();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onToggle]);
}

export default function DevDebugPanel() {
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem("devDebug.visible") === "1";
    } catch {
      return false;
    }
  });
  const [entries, setEntries] = useState<Entry[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const toggle = () => {
    setVisible((v) => {
      const nv = !v;
      try {
        window.localStorage.setItem("devDebug.visible", nv ? "1" : "0");
      } catch {
        // ignore
      }
      return nv;
    });
  };

  useKeyboardToggle(toggle);

  useEffect(() => {
    const onEvt = (e: Event) => {
      const ce = e as CustomEvent<DebugEventDetail>;
      const d = ce.detail;
      if (!d) return;
      setEntries((prev) => {
        const id = `${d.ts}_${Math.random().toString(36).slice(2, 8)}`;
        const next = [{ ...d, id }, ...prev];
        if (next.length > MAX_EVENTS) next.length = MAX_EVENTS;
        return next;
      });
    };
    window.addEventListener("dev:debug", onEvt as EventListener);
    return () => window.removeEventListener("dev:debug", onEvt as EventListener);
  }, []);

  useEffect(() => {
    // Auto-scroll to top on new entries (since newest on top does not need scrolling)
    if (!containerRef.current) return;
  }, [entries.length]);

  const hasTrace = (e: Entry) => e.traceId && e.traceId.length > 0;

  const title = useMemo(
    () => `Dev Debug Panel (Alt+D) • ${entries.length} event${entries.length === 1 ? "" : "s"}`,
    [entries.length]
  );

  if (!visible) {
    return (
      <button
        aria-label="Open Dev Debug Panel"
        onClick={toggle}
        className="fixed bottom-3 right-3 z-50 rounded-md border bg-background/90 px-3 py-2 text-xs shadow hover:bg-muted"
      >
        Dev Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-3 right-3 z-50 w-[420px] max-w-[96vw] rounded-md border bg-background/95 shadow-lg backdrop-blur">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <div className="text-xs font-semibold">{title}</div>
        <div className="ml-auto flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setEntries([])}
            className="h-7 px-2 text-xs"
          >
            Clear
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              try {
                navigator.clipboard?.writeText(JSON.stringify(entries, null, 2));
              } catch {
                // ignore
              }
            }}
            className="h-7 px-2 text-xs"
          >
            Copy
          </Button>
          <Button size="sm" onClick={toggle} className="h-7 px-2 text-xs">
            Close
          </Button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="max-h-[50vh] overflow-y-auto p-2 space-y-2"
      >
        {entries.length === 0 ? (
          <div className="text-xs text-muted-foreground px-1 py-2">
            No events yet. Use emitDebug(name, detail, traceId). Try Alt+D to toggle visibility.
          </div>
        ) : (
          entries.map((e) => (
            <div
              key={e.id}
              className="rounded border bg-card px-2 py-1.5 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono">{new Date(e.ts).toLocaleTimeString()}</span>
                <span className="font-semibold">{e.name}</span>
                {hasTrace(e) ? (
                  <span className="ml-auto font-mono text-[10px] opacity-70">
                    {e.traceId}
                  </span>
                ) : null}
              </div>
              {e.detail ? (
                <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-words">
                  {typeof e.detail === "string"
                    ? e.detail
                    : JSON.stringify(e.detail, null, 2)}
                </pre>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

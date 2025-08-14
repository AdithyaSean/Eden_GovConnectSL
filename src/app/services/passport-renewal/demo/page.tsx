
"use client";

import React, { useEffect, useMemo, useState } from "react";
import DynamicForm from "@/components/dynamic-form";
import { passportRenewalSchema } from "@/lib/service-schemas/passport-renewal";
import { Button } from "@/components/ui/button";
import { emitDebug } from "@/lib/debug/client";
import { buildAutomationPrompt } from "@/lib/automation/prompt-builder";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";

export default function PassportRenewalDemoPage() {
  const schema = useMemo(() => passportRenewalSchema, []);
  const { user } = useAuth();
  const [runId, setRunId] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [runStatus, setRunStatus] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{ externalRef: string; completedAt: string } | null>(null);
  const ENABLE_PROMPT_BUILD = true;

  useEffect(() => {
    if (!runId) {
      setRunStatus(null);
      setReceipt(null);
      return;
    }
    let cancelled = false;
    setRunStatus("running");
    setReceipt(null);
    const iv = setInterval(async () => {
      try {
        const res = await fetch(`/api/automation/runs/${runId}`, { cache: "no-store" });
        const data = await res.json();
        if (!cancelled && data?.ok && data.run) {
          setRunStatus((prev) => {
            const next = data.run.status ?? null;
            if (next && next !== prev) {
              emitDebug("automation.run.status", { runId, status: next });
            }
            return next;
          });
          if (data.run.receipt) {
            setReceipt((prev) => {
              if (!prev) {
                emitDebug("automation.run.receipt", { runId, receipt: data.run.receipt });
              }
              return data.run.receipt;
            });
          }
          if (data.run.status === "completed") {
            clearInterval(iv);
          }
        }
      } catch {
        // no-op
      }
    }, 1200);
    return () => {
      cancelled = true;
      clearInterval(iv);
    };
  }, [runId]);

  const handleSubmit = async (payload: {
    schema: typeof schema;
    values: Record<string, any>;
    submittedAt: string;
  }) => {
    setSubmitting(true);
    setRunId(null);
    setLastResponse(null);

    const traceId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

    emitDebug("automation.submit.begin", { payload }, traceId);

    if (ENABLE_PROMPT_BUILD) {
      const autop = buildAutomationPrompt(schema, payload.values, { name: user?.name, nic: user?.nic, email: user?.email });
      emitDebug("automation.prompt.built", autop, traceId);
    }

    const res = await fetch("/api/automation/runs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-trace-id": traceId,
      },
      body: JSON.stringify({
        schema: {
          serviceSlug: payload.schema.serviceSlug,
          version: payload.schema.version,
          submissionMode: payload.schema.submissionMode,
        },
        values: payload.values,
        submittedAt: payload.submittedAt,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setLastResponse(data);

    if (data?.runId) {
      setRunId(data.runId);
      emitDebug("automation.run.created", { runId: data.runId }, traceId);
      
      try {
        // Persist AgentRun to Firestore
        await addDoc(collection(db, "agentRuns"), {
          runId: data.runId,
          serviceSlug: payload.schema.serviceSlug,
          status: 'running',
          createdAt: serverTimestamp(),
          values: payload.values,
          userId: user?.id ?? null
        });
        
        // Create audit log
        await addDoc(collection(db, "auditLogs"), {
          action: "AgentRunStart",
          entityType: "agentRun",
          entityId: data.runId,
          actorId: user?.id ?? "system",
          actorType: "user",
          timestamp: serverTimestamp(),
          details: { service: payload.schema.serviceSlug }
        });
        
        emitDebug("firestore.persist.success", { runId: data.runId });
      } catch (error) {
        emitDebug("firestore.persist.error", { runId: data.runId, error });
        console.error("Error persisting agent run:", error);
      }
    }
    
    emitDebug("automation.submit.end", { response: data }, traceId);
    setSubmitting(false);
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Passport Renewal (Demo)</h1>
        <p className="text-sm text-muted-foreground">
          Dynamic form rendered from schema. On submit, sends a request to the simulated automation API and persists the run to Firestore.
        </p>
      </div>

      <DynamicForm schema={schema} onSubmit={handleSubmit} />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Run ID:</span>
          <span className="text-sm">{runId ?? "—"}</span>
          {runId ? (
            <Button
              size="sm"
              variant="secondary"
              className="ml-auto"
              onClick={() => navigator.clipboard?.writeText(runId)}
              disabled={submitting}
            >
              Copy
            </Button>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <span className="text-sm">{runStatus ?? "—"}</span>
        </div>

        {receipt ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Receipt Ref:</span>
            <span className="text-sm font-mono">{receipt.externalRef}</span>
          </div>
        ) : null}

        <div className="text-xs text-muted-foreground">
          Trace, payload, and response are printed to the browser console for debugging.
        </div>

        {lastResponse ? (
          <pre className="mt-2 rounded bg-muted p-3 text-xs overflow-x-auto">
            {JSON.stringify(lastResponse, null, 2)}
          </pre>
        ) : null}
      </div>
    </div>
  );
}

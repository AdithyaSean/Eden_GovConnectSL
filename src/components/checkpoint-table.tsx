
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

type CheckpointRow = {
  id: string;
  runId: string;
  status: "pending" | "resolved";
  createdAt: string;
  resolvedAt: string | null;
  data: {
    prompt: string;
    imageHint?: string;
  };
};

interface Props {
  title?: string;
  autoRefreshMs?: number; // default 5000
}

export default function CheckpointTable({ title = "Pending Checkpoints", autoRefreshMs = 5000 }: Props) {
  const [items, setItems] = useState<CheckpointRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const pending = useMemo(() => items.filter((i) => i.status === "pending"), [items]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/automation/checkpoints?status=pending", { cache: "no-store" });
      const data = await res.json();
      if (data?.ok && Array.isArray(data.checkpoints)) {
        setItems(data.checkpoints as CheckpointRow[]);
      } else {
        console.warn("[Admin] Unexpected checkpoints payload", data);
      }
    } catch (e: any) {
      console.error("[Admin] Failed to load checkpoints", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, autoRefreshMs);
    return () => clearInterval(t);
  }, [fetchData, autoRefreshMs]);

  const resolveOne = async (cp: CheckpointRow) => {
    setResolving((r) => ({ ...r, [cp.id]: true }));
    const traceId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? (crypto as any).randomUUID()
        : Math.random().toString(36).slice(2);

    try {
      const res = await fetch("/api/automation/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-trace-id": traceId },
        body: JSON.stringify({
          action: "resolveCheckpoint",
          runId: cp.runId,
          checkpointId: cp.id,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.ok) {
        toast({
          title: "Checkpoint Resolved",
          description: `Checkpoint ${cp.id} has been resolved.`,
        });
        // Optimistic UI update or refetch
        fetchData();
      } else {
        toast({
          title: "Resolution Failed",
          description: data?.error || "Could not resolve the checkpoint.",
          variant: "destructive",
        });
      }
    } catch (e: any) {
      console.error("[Admin] Failed to resolve checkpoint", e);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setResolving((r) => ({ ...r, [cp.id]: false }));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="secondary" onClick={fetchData} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <Table>
        <TableCaption>Showing pending HITL checkpoints from simulated automation.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Checkpoint ID</TableHead>
            <TableHead>Run ID</TableHead>
            <TableHead>Prompt</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pending.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                No pending checkpoints.
              </TableCell>
            </TableRow>
          ) : (
            pending.map((cp) => (
              <TableRow key={cp.id}>
                <TableCell className="font-mono text-xs">{cp.id}</TableCell>
                <TableCell className="font-mono text-xs">{cp.runId}</TableCell>
                <TableCell className="text-sm">{cp.data?.prompt ?? "—"}</TableCell>
                <TableCell className="text-xs">{new Date(cp.createdAt).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => resolveOne(cp)}
                    disabled={!!resolving[cp.id]}
                  >
                    {resolving[cp.id] ? "Resolving..." : "Resolve"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

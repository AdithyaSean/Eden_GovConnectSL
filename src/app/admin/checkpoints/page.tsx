"use client";

import React from "react";
import CheckpointTable from "@/components/checkpoint-table";

export default function AdminCheckpointsPage() {
  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">HITL Checkpoints</h1>
        <p className="text-sm text-muted-foreground">
          Resolve pending checkpoints emitted by the simulated automation. This view auto-refreshes every 5 seconds.
        </p>
      </div>

      <CheckpointTable />
    </div>
  );
}

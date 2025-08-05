"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/types";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { title, icon } = service;
  
  const Icon = LucideIcons[icon] as React.ElementType;

  return (
    <Card className="flex flex-col items-center justify-center text-center p-2 aspect-square hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-0 space-y-2 flex flex-col items-center justify-center">
        <div className="p-3 rounded-full bg-muted">
            {Icon ? <Icon className="w-6 h-6 text-primary" /> : null}
        </div>
        <p className="text-xs font-semibold leading-tight">{title}</p>
      </CardContent>
    </Card>
  );
}

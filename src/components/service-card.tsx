"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/types";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { title, description, status, statusVariant, icon, actions } = service;
  
  const Icon = LucideIcons[icon] as React.ElementType;

  const badgeVariantClasses = {
    success: "border-transparent bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/50 dark:text-green-300",
    warning: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-300",
    destructive: "border-transparent bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300",
    default: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300",
  };

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
            <div className="flex-shrink-0 p-3 rounded-lg bg-muted">
              {Icon ? <Icon className="w-6 h-6 text-primary" /> : null}
            </div>
          <Badge variant="outline" className={cn("text-xs whitespace-nowrap", badgeVariantClasses[statusVariant])}>
            {status}
          </Badge>
        </div>
        <CardTitle className="pt-2 font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="gap-2 pt-4">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            size="sm"
            className={action.variant === 'default' ? 'bg-primary hover:bg-primary/90' : ''}
          >
            {action.label}
          </Button>
        ))}
      </CardFooter>
    </Card>
  );
}
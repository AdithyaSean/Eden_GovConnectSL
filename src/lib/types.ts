import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
}

export type ServiceStatus = "Active" | "Renewal Due" | "Not Applied" | "Pending";

export type ServiceStatusVariant =
  | "success"
  | "warning"
  | "destructive"
  | "default";

export interface ServiceAction {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
}

export interface Service {
  title: string;
  description: string;
  status: ServiceStatus;
  statusVariant: ServiceStatusVariant;
  icon: keyof typeof import("lucide-react");
  actions: ServiceAction[];
}

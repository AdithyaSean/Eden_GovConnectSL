
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  gradient: string;
  loading?: boolean;
}

export function StatCard({ title, value, description, icon: Icon, gradient, loading }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden text-white", gradient)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 opacity-80" />
      </CardHeader>
      <CardContent>
        {loading ? (
            <Skeleton className="h-8 w-1/2 bg-white/20" />
        ) : (
            <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs opacity-80">{description}</p>
      </CardContent>
    </Card>
  );
}

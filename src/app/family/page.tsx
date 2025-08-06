import { DashboardLayout } from "@/components/dashboard-layout";

export default function FamilyPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Family & Dependents</h1>
        </div>
         <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Family members content will be displayed here.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

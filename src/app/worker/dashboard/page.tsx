
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const workerRoles = [
    { name: "Transport Worker", href: "/worker/transport/dashboard" },
    { name: "Immigration Worker", href: "/worker/immigration/dashboard" },
    { name: "Health Worker", href: "/worker/health/dashboard" },
    { name: "Tax Worker", href: "/worker/tax/dashboard" },
    { name: "Identity Worker", href: "/worker/identity/dashboard" },
    { name: "Pension Worker", href: "/worker/pension/dashboard" },
    { name: "Land Registry Worker", href: "/worker/landregistry/dashboard" },
    { name: "Exams Worker", href: "/worker/exams/dashboard" },
]

export default function WorkerDashboardPage() {
  return (
      <AdminLayout workerMode>
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Select Your Role Dashboard</h1>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {workerRoles.map(role => (
                    <Link href={role.href} key={role.name}>
                        <Card className="hover:bg-muted transition-colors">
                            <CardHeader>
                                <CardTitle>{role.name}</CardTitle>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
      </AdminLayout>
  );
}

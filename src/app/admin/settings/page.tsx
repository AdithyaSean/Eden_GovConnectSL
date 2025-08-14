
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAnalytics } from "@/hooks/use-analytics";
import * as XLSX from 'xlsx';

export default function AdminSettingsPage() {
    const { allApplications, loading } = useAnalytics();

    const handleGenerateReport = () => {
        if(loading || allApplications.length === 0) {
            alert("Analytics data is still loading or there are no applications to report.");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(allApplications);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
        
        // Example for adding more sheets
        // const userSheet = XLSX.utils.json_to_sheet(usersData);
        // XLSX.utils.book_append_sheet(workbook, userSheet, "Users");

        XLSX.writeFile(workbook, "GovConnect_Analytics_Report.xlsx");
    }

  return (
    <AdminLayout>
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        </div>
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Site Configuration</CardTitle>
                    <CardDescription>Manage global settings for the platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-base font-medium">Maintenance Mode</p>
                        <Switch id="maintenance-mode" />
                    </div>
                     <p className="text-sm text-muted-foreground">When enabled, users will see a maintenance page. Admins can still log in.</p>
                </CardContent>
                 <CardFooter>
                    <Button>Save Changes</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Super Admin Actions</CardTitle>
                    <CardDescription>High-level administrative actions.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" onClick={handleGenerateReport} disabled={loading}>
                        {loading ? 'Loading Data...' : 'Generate Analytics Report'}
                    </Button>
                    <Button variant="outline">View Audit Logs</Button>
                    <Button variant="destructive">Clear System Cache</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

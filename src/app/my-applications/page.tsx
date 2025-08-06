import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";

const applications = [
  { id: "DL-456", service: "Driving License Renewal", submitted: "2024-07-15", status: "Approved" },
  { id: "NIC-789", service: "National ID Application", submitted: "2024-07-20", status: "In Review" },
  { id: "PP-123", service: "Passport Application", submitted: "2024-07-22", status: "Pending Payment" },
  { id: "LR-321", service: "Land Registry Update", submitted: "2024-06-30", status: "Completed" },
  { id: "TAX-987", service: "Tax Return Q2", submitted: "2024-07-10", status: "Rejected" },
];

export default function MyApplicationsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
           <Button>Apply for a New Service</Button>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Track all your submitted applications and their progress.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>Reference ID</TableHead>
                            <TableHead>Date Submitted</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.map((app) => (
                             <TableRow key={app.id}>
                                <TableCell className="font-medium">{app.service}</TableCell>
                                <TableCell>{app.id}</TableCell>
                                <TableCell>{app.submitted}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        app.status === 'Approved' || app.status === 'Completed' ? 'default'
                                        : app.status === 'In Review' ? 'secondary'
                                        : app.status === 'Pending Payment' ? 'outline'
                                        : 'destructive'
                                    }
                                     className={
                                        app.status === 'Approved' || app.status === 'Completed' ? 'bg-green-600' : ''
                                    }
                                    >{app.status}</Badge>
                                </TableCell>
                                 <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">View Details</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

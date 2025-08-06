
import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Edit, AlertTriangle } from "lucide-react";

const assignedTasks = [
  { id: "APP-001", user: "John Doe", service: "Driving License", status: "Pending Verification" },
  { id: "APP-004", user: "Emily Brown", service: "Vehicle Registration", status: "Documents Missing" },
  { id: "APP-006", user: "Michael Clark", service: "Driving License", status: "Pending Verification" },
];

export default function WorkerDashboardPage() {
  return (
    <AdminLayout workerMode={true}>
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Worker Portal - Motor Traffic</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>My Assigned Tasks</CardTitle>
            <CardDescription>Applications requiring your attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.id}</TableCell>
                    <TableCell>{task.user}</TableCell>
                    <TableCell>{task.service}</TableCell>
                    <TableCell>
                        <Badge variant={task.status === "Documents Missing" ? "destructive" : "secondary"}>
                           {task.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="mr-2">
                           <Edit className="h-3 w-3 mr-1" /> View/Edit
                        </Button>
                        <Button variant="outline" size="sm" className="mr-2">
                           <Check className="h-3 w-3 mr-1" /> Mark as Verified
                        </Button>
                         <Button variant="destructive" size="sm">
                           <AlertTriangle className="h-3 w-3 mr-1" /> Flag Issue
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

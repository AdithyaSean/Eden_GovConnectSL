import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, File } from "lucide-react";

const applications = [
  { id: "APP-001", user: "John Doe", service: "Driving License", status: "Pending", submitted: "2024-07-20" },
  { id: "APP-002", user: "Jane Smith", service: "Passport", status: "Approved", submitted: "2024-07-19" },
  { id: "APP-003", user: "Sam Wilson", service: "National ID", status: "Rejected", submitted: "2024-07-18" },
  { id: "APP-004", user: "Emily Brown", service: "Land Registry", status: "In Progress", submitted: "2024-07-21" },
  { id: "APP-005", user: "Chris Green", service: "Tax Payment", status: "Completed", submitted: "2024-07-17" },
];

export default function ApplicationsPage() {
  return (
    <AdminLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Submitted Applications</CardTitle>
            <CardDescription>View and manage all user applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.id}</TableCell>
                      <TableCell>{app.user}</TableCell>
                      <TableCell>{app.service}</TableCell>
                      <TableCell>{app.submitted}</TableCell>
                      <TableCell>
                         <Badge variant={
                             app.status === 'Approved' || app.status === 'Completed' ? 'default' 
                             : app.status === 'Pending' ? 'secondary'
                             : app.status === 'In Progress' ? 'outline'
                             : 'destructive'
                          }
                          className={
                               app.status === 'Approved' || app.status === 'Completed' ? 'bg-green-600' : ''
                          }
                          >
                          {app.status}
                          </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Approve</DropdownMenuItem>
                            <DropdownMenuItem>Reject</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Contact User</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

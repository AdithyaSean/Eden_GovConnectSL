
import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Search } from "lucide-react";

const applications = [
  { id: "MID-01", type: "Medical ID Card", submitted: "2024-07-22", status: "Pending", user: "Nimal Silva", nic: "199012345V" },
  { id: "APPT-02", type: "Appointment Booking", submitted: "2024-07-21", status: "Confirmed", user: "Saman Perera", nic: "198512345V" },
];

export default function WorkerHealthDashboard() {
  return (
    <AdminLayout workerMode>
      <div className="flex-1 space-y-8 p-8 pt-6">
        <h1 className="text-3xl font-bold tracking-tight">Health Worker Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>Health Service Requests</CardTitle>
            <div className="flex items-center gap-4 mt-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Search by NIC or Name..." className="pl-10" />
                </div>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="medical-id">Medical ID Card</SelectItem>
                        <SelectItem value="appointment">Appointment Booking</SelectItem>
                    </SelectContent>
                </Select>
                 <Button>Search</Button>
            </div>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>NIC</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.id}</TableCell>
                    <TableCell>{app.user}</TableCell>
                    <TableCell>{app.nic}</TableCell>
                    <TableCell>{app.type}</TableCell>
                    <TableCell>{app.submitted}</TableCell>
                    <TableCell>
                      <Badge variant={app.status === 'Confirmed' ? 'default' : 'secondary'} className={app.status === 'Confirmed' ? 'bg-green-600' : ''}>{app.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost"><MoreHorizontal /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Approve</DropdownMenuItem>
                          <DropdownMenuItem>Reject</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

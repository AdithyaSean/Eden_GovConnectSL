
import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";

const payments = [
  { id: "PAY-001", fineId: "TFC-2024-001", user: "John Doe", amount: "2000.00", date: "2024-07-22", status: "Verified" },
  { id: "PAY-002", fineId: "MUN-2024-005", user: "Jane Smith", amount: "1000.00", date: "2024-07-21", status: "Pending" },
];

export default function WorkerFinePaymentDashboard() {
  return (
    <AdminLayout workerMode>
      <div className="flex-1 space-y-8 p-8 pt-6">
        <h1 className="text-3xl font-bold tracking-tight">Fine Payment Worker Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>Recent Fine Payments</CardTitle>
            <CardDescription>Review and verify recent fine payments from citizens.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Fine Ref</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount (LKR)</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.fineId}</TableCell>
                    <TableCell>{payment.user}</TableCell>
                     <TableCell>{payment.amount}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>
                      <Badge variant={payment.status === 'Verified' ? 'default' : 'secondary'} className={payment.status === 'Verified' ? 'bg-green-600' : ''}>{payment.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost"><MoreHorizontal /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Payment Details</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Verified</DropdownMenuItem>
                          <DropdownMenuItem>Flag for Review</DropdownMenuItem>
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

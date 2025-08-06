
"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";

const paymentHistory = [
  {
    id: "PAY756483",
    service: "Driving License Renewal",
    date: "2024-07-15",
    amount: "2,500.00",
    status: "Success",
  },
  {
    id: "PAY648392",
    service: "Land Registry Fee",
    date: "2024-06-28",
    amount: "1,000.00",
    status: "Success",
  },
  {
    id: "PAY583729",
    service: "Tax Payment (Q1)",
    date: "2024-04-14",
    amount: "18,000.00",
    status: "Success",
  },
];


export default function PaymentsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                View your past transactions and download receipts.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Reference ID</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount (LKR)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paymentHistory.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell className="font-medium">{payment.id}</TableCell>
                                <TableCell>{payment.service}</TableCell>
                                <TableCell>{payment.date}</TableCell>
                                <TableCell>{payment.amount}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 text-xs rounded-full ${payment.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{payment.status}</span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <Download className="h-4 w-4" />
                                        <span className="sr-only">Download Receipt</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
             <CardFooter className="flex justify-end">
                <Button variant="outline">Raise a Payment Issue</Button>
             </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}

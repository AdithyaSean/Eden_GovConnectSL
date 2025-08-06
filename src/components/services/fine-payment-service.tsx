
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { fines } from '@/lib/data';
import Link from 'next/link';

export function FinePaymentService({ service }) {
  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Your Fines</CardTitle>
                <CardDescription>
                    Below is a list of all pending and paid fines associated with your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fine ID</TableHead>
                            <TableHead>Fine Type</TableHead>
                            <TableHead>Date Issued</TableHead>
                            <TableHead>Amount (LKR)</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fines.map((fine) => (
                            <TableRow key={fine.id}>
                                <TableCell className="font-medium">{fine.id}</TableCell>
                                <TableCell>{fine.type}</TableCell>
                                <TableCell>{fine.issuedDate}</TableCell>
                                <TableCell>{fine.amount}</TableCell>
                                <TableCell>{fine.dueDate}</TableCell>
                                <TableCell>
                                    <Badge variant={fine.status === 'Paid' ? 'default' : 'destructive'}
                                     className={fine.status === 'Paid' ? 'bg-green-600' : ''}
                                    >
                                        {fine.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {fine.status === 'Pending' && (
                                        <Button asChild size="sm">
                                            <Link href={`/payment?service=${encodeURIComponent(fine.type)}&amount=${fine.amount}&ref=${fine.id}`}>
                                                Pay Now
                                            </Link>
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}

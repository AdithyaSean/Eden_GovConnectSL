
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import Link from 'next/link';

const taxPayments = [
    { year: 2023, type: "Income Tax (Q4)", amount: "15,000.00", status: "Paid", dueDate: "2024-01-15" },
    { year: 2024, type: "Income Tax (Q1)", amount: "18,000.00", status: "Due", dueDate: "2024-04-15" },
];

export function TaxPaymentsService({ service }) {
  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>My Tax Payments</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Year</TableHead>
                            <TableHead>Tax Type</TableHead>
                            <TableHead>Amount (LKR)</TableHead>
                             <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {taxPayments.map((tax, index) => (
                            <TableRow key={index}>
                                <TableCell>{tax.year}</TableCell>
                                <TableCell>{tax.type}</TableCell>
                                <TableCell>{tax.amount}</TableCell>
                                <TableCell>{tax.dueDate}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 text-xs rounded-full ${tax.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {tax.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    {tax.status === 'Due' && <Button size="sm" asChild>
                                        <Link href={`/payment?service=Tax+Payment&amount=${tax.amount}&ref=TAX-${tax.year}-Q1`}>Pay Now</Link>
                                    </Button>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Upload Income Documents</CardTitle>
                <p className="text-sm text-muted-foreground">Upload your salary slips, business income statements, or other relevant documents for the current tax year.</p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload label="Salary Slips" />
                <FileUpload label="Other Income Proof" />
            </CardContent>
            <CardFooter>
                <Button>Upload Files</Button>
            </CardFooter>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Download Certificates</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
                <Button variant="secondary">Download Tax Clearance Certificate 2023</Button>
                <Button variant="secondary">Download Income Statement 2023</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>FAQs & Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
                 <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is the deadline for filing income tax returns?</AccordionTrigger>
                        <AccordionContent>
                        The deadline for filing your annual income tax return is typically November 30th of the following year.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How do I get a TIN (Taxpayer Identification Number)?</AccordionTrigger>
                        <AccordionContent>
                        You can register for a TIN online through the IRD e-Services portal or by visiting the nearest IRD office.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    </div>
  );
}

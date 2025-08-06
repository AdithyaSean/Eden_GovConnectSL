"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export function PensionDepartmentService({ service }) {
  return (
    <div className="space-y-8">
         <Card>
            <CardHeader>
                <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
                 <Input placeholder="Enter Application Reference Number to track" className="mb-4" />
                <div className="flex items-center gap-4">
                    <Progress value={60} className="w-full" />
                    <span className="text-lg font-bold">60%</span>
                </div>
                 <p className="text-sm text-muted-foreground mt-2">Current stage: Departmental Approval</p>
            </CardContent>
            <CardFooter>
                <Button>Check Status</Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Pension Application Form</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="pensionerName">Name of Retiree</Label>
                    <Input id="pensionerName" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pensionerNIC">NIC Number</Label>
                    <Input id="pensionerNIC" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="lastWorkplace">Last Place of Work</Label>
                    <Input id="lastWorkplace" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="retirementDate">Date of Retirement</Label>
                    <Input id="retirementDate" type="date" />
                </div>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Document Checklist & Upload</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload label="Service Certificate" />
                <FileUpload label="Retirement Letter" />
                <FileUpload label="Copy of NIC" />
                <FileUpload label="Bank Account Details Confirmation" />
            </CardContent>
             <CardFooter>
                <Button>Submit Application</Button>
            </CardFooter>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Bank Detail Form</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="branchName">Branch Name</Label>
                    <Input id="branchName" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input id="accountNumber" />
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="secondary">Save Bank Details</Button>
            </CardFooter>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Help & FAQs</CardTitle>
            </CardHeader>
            <CardContent>
                 <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>How long does the pension process take?</AccordionTrigger>
                        <AccordionContent>
                        The process typically takes 3-6 months from the date of retirement if all documents are submitted correctly.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How can I update my address?</AccordionTrigger>
                        <AccordionContent>
                        You can update your address by submitting a written request to the Pensions Department along with proof of your new address.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    </div>
  );
}

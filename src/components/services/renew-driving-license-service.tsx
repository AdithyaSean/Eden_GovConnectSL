"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { useState } from 'react';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';

export function RenewDrivingLicenseService({ service }) {
    const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Renewal Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <Progress value={25} className="w-full" />
                    <span className="text-lg font-bold">25%</span>
                </div>
                 <p className="text-sm text-muted-foreground mt-2">Current stage: Application Form Filled</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Eligibility Guidelines</CardTitle>
            </CardHeader>
             <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Your current driving license must be valid or expired for less than 1 year.</li>
                    <li>You must be medically fit to drive. A medical certificate is required for applicants over 50.</li>
                    <li>No pending traffic violations or court cases related to driving.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Online Renewal Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" placeholder="As per your NIC" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nic">NIC Number</Label>
                        <Input id="nic" placeholder="e.g., 199012345V" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="licenseNumber">Current License Number</Label>
                        <Input id="licenseNumber" placeholder="e.g., B1234567" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input id="expiryDate" type="date" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" placeholder="Your permanent address" />
                </div>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload label="Copy of Old Driving License" />
                <FileUpload label="Medical Fitness Report" />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Schedule an Appointment</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
                 <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Payment Section</CardTitle>
            </CardHeader>
             <CardContent>
                <p className="text-muted-foreground mb-4">The total renewal fee is LKR 2,500.00. Please proceed to payment.</p>
                <Button size="lg">Pay Now</Button>
            </CardContent>
        </Card>

    </div>
  );
}

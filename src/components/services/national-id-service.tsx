
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Calendar } from '../ui/calendar';
import { useState } from 'react';

export function NationalIdService({ service }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [serviceType, setServiceType] = useState("new-id");

  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Check Application Status</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
                <Input placeholder="Enter your Application Reference Number" />
                <Button>Check Status</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Select Service Type</CardTitle>
            </CardHeader>
            <CardContent>
                <RadioGroup defaultValue={serviceType} onValueChange={setServiceType}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="new-id" id="new-id" />
                        <Label htmlFor="new-id">Apply for New ID (First Time)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="update-id" id="update-id" />
                        <Label htmlFor="update-id">Update Details on Existing ID</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lost-id" id="lost-id" />
                        <Label htmlFor="lost-id">Apply for Duplicate of Lost ID</Label>
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Upload Required Documents</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {serviceType === 'new-id' && (
                    <FileUpload label="Birth Certificate" />
                )}
                
                {(serviceType === 'new-id' || serviceType === 'update-id' || serviceType === 'lost-id') && (
                    <FileUpload label="Certified Photo" />
                )}

                {(serviceType === 'new-id' || serviceType === 'update-id') && (
                    <FileUpload label="Grama Niladhari Certificate" />
                )}

                {serviceType === 'lost-id' && (
                    <FileUpload label="Police Report (for Lost ID)" />
                )}
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Book an Appointment for Biometrics</CardTitle>
                <p className="text-sm text-muted-foreground">Schedule a visit to your nearest Divisional Secretariat for fingerprint and photo capture.</p>
            </CardHeader>
            <CardContent className="flex justify-center">
                 <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    />
            </CardContent>
            <CardFooter>
                 <Button>Confirm Appointment</Button>
            </CardFooter>
        </Card>
    </div>
  );
}

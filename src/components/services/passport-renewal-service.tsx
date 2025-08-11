
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';
import { FormEvent, useState } from 'react';

type UploadedFilesState = {
  [key: string]: string;
};

export function PassportRenewalService({ service }) {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesState>({});

  const handleUploadComplete = (docName: string, url: string) => {
    setUploadedFiles(prev => ({ ...prev, [docName]: url }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trackingNumber = `PP-${Date.now().toString().slice(-6)}`;
    console.log("Submitting with files:", uploadedFiles);
    toast({
        title: "Renewal Request Submitted",
        description: `Your application has been received. Your tracking number is ${trackingNumber}.`,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Passport Renewal Form</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" placeholder="As it appears on your NIC" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nicNumber">NIC Number</Label>
                        <Input id="nicNumber" placeholder="e.g., 199012345V" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="oldPassport">Old Passport Number</Label>
                        <Input id="oldPassport" placeholder="e.g., N1234567" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="expiryDate">Date of Expiry</Label>
                        <Input id="expiryDate" type="date" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input id="contactNumber" type="tel" placeholder="+94 77 123 4567" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="you@example.com" required />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Upload Documents</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FileUpload 
                        id="old-passport-upload"
                        label="Scanned Copy of Old Passport"
                        onUploadComplete={(url) => handleUploadComplete("oldPassport", url)}
                    />
                    <FileUpload 
                        id="photo-upload"
                        label="Recent Passport-size Photograph"
                        onUploadComplete={(url) => handleUploadComplete("photo", url)}
                    />
                    <FileUpload
                        id="nic-upload"
                        label="Copy of NIC"
                        onUploadComplete={(url) => handleUploadComplete("nic", url)}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Submit Application</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-sm text-muted-foreground">Please review all your details before submitting. Once submitted, you will receive a tracking number which can be used in the "My Applications" section.</p>
                </CardContent>
                <CardFooter>
                    <Button type="submit" size="lg">Submit Renewal Request</Button>
                </CardFooter>
            </Card>
        </div>
    </form>
  );
}

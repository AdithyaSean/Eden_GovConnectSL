
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';
import { FormEvent, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

type UploadedFilesState = {
  [key: string]: string;
};

const requiredDocs = ["Scanned Copy of Old Passport", "Recent Passport-size Photograph", "Copy of NIC"];

export function PassportRenewalService({ service }) {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesState>({});
  const { user } = useAuth();
  const router = useRouter();
  
  const isReadyToSubmit = requiredDocs.every(doc => uploadedFiles[doc.replace(/ /g, '')]);

  const handleUploadComplete = (docName: string, url: string) => {
    setUploadedFiles(prev => ({ ...prev, [docName]: url }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
        toast({ title: "Please log in to submit.", variant: "destructive" });
        return;
    }

    const formData = new FormData(e.target);
    const formDetails = Object.fromEntries(formData.entries());

    try {
         await addDoc(collection(db, "applications"), {
            service: service.title,
            userId: user.id,
            user: user.name,
            status: "Pending",
            submitted: serverTimestamp(),
            documents: uploadedFiles,
            details: formDetails
        });

        toast({
            title: "Renewal Request Submitted",
            description: `Your application has been received and is now available in 'My Applications'.`,
        });

        router.push("/my-applications");
    } catch (error) {
         console.error("Error submitting application: ", error);
         toast({ title: "Submission Failed", description: "An error occurred. Please try again.", variant: "destructive"});
    }
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
                        <Input id="fullName" name="fullName" placeholder="As it appears on your NIC" required defaultValue={user?.name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nicNumber">NIC Number</Label>
                        <Input id="nicNumber" name="nicNumber" placeholder="e.g., 199012345V" required defaultValue={user?.nic} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="oldPassport">Old Passport Number</Label>
                        <Input id="oldPassport" name="oldPassport" placeholder="e.g., N1234567" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="expiryDate">Date of Expiry</Label>
                        <Input id="expiryDate" name="expiryDate" type="date" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input id="contactNumber" name="contactNumber" type="tel" placeholder="+94 77 123 4567" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" placeholder="you@example.com" required defaultValue={user?.email}/>
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
                     <p className="text-sm text-muted-foreground">Please review all your details before submitting. Once submitted, you can track its status in the "My Applications" section.</p>
                </CardContent>
                <CardFooter>
                    <Button type="submit" size="lg" disabled={!isReadyToSubmit}>Submit Renewal Request</Button>
                </CardFooter>
            </Card>
        </div>
    </form>
  );
}

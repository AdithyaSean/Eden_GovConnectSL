
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

type UploadedFilesState = {
  [key: string]: string;
};


export function LandRegistryService({ service }) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesState>({});
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const requiredDocs = ["Deed / Title Document", "Survey Plan"];
  const isReadyToSubmit = requiredDocs.every(doc => uploadedFiles[doc.replace(/\s|\//g, '')]);

  const handleUploadComplete = (docName: string, url: string) => {
    setUploadedFiles(prev => ({ ...prev, [docName.replace(/\s|\//g, '')]: url }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: "Please log in to submit.", variant: "destructive" });
        return;
    }
    if (!isReadyToSubmit) {
        toast({ title: "Please upload all required documents.", variant: "destructive" });
        return;
    }

    try {
        await addDoc(collection(db, "applications"), {
            service: service.title,
            userId: user.id,
            user: user.name,
            status: "Pending Payment",
            submitted: serverTimestamp(),
            documents: uploadedFiles,
        });

        toast({
            title: "Application Details Saved",
            description: "Please proceed to payment to complete your submission.",
        });
        
        router.push(`/payment?service=${encodeURIComponent(service.title)}&amount=1000.00`);

    } catch (error) {
        console.error("Error submitting application: ", error);
        toast({ title: "Submission Failed", description: "An error occurred. Please try again.", variant: "destructive"});
    }
  }


  return (
    <div className="space-y-8">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Records</TabsTrigger>
            <TabsTrigger value="register">New Registration</TabsTrigger>
          </TabsList>
          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>Search for Land Records</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="deedNumber">Deed Number</Label>
                        <Input id="deedNumber" placeholder="e.g., 1234/56" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="ownerName">Owner's Name</Label>
                        <Input id="ownerName" placeholder="Full name of the owner" />
                    </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Search Records</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleSubmit}>
                <Card>
                <CardHeader>
                    <CardTitle>Apply for New Land Registration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold">Property Details</h3>
                        <div className="space-y-2">
                            <Label htmlFor="propertyAddress">Property Address</Label>
                            <Textarea id="propertyAddress" placeholder="Full address of the land" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold">Upload Documents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FileUpload label="Deed / Title Document" id="deed-upload" onUploadComplete={(url) => handleUploadComplete("Deed/TitleDocument", url)} />
                            <FileUpload label="Survey Plan" id="survey-plan-upload" onUploadComplete={(url) => handleUploadComplete("SurveyPlan", url)} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold">Applicable Fees</p>
                        <p className="text-muted-foreground">Stamp Duty: 4%, Registration Fee: LKR 1,000</p>
                    </div>
                    <Button type="submit" disabled={!isReadyToSubmit}>Submit for Registration</Button>
                </CardFooter>
                </Card>
            </form>
          </TabsContent>
        </Tabs>
         <Card>
            <CardHeader>
                <CardTitle>Contact Regional Offices</CardTitle>
            </CardHeader>
            <CardContent>
                <p><strong>Colombo Land Registry:</strong> 011-2694561</p>
                <p><strong>Kandy Land Registry:</strong> 081-2223456</p>
                <p><strong>Galle Land Registry:</strong> 091-2232456</p>
            </CardContent>
        </Card>
    </div>
  );
}

    

"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Calendar } from '../ui/calendar';
import { useState, FormEvent, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

type UploadedFilesState = {
  [key: string]: { url: string; path: string; };
};

export function NationalIdService({ service }) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [serviceType, setServiceType] = useState("new-id");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesState>({});
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setDate(new Date());
  }, []);

  const handleUploadComplete = (docName: string, url: string, path: string) => {
    setUploadedFiles(prev => ({ ...prev, [docName]: { url, path } }));
  };
  
  const getDocumentsForServiceType = () => {
    switch (serviceType) {
        case 'new-id':
            return ["Birth Certificate", "Certified Photo", "Grama Niladhari Certificate"];
        case 'update-id':
            return ["Certified Photo", "Grama Niladhari Certificate"];
        case 'lost-id':
            return ["Police Report (for Lost ID)", "Certified Photo"];
        default:
            return [];
    }
  }

  const requiredDocs = getDocumentsForServiceType();
  const isReadyToSubmit = requiredDocs.length > 0 && requiredDocs.every(doc => uploadedFiles[doc]);

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

    const documentsForFirestore = Object.fromEntries(
        Object.entries(uploadedFiles).map(([key, value]) => [key, value.url])
    );

    try {
        await addDoc(collection(db, "applications"), {
            service: service.title,
            userId: user.id,
            user: user.name,
            status: "Pending",
            submitted: serverTimestamp(),
            documents: documentsForFirestore,
            details: {
                serviceType,
                appointmentDate: date
            }
        });
        toast({
            title: "Application Submitted",
            description: "Your National ID application has been received.",
        });
        router.push("/my-applications");
    } catch (error) {
        console.error("Error submitting application: ", error);
        toast({ title: "Submission Failed", description: "An error occurred. Please try again.", variant: "destructive"});
    }
  }

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

        <form onSubmit={handleSubmit}>
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Select Service Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup defaultValue={serviceType} onValueChange={(value) => { setServiceType(value); setUploadedFiles({})}}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="new-id" id="r-new-id" />
                                <Label htmlFor="r-new-id">Apply for New ID (First Time)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="update-id" id="r-update-id" />
                                <Label htmlFor="r-update-id">Update Details on Existing ID</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="lost-id" id="r-lost-id" />
                                <Label htmlFor="r-lost-id">Apply for Duplicate of Lost ID</Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upload Required Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {requiredDocs.map(doc => {
                             const id = `file-upload-${serviceType}-${doc.replace(/\s+/g, '-')}`;
                             return (
                                 <FileUpload
                                     key={id}
                                     id={id}
                                     label={doc}
                                     onUploadComplete={(url, path) => handleUploadComplete(doc, url, path)}
                                 />
                             )
                         })}
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Book an Appointment for Biometrics</CardTitle>
                        <p className="text-sm text-muted-foreground">Schedule a visit to your nearest Divisional Secretariat for fingerprint and photo capture.</p>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        {date ? <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                            /> : <div className="h-[290px] w-[280px] flex items-center justify-center"><p>Loading calendar...</p></div> }
                    </CardContent>
                </Card>
                 <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={!isReadyToSubmit}>Submit Application</Button>
                </div>
            </div>
        </form>
    </div>
  );
}

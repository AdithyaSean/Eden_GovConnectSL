
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Calendar } from '../ui/calendar';
import { useState, FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';

type UploadedFilesState = {
  [key: string]: string;
};

export function NationalIdService({ service }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [serviceType, setServiceType] = useState("new-id");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesState>({});
  const { toast } = useToast();

  const handleUploadComplete = (docName: string, url: string) => {
    setUploadedFiles(prev => ({ ...prev, [docName]: url }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitting with files:", uploadedFiles);
    toast({
        title: "Application Submitted",
        description: "Your National ID application has been received.",
    })
  }

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
                                     onUploadComplete={(url) => handleUploadComplete(doc, url)}
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
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                            />
                    </CardContent>
                </Card>
                 <div className="flex justify-end">
                    <Button type="submit" size="lg">Submit Application</Button>
                </div>
            </div>
        </form>
    </div>
  );
}

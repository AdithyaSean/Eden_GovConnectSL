
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const documentsMap = {
  nic: ["Police Report", "Birth Certificate", "Certified Photograph"],
  passport: ["Police Report", "National Identity Card Copy", "Birth Certificate Copy"],
  driving_license: ["Police Report", "National Identity Card Copy", "Medical Certificate (if applicable)"],
};

type UploadedFilesState = {
  [key: string]: string;
};


export function MissingDocumentsService({ service }) {
  const [selectedService, setSelectedService] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesState>({});
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const requiredDocs = selectedService ? documentsMap[selectedService] : [];
  const isReadyToSubmit = requiredDocs.length > 0 && requiredDocs.every(doc => uploadedFiles[doc.replace(/\s+/g, '-')]);

  const handleUploadComplete = (docName: string, base64: string) => {
    setUploadedFiles(prev => ({ ...prev, [docName]: base64 }));
  };
  
  const handleFileRemove = (docName: string) => {
    setUploadedFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[docName];
        return newFiles;
    });
  }
  
  const handleSubmit = async () => {
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
            status: "Pending",
            submitted: serverTimestamp(),
            documents: uploadedFiles
        });

        toast({
            title: "Application Submitted",
            description: "Your request to replace a missing document has been submitted.",
        });
        
        router.push("/my-applications");

    } catch (error) {
        console.error("Error submitting application: ", error);
        toast({ title: "Submission Failed", description: "An error occurred. Please try again.", variant: "destructive"});
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report and Replace Missing Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Document Type</label>
          <Select onValueChange={setSelectedService} value={selectedService}>
            <SelectTrigger>
              <SelectValue placeholder="Select the document you lost" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nic">National Identity Card (NIC)</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="driving_license">Driving License</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedService && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Required Documents:</h3>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                {requiredDocs.map(doc => <li key={doc}>{doc}</li>)}
              </ul>
            </div>
            
            <h3 className="font-semibold pt-4 border-t">Upload Your Documents:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requiredDocs.map(doc => {
                    const docId = doc.replace(/\s+/g, '-');
                    return (
                        <FileUpload 
                            key={docId} 
                            id={`file-upload-${docId}`}
                            label={doc}
                            onUploadComplete={(base64) => handleUploadComplete(docId, base64)}
                            onFileRemove={() => handleFileRemove(docId)}
                        />
                    )
                })}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Save Progress</Button>
        <Button disabled={!isReadyToSubmit} onClick={handleSubmit}>Submit Application</Button>
      </CardFooter>
    </Card>
  );
}


"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { useState, FormEvent, useEffect } from 'react';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';


type UploadedFilesState = {
  [key: string]: string;
};

const renewalDocs = ["oldLicense", "medicalReport"];
const newDocs = ["nicCopy", "medicalReport", "birthCertificate"];

export function RenewDrivingLicenseService({ service }) {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [serviceType, setServiceType] = useState('renewal');
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesState>({});
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        setDate(new Date());
    }, []);

    const requiredDocs = serviceType === 'renewal' ? renewalDocs : newDocs;
    const isReadyToSubmit = requiredDocs.every(doc => uploadedFiles[doc]);

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

    const handleServiceTypeChange = (value: string) => {
        setServiceType(value);
        setUploadedFiles({});
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) {
            toast({ title: "Please log in to submit.", variant: "destructive" });
            return;
        }
        if (!isReadyToSubmit) {
            toast({ title: "Please upload all required documents.", variant: "destructive" });
            return;
        }

        const formData = new FormData(e.target as HTMLFormElement);
        const formDetails = Object.fromEntries(formData.entries());
        
        try {
            await addDoc(collection(db, "applications"), {
                service: service.title,
                userId: user.id,
                user: user.name,
                status: "Pending Payment",
                submitted: serverTimestamp(),
                documents: uploadedFiles,
                details: { ...formDetails, appointmentDate: date, serviceType }
            });
            toast({
                title: "Application Saved Successfully",
                description: "Your application has been saved. Please proceed with the payment to complete the process.",
            });
            setShowPaymentDialog(true);
        } catch (error) {
            console.error("Error submitting application: ", error);
            toast({ title: "Submission Failed", description: "An error occurred. Please try again.", variant: "destructive"});
        }
    }

  return (
    <>
      <form onSubmit={handleSubmit}>
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
                        <CardTitle>Select Service</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup defaultValue={serviceType} onValueChange={handleServiceTypeChange} className="flex gap-8">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="renewal" id="dl-renewal" />
                                <Label htmlFor="dl-renewal">Renew Existing Licence</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="new" id="dl-new" />
                                <Label htmlFor="dl-new">Apply for New Licence</Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>

              <Card>
                  <CardHeader>
                      <CardTitle>Eligibility Guidelines</CardTitle>
                  </CardHeader>
                   <CardContent>
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                          <li>For Renewal: Your current driving license must be valid or expired for less than 1 year.</li>
                          <li>For New Licence: You must be over 18 years of age.</li>
                          <li>You must be medically fit to drive. A medical certificate is required for applicants over 50 or for certain vehicle classes.</li>
                          <li>No pending traffic violations or court cases related to driving.</li>
                      </ul>
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader>
                      <CardTitle>Online Application Form</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label htmlFor="fullName">Full Name</Label>
                              <Input id="fullName" name="fullName" placeholder="As per your NIC" required defaultValue={user?.name}/>
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="nic">NIC Number</Label>
                              <Input id="nic" name="nic" placeholder="e.g., 199012345V" required defaultValue={user?.nic}/>
                          </div>
                           {serviceType === 'renewal' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="licenseNumber">Current License Number</Label>
                                    <Input id="licenseNumber" name="licenseNumber" placeholder="e.g., B1234567" required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="expiryDate">Expiry Date</Label>
                                    <Input id="expiryDate" name="expiryDate" type="date" required/>
                                </div>
                            </>
                           )}
                      </div>
                       <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Textarea id="address" name="address" placeholder="Your permanent address" required/>
                      </div>
                  </CardContent>
              </Card>

               <Card>
                  <CardHeader>
                      <CardTitle>Upload Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {serviceType === 'renewal' ? (
                        <>
                            <FileUpload 
                                id="old-license-upload"
                                label="Copy of Old Driving License"
                                onUploadComplete={(base64) => handleUploadComplete("oldLicense", base64)}
                                onFileRemove={() => handleFileRemove("oldLicense")}
                            />
                            <FileUpload 
                                id="medical-report-upload"
                                label="Medical Fitness Report" 
                                onUploadComplete={(base64) => handleUploadComplete("medicalReport", base64)}
                                onFileRemove={() => handleFileRemove("medicalReport")}
                            />
                        </>
                    ) : (
                        <>
                            <FileUpload 
                                id="new-nic-upload"
                                label="Copy of NIC"
                                onUploadComplete={(base64) => handleUploadComplete("nicCopy", base64)}
                                onFileRemove={() => handleFileRemove("nicCopy")}
                            />
                            <FileUpload 
                                id="new-medical-upload"
                                label="Medical Fitness Report" 
                                onUploadComplete={(base64) => handleUploadComplete("medicalReport", base64)}
                                onFileRemove={() => handleFileRemove("medicalReport")}
                            />
                            <FileUpload 
                                id="new-bc-upload"
                                label="Copy of Birth Certificate" 
                                onUploadComplete={(base64) => handleUploadComplete("birthCertificate", base64)}
                                onFileRemove={() => handleFileRemove("birthCertificate")}
                            />
                        </>
                    )}
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader>
                      <CardTitle>Schedule an Appointment</CardTitle>
                       <CardDescription>For new applicants, this will be for the written exam. For renewals, this is for biometrics.</CardDescription>
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

              <Card>
                  <CardHeader>
                      <CardTitle>Payment & Submission</CardTitle>
                  </CardHeader>
                   <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">The total fee is LKR 2,500.00 for renewals and LKR 3,500.00 for new applications. Please complete the form and upload documents, then proceed to payment by clicking the button below.</p>
                  </CardContent>
                  <CardFooter>
                      <Button size="lg" type="submit" disabled={!isReadyToSubmit}>
                          Save and Proceed to Payment
                      </Button>
                  </CardFooter>
              </Card>

          </div>
      </form>
       <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Proceed to Payment?</AlertDialogTitle>
            <AlertDialogDescription>
              Your application has been saved. Would you like to proceed to the payment gateway now to complete your submission? The fee is LKR {serviceType === 'renewal' ? '2,500.00' : '3,500.00'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => router.push('/my-applications')}>
              Pay Later
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push(`/payment?service=${encodeURIComponent(service.title)}&amount=${serviceType === 'renewal' ? '2500.00' : '3500.00'}`)}>
              Pay Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

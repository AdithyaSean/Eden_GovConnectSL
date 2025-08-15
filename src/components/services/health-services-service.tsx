
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Calendar } from '../ui/calendar';
import { useState, FormEvent, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Label } from '../ui/label';
import { Download } from 'lucide-react';

type UploadedFilesState = {
  [key: string]: string;
};

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"];

export function HealthServicesService({ service }) {
    const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(undefined);
    const [appointmentTime, setAppointmentTime] = useState<string>("");
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesState>({});
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        setAppointmentDate(new Date());
    }, []);

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
    
    const handleAppointmentSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast({ title: "Please log in.", variant: "destructive" });
            return;
        }

        const formData = new FormData(e.target as HTMLFormElement);
        const appointmentDetails = Object.fromEntries(formData.entries());
        
        if(!appointmentDetails.hospital || !appointmentDetails.speciality || !appointmentDate || !appointmentTime) {
             toast({ title: "Please select hospital, speciality, date, and time.", variant: "destructive" });
            return;
        }

        const finalAppointmentDate = new Date(appointmentDate);
        const [hours, minutes, ampm] = appointmentTime.match(/(\d{2}):(\d{2}) (AM|PM)/)!.slice(1);
        let numericHours = parseInt(hours, 10);
        if (ampm === 'PM' && numericHours !== 12) {
            numericHours += 12;
        }
        if (ampm === 'AM' && numericHours === 12) {
            numericHours = 0;
        }
        finalAppointmentDate.setHours(numericHours, parseInt(minutes, 10), 0, 0);
        
        try {
            await addDoc(collection(db, "applications"), {
                service: "Medical Appointment Request",
                userId: user.id,
                user: user.name,
                status: "Pending",
                submitted: serverTimestamp(),
                details: {
                    ...appointmentDetails,
                    appointmentDate: Timestamp.fromDate(finalAppointmentDate)
                },
                documents: uploadedFiles,
            });

            toast({ title: "Appointment Requested", description: "Your request has been sent. You will be notified upon confirmation." });
            router.push('/my-applications');
        } catch(error) {
             console.error(error);
             toast({ title: "Request Failed", variant: "destructive"});
        }
    }


  return (
    <div className="space-y-8">
        <form onSubmit={handleAppointmentSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Book a Hospital/Clinic Appointment</CardTitle>
                    <p className="text-sm text-muted-foreground">You can also upload any existing medical reports or prescriptions to help the doctor prepare for your visit.</p>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Select Hospital/Clinic</Label>
                                <Select name="hospital">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hospital-colombo">National Hospital, Colombo</SelectItem>
                                        <SelectItem value="hospital-kandy">Teaching Hospital, Kandy</SelectItem>
                                        <SelectItem value="clinic-galle">Family Clinic, Galle</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Select Speciality/Service</Label>
                                <Select name="speciality">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="opd">General OPD</SelectItem>
                                        <SelectItem value="cardiology">Cardiology</SelectItem>
                                        <SelectItem value="dental">Dental</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Select Time</Label>
                                 <Select onValueChange={setAppointmentTime} value={appointmentTime}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a time slot" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeSlots.map(slot => (
                                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            {appointmentDate ? <Calendar
                                mode="single"
                                selected={appointmentDate}
                                onSelect={setAppointmentDate}
                                className="rounded-md border"
                            /> : <div className="h-[290px] w-[280px] flex items-center justify-center"><p>Loading calendar...</p></div> }
                        </div>
                    </div>
                     <div className="pt-8 border-t">
                        <h3 className="text-lg font-medium mb-4">Medical Records & History (Optional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FileUpload
                                id="prescriptions-upload"
                                label="Upload Prescriptions" 
                                onUploadComplete={(base64) => handleUploadComplete("prescriptions", base64)}
                                onFileRemove={() => handleFileRemove("prescriptions")}
                            />
                            <FileUpload
                                id="medical-reports-upload"
                                label="Upload Medical Reports"
                                onUploadComplete={(base64) => handleUploadComplete("medicalReports", base64)}
                                onFileRemove={() => handleFileRemove("medicalReports")}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit">Request Appointment</Button>
                </CardFooter>
            </Card>
        </form>

        <Card>
            <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
                <p><strong>Suwa Seriya (Ambulance):</strong> 1990</p>
                <p><strong>National Hospital Colombo:</strong> 011-2691111</p>
            </CardContent>
        </Card>
    </div>
  );
}


"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useState, FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Textarea } from '../ui/textarea';

export function ExamRecorrectionAppealService({ service }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  
  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      e.target.value = value.replace(/\D/g, '');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
        toast({ title: "Please log in to submit.", variant: "destructive" });
        return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const appealDetails = Object.fromEntries(formData.entries());

    if (!appealDetails.examType || !appealDetails.indexNumber || !appealDetails.year || !appealDetails.subject || !appealDetails.reason) {
        toast({ title: "Please fill all fields.", variant: "destructive" });
        return;
    }
    
    try {
        await addDoc(collection(db, "applications"), {
            service: "Exam Re-correction Appeal",
            userId: user.id,
            user: user.name,
            status: "Pending",
            submitted: serverTimestamp(),
            details: appealDetails
        });
        toast({
            title: "Appeal Submitted",
            description: "Your re-correction appeal has been submitted successfully.",
        });
        router.push('/my-applications');
    } catch(error) {
        console.error("Error submitting appeal: ", error);
        toast({ title: "Submission Failed", description: "An error occurred. Please try again.", variant: "destructive"});
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        <Card>
            <CardHeader>
                <CardTitle>Submit Re-correction Appeal</CardTitle>
                <CardDescription>
                    Fill out the form below to apply for a re-correction of your exam results. Please ensure all details are accurate. A fee may be applicable upon submission.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Exam Type</Label>
                        <Select name="examType">
                            <SelectTrigger>
                                <SelectValue placeholder="Select Exam" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="GCE A/L">G.C.E. Advanced Level</SelectItem>
                                <SelectItem value="GCE O/L">G.C.E. Ordinary Level</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="indexNumber">Index Number</Label>
                        <Input id="indexNumber" name="indexNumber" placeholder="e.g., 1234567" type="number" onChange={handleNumericInput} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" name="year" type="number" placeholder="e.g., 2023" onChange={handleNumericInput} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="subject">Subject for Appeal</Label>
                    <Input id="subject" name="subject" placeholder="e.g., Combined Mathematics" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Appeal</Label>
                    <Textarea id="reason" name="reason" placeholder="Briefly explain why you are requesting a re-correction." />
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit">Submit Appeal</Button>
            </CardFooter>
        </Card>
    </form>
  );
}


"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FormEvent } from "react";


export default function SupportPage() {
    const { toast } = useToast();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        toast({
            title: "Support Ticket Submitted",
            description: "Thank you for contacting us. Our team will get back to you shortly.",
        });
        // Here you would typically handle the form submission, e.g., send to a backend service
    }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Support & Resources</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Frequently Asked Questions</CardTitle>
                        <CardDescription>Find quick answers to common questions about our services.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                                <AccordionContent>
                                You can reset your password by clicking the "Forgot Password" link on the login page and following the on-screen instructions.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>What documents are needed for a new NIC?</AccordionTrigger>
                                <AccordionContent>
                                For a new National ID card, you typically need your birth certificate, certified photos, and a certificate from your Grama Niladhari.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>How can I track my application status?</AccordionTrigger>
                                <AccordionContent>
                                 You can track the status of all your submitted applications under the "My Applications" section in the main navigation.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger>Is my data secure on this platform?</AccordionTrigger>
                                <AccordionContent>
                                 Yes, we use industry-standard encryption and security protocols to protect all your personal information and application data.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
            
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Support</CardTitle>
                        <CardDescription>Can't find an answer? Fill out the form below to open a support ticket.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Your Name" required/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="Your Email Address" required/>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" placeholder="e.g., Issue with Passport Application" required/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="Please describe your issue in detail." required/>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Submit Ticket</Button>
                    </CardFooter>
                </Card>
            </form>

        </div>

      </div>
    </DashboardLayout>
  );
}

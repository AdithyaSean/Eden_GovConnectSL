"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Download, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const jobs = [
    { title: "Construction Worker", company: "BuildWell Constructions", location: "Colombo" },
    { title: "Electrician", company: "Spark Solutions", location: "Kandy" },
    { title: "Plumber", company: "AquaFix Services", location: "Galle" },
    { title: "IT Technician", company: "TechPro Lanka", location: "Colombo" },
];

export function TaqdeerService({ service }) {
  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Job Board</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <Input placeholder="Search by job title or keyword..." className="flex-grow" />
                    <Select>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by Location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="colombo">Colombo</SelectItem>
                            <SelectItem value="kandy">Kandy</SelectItem>
                            <SelectItem value="galle">Galle</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button><Search className="mr-2 h-4 w-4" /> Search Jobs</Button>
                </div>
                <div className="space-y-4">
                    {jobs.map(job => (
                        <div key={job.title} className="p-4 border rounded-lg flex justify-between items-center">
                            <div>
                                <h4 className="font-bold">{job.title}</h4>
                                <p className="text-sm text-muted-foreground">{job.company} - {job.location}</p>
                            </div>
                            <Button variant="secondary">View & Apply</Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Worker Registration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="workerName">Full Name</Label>
                        <Input id="workerName" placeholder="Your full name" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="workerNic">NIC Number</Label>
                        <Input id="workerNic" placeholder="Your NIC number" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="skill">Primary Skill / Trade</Label>
                        <Input id="skill" placeholder="e.g., Mason, Carpenter" />
                    </div>
                    <Button className="w-full">Register</Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Lodge a Complaint</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="complaintSubject">Subject</Label>
                        <Input id="complaintSubject" placeholder="Briefly describe the issue" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="complaintDetails">Complaint Details</Label>
                        <Textarea id="complaintDetails" placeholder="Provide full details of your complaint" />
                    </div>
                    <FileUpload label="Attach Supporting Documents" />
                    <Button className="w-full">Submit Complaint</Button>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Welfare Schemes & Guides</CardTitle>
            </CardHeader>
            <CardContent>
                 <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Insurance Scheme</AccordionTrigger>
                        <AccordionContent>
                        All registered workers are eligible for a comprehensive insurance scheme covering health and accidents. Details about claims and benefits can be found in the downloadable guide.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Pension Plan</AccordionTrigger>
                        <AccordionContent>
                        A dedicated pension plan is available for workers who contribute for a minimum of 10 years. This ensures financial security after retirement.
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-3">
                        <AccordionTrigger>Downloadable Guides</AccordionTrigger>
                        <AccordionContent className="space-y-3">
                            <a href="#" className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"><Download className="w-4 h-4" /> Worker's Handbook.pdf</a>
                            <a href="#" className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"><Download className="w-4 h-4" /> Safety Guidelines.pdf</a>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
                <p><strong>Hotline:</strong> 1988</p>
                <p><strong>Email:</strong> contact@taqdeer.gov.lk</p>
                <p><strong>Address:</strong> 123, Labour Secretariat, Colombo 05</p>
            </CardContent>
        </Card>
    </div>
  );
}

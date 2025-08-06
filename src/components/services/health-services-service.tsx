
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Download, PlusCircle } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const vaccinationRecords = [
    { name: "COVID-19 (Dose 1)", date: "2021-06-15", provider: "National Hospital" },
    { name: "COVID-19 (Dose 2)", date: "2021-08-20", provider: "National Hospital" },
    { name: "Tetanus Toxoid", date: "2018-03-10", provider: "Local Clinic" },
];

const medicalReports = [
    { name: "Full Blood Count Report", date: "2023-11-05", id: "REP-001" },
    { name: "X-Ray Chest Report", date: "2022-09-21", id: "REP-002" },
]

export function HealthServicesService({ service }) {
    const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>My Vaccination Records</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vaccine Name</TableHead>
                            <TableHead>Date Administered</TableHead>
                            <TableHead>Provider</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vaccinationRecords.map((record) => (
                            <TableRow key={record.name}>
                                <TableCell className="font-medium">{record.name}</TableCell>
                                <TableCell>{record.date}</TableCell>
                                <TableCell>{record.provider}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
             <CardFooter>
                <Button variant="outline">Download Full Report</Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Book a Hospital/Clinic Appointment</CardTitle>
            </CardHeader>
             <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Select Hospital/Clinic</Label>
                        <Select>
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
                        <Select>
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
                </div>
                 <div className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button>Request Appointment</Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Apply for National Medical ID Card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FileUpload label="Upload Copy of NIC/Birth Certificate" />
                <FileUpload label="Upload Passport-size Photograph" />
            </CardContent>
             <CardFooter>
                <Button>Submit Application</Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Download Medical Reports</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Report Name</TableHead>
                            <TableHead>Date Issued</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {medicalReports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell className="font-medium">{report.name}</TableCell>
                                <TableCell>{report.date}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
             <CardFooter>
                <Button variant="secondary"><PlusCircle className="mr-2 h-4 w-4" /> Request New Report</Button>
            </CardFooter>
        </Card>
        
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

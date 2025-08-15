
"use client";

import { use, useEffect, useState, useRef } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import type { Application, User } from '@/lib/types';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { Printer, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Image from 'next/image';

async function getApplicationData(applicationId: string): Promise<{ application: Application, applicant: User | null } | null> {
    const docRef = doc(db, 'applications', applicationId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const application = { id: docSnap.id, ...docSnap.data() } as Application;
        let applicant: User | null = null;
        if (application.userId) {
            const userDocRef = doc(db, 'users', application.userId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                applicant = { id: userDocSnap.id, ...userDocSnap.data() } as User;
            }
        }
        return { application, applicant };
    }
    return null;
}

export default function PrintableApplicationPage({ params }: { params: { id: string } }) {
    const { id } = use(params);
    const { user, loading: authLoading } = useAuth();
    const [application, setApplication] = useState<Application | null>(null);
    const [applicant, setApplicant] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchApplication = async () => {
            setLoading(true);
            const data = await getApplicationData(id);
            if (data) {
                setApplication(data.application);
                setApplicant(data.applicant);
            }
            setLoading(false);
        }
        fetchApplication();
    }, [id]);

    const handleDownloadPdf = () => {
        const input = printRef.current;
        if (input) {
            html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`application-${application?.id}.pdf`);
            });
        }
    };
    
    const handlePrint = () => {
        window.print();
    }

    if (loading || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-muted">
                <Card className="max-w-2xl mx-auto mt-10">
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!application) {
        return notFound();
    }

    // Security check
    if (user && application.userId !== user.id) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-destructive">You are not authorized to view this document.</p>
            </div>
        );
    }

    const formatDate = (date: Timestamp | string | Date | undefined) => {
        if (!date) return 'N/A';
        if (date instanceof Timestamp) return date.toDate().toLocaleString();
        if (date instanceof Date) return date.toLocaleString();
        if (typeof date === 'string') return new Date(date).toLocaleString();
        return 'Invalid Date';
    };

    return (
        <div className="bg-muted min-h-screen p-4 sm:p-8">
             <div className="max-w-2xl mx-auto mb-4 flex justify-end gap-2 print:hidden">
                    <Button variant="outline" onClick={() => router.back()}>Back</Button>
                    <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
                    <Button onClick={handleDownloadPdf}><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
            </div>
            <Card className="max-w-2xl mx-auto" id="print-content">
                <div ref={printRef} className="bg-card p-8">
                    <CardHeader className="text-center p-0 mb-8">
                         <div className="flex justify-center mb-4">
                             <Image src="https://placehold.co/150x50" alt="GovConnect SL Logo" width={150} height={50} data-ai-hint="logo" />
                        </div>
                        <CardTitle className="text-3xl">Appointment Confirmation</CardTitle>
                        <CardDescription>Please bring this document to your appointment.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 space-y-6">
                         <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <h3 className="font-semibold text-muted-foreground mb-2">APPLICANT</h3>
                                <p>{applicant?.name}</p>
                                <p>{applicant?.nic}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="font-semibold text-muted-foreground mb-2">APPLICATION DETAILS</h3>
                                <p><span className="font-semibold">Reference No:</span> {application.id}</p>
                                <p><span className="font-semibold">Service:</span> {application.service}</p>
                                <p><span className="font-semibold">Status:</span> {application.status}</p>
                            </div>
                        </div>

                        <Separator />
                        
                        <div className="grid grid-cols-2 items-center">
                            <div>
                                <h3 className="font-semibold text-muted-foreground mb-2">APPOINTMENT DETAILS</h3>
                                <p><span className="font-semibold">Date & Time:</span></p>
                                <p className="text-lg font-bold">{formatDate(application.details?.appointmentDate)}</p>
                            </div>
                             <div className="flex justify-end">
                               {application.details?.qrCodeUrl && (
                                 <Image src={application.details.qrCodeUrl} alt="Appointment QR Code" width={150} height={150} />
                               )}
                            </div>
                        </div>

                         <Separator />

                         <p className="text-xs text-muted-foreground text-center">
                            This is a computer-generated document. If you have any questions about this appointment, please contact support through the portal.
                        </p>
                    </CardContent>
                </div>
            </Card>
        </div>
    );
}

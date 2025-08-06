
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';

interface FineDetails {
    type: string;
    amount: string;
    dueDate: string;
    status: 'Pending' | 'Overdue';
}

export function FinePaymentService({ service }) {
  const [reference, setReference] = useState('');
  const [fineDetails, setFineDetails] = useState<FineDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSearchFine = () => {
    if (!reference) {
        toast({
            variant: 'destructive',
            title: "Reference Number Required",
            description: "Please enter a Fine Reference or NIC number.",
        });
        return;
    }
    setIsLoading(true);
    setError('');
    setFineDetails(null);
    // Simulate API call
    setTimeout(() => {
        if (reference.toLowerCase().includes('err')) {
             setError('No fine found for the provided reference number. Please check the number and try again.');
        } else {
            setFineDetails({
                type: "Traffic Violation - Speeding",
                amount: "5000.00",
                dueDate: "2024-09-01",
                status: "Pending"
            });
        }
        setIsLoading(false);
    }, 1500);
  }

  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Pay Your Fine</CardTitle>
                <CardDescription>Enter your Fine Reference Number or NIC Number to retrieve details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="referenceNumber">Fine Reference or NIC Number</Label>
                    <Input 
                        id="referenceNumber" 
                        placeholder="e.g., FN12345678 or 199012345V" 
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSearchFine} disabled={isLoading}>
                    {isLoading ? 'Searching...' : 'Search Fine'}
                </Button>
            </CardFooter>
        </Card>

        {error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Search Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {fineDetails && (
            <Card>
                <CardHeader>
                    <CardTitle>Fine Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Fine Type:</span>
                        <span className="font-medium">{fineDetails.type}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span className="font-medium">{fineDetails.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`font-medium ${fineDetails.status === 'Overdue' ? 'text-destructive' : ''}`}>{fineDetails.status}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold pt-2 border-t">
                        <span>Amount Due:</span>
                        <span>LKR {fineDetails.amount}</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button size="lg" asChild>
                        <Link href={`/payment?service=Fine+Payment&amount=${fineDetails.amount}&ref=${reference}`}>Pay Now</Link>
                    </Button>
                </CardFooter>
            </Card>
        )}
    </div>
  );
}


"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface BillDetails {
    amount: string;
    dueDate: string;
    billingPeriod: string;
}

export function ElectricityBillPaymentService({ service }) {
  const [accountNumber, setAccountNumber] = useState('');
  const [billDetails, setBillDetails] = useState<BillDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFetchBill = () => {
    if (!accountNumber) {
        toast({
            variant: 'destructive',
            title: "Account Number Required",
            description: "Please enter your electricity account number.",
        });
        return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        setBillDetails({
            amount: "3500.00",
            dueDate: "2024-08-15",
            billingPeriod: "July 2024"
        });
        setIsLoading(false);
    }, 1500);
  }

  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Pay Your Electricity Bill</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="accountNumber">Electricity Account Number</Label>
                    <Input 
                        id="accountNumber" 
                        placeholder="e.g., 1020304050" 
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleFetchBill} disabled={isLoading}>
                    {isLoading ? 'Fetching...' : 'Fetch Bill'}
                </Button>
            </CardFooter>
        </Card>

        {billDetails && (
            <Card>
                <CardHeader>
                    <CardTitle>Current Bill Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Billing Period:</span>
                        <span className="font-medium">{billDetails.billingPeriod}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span className="font-medium">{billDetails.dueDate}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold pt-2 border-t">
                        <span>Amount Due:</span>
                        <span>LKR {billDetails.amount}</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button size="lg" asChild>
                        <Link href={`/payment?service=Electricity+Bill&amount=${billDetails.amount}`}>Pay Now</Link>
                    </Button>
                </CardFooter>
            </Card>
        )}
    </div>
  );
}

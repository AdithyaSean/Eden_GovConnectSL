
"use client";

import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, QrCode, Smartphone, University } from "lucide-react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const service = searchParams.get("service") || "Unknown Service";
  const amount = searchParams.get("amount") || "0.00";
  const ref = searchParams.get("ref") || new Date().getTime().toString().slice(-8);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { user } = useAuth();

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessDialog(true);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Payment Successful!</AlertDialogTitle>
              <AlertDialogDescription>
                Your payment for {service} has been processed successfully. Your
                application status will be updated shortly.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="outline" asChild>
                <Link href="/payments">View Payment History</Link>
              </Button>
              <AlertDialogAction asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Secure Payment Gateway</CardTitle>
            <CardDescription>
              Complete your payment for the selected government service.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Payment Details</h3>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium text-right">{service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference No:</span>
                  <span className="font-medium">{ref}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total Amount:</span>
                  <span>LKR {amount}</span>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">User Information</h3>
                 {user && (
                    <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">NIC:</span>
                          <span className="font-medium">{user.nic}</span>
                        </div>
                    </>
                )}
              </div>
            </div>

            <Tabs defaultValue="card" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="card"><CreditCard className="mr-2" /> Card</TabsTrigger>
                <TabsTrigger value="mobile"><Smartphone className="mr-2" /> Mobile</TabsTrigger>
                <TabsTrigger value="bank"><University className="mr-2" /> Bank</TabsTrigger>
                <TabsTrigger value="qr"><QrCode className="mr-2" /> QR</TabsTrigger>
              </TabsList>
              
              <form onSubmit={handlePayment}>
                <TabsContent value="card">
                  <Card className="border-t-0 rounded-t-none">
                    <CardHeader>
                      <CardTitle>Credit/Debit Card</CardTitle>
                      <CardDescription>Enter your card details below. All transactions are secure and encrypted.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="0000 0000 0000 0000" required />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry</Label>
                          <Input id="expiry" placeholder="MM/YY" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" required />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full" size="lg">Pay LKR {amount}</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                 <TabsContent value="mobile">
                   <Card className="border-t-0 rounded-t-none">
                    <CardHeader>
                      <CardTitle>Mobile Payment</CardTitle>
                      <CardDescription>Pay with eZ Cash or mCash.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="flex gap-4">
                           <Button variant="outline" className="flex-1 h-16"><Image src="https://placehold.co/100x40" width={100} height={40} alt="eZ Cash" data-ai-hint="logo payment" /></Button>
                           <Button variant="outline" className="flex-1 h-16"><Image src="https://placehold.co/100x40" width={100} height={40} alt="mCash" data-ai-hint="logo payment" /></Button>
                       </div>
                        <div className="space-y-2">
                            <Label htmlFor="mobileNumber">Mobile Number</Label>
                            <Input id="mobileNumber" placeholder="07XXXXXXXX" required />
                        </div>
                    </CardContent>
                    <CardFooter>
                       <Button type="submit" className="w-full" size="lg">Pay LKR {amount}</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                 <TabsContent value="bank">
                   <Card className="border-t-0 rounded-t-none">
                    <CardHeader>
                      <CardTitle>Online Banking</CardTitle>
                      <CardDescription>Select your bank to proceed with the payment.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <Button variant="outline" className="h-20">Bank of Ceylon</Button>
                        <Button variant="outline" className="h-20">People's Bank</Button>
                        <Button variant="outline" className="h-20">Sampath Bank</Button>
                        <Button variant="outline" className="h-20">Commercial Bank</Button>
                        <Button variant="outline" className="h-20">HNB</Button>
                        <Button variant="outline" className="h-20">NDB Bank</Button>
                    </CardContent>
                    <CardFooter>
                       <Button type="submit" className="w-full" size="lg">Proceed to Bank</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                 <TabsContent value="qr">
                   <Card className="border-t-0 rounded-t-none">
                     <CardHeader>
                        <CardTitle>LankaQR Payment</CardTitle>
                        <CardDescription>Scan the QR code with your mobile banking app to complete the payment.</CardDescription>
                     </CardHeader>
                     <CardContent className="flex flex-col items-center justify-center space-y-4">
                         <Image src="https://placehold.co/250x250.png" width={250} height={250} alt="LankaQR" data-ai-hint="qr code" />
                         <p className="text-muted-foreground text-sm">Waiting for payment confirmation...</p>
                     </CardContent>
                   </Card>
                </TabsContent>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

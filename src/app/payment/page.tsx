
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { doc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { sendEmail } from "@/lib/actions/send-email";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const service = searchParams.get("service") || "Unknown Service";
  const amount = searchParams.get("amount") || "0.00";
  const ref = searchParams.get("ref") || null;
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newPaymentId, setNewPaymentId] = useState<string | null>(null);
  const [successAnimation, setSuccessAnimation] = useState<any>(null);
  const { user } = useAuth();
  
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  // Load Lottie animation from public folder
  useEffect(() => {
    fetch("/animations/success.json")
      .then((res) => res.json())
      .then((data) => setSuccessAnimation(data))
      .catch((err) => console.error("Failed to load animation:", err));
  }, []);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
    if (formattedValue.length <= 19) { // 16 digits + 3 spaces
      setCardNumber(formattedValue);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    if (value.length <= 5) {
      setExpiry(value);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvc(value);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref || !user) {
      toast({
        title: "Error",
        description: "Application reference or user not found.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
        // 1. Update application status (if it's an application payment)
        const appRef = doc(db, "applications", ref);
        await updateDoc(appRef, { status: "In Progress" });

        // 2. Create a payment record
        const paymentDocRef = await addDoc(collection(db, "payments"), {
            userId: user.id,
            service: service,
            amount: amount,
            date: serverTimestamp(),
            status: "Success",
            applicationRef: ref
        });
        setNewPaymentId(paymentDocRef.id);

        // 3. Create a notification
         const notifDescription = `Your payment of LKR ${amount} for '${service}' was successful.`;
         await addDoc(collection(db, "notifications"), {
            userId: user.id,
            title: "Payment Successful",
            description: notifDescription,
            href: `/receipt/${paymentDocRef.id}`,
            icon: "CheckCircle",
            read: false,
            createdAt: serverTimestamp()
        });
        
        // 4. Send email notification
        if(user.email){
             await sendEmail({
                to: user.email,
                subject: "[GovConnect SL] Payment Successful",
                html: `<p>${notifDescription}</p><p>You can view your receipt by logging into your account.</p>`
            });
        }

        setShowSuccessDialog(true);
    } catch(error) {
        console.error("Payment processing error:", error);
        toast({ title: "Payment Failed", description: "Something went wrong. Please try again.", variant: "destructive"});
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent>
            <div className="flex flex-col items-center justify-center text-center">
              {successAnimation && (
                <Lottie
                  animationData={successAnimation}
                  loop={true}
                  style={{ height: 150, width: 150 }}
                />
              )}
              <AlertDialogHeader>
                <AlertDialogTitle>Payment Successful!</AlertDialogTitle>
                <AlertDialogDescription>
                  Your payment for {service} has been processed successfully. Your
                  application status has been updated.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="sm:justify-center flex-col sm:flex-row w-full gap-2 mt-4">
                {newPaymentId && (
                  <Button variant="outline" asChild className="w-full sm:w-auto">
                    <Link href={`/receipt/${newPaymentId}`}>View Receipt</Link>
                  </Button>
                )}
                <Button variant="secondary" asChild className="w-full sm:w-auto">
                  <Link href="/my-applications">My Applications</Link>
                </Button>
                <AlertDialogAction asChild className="w-full sm:w-auto">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </AlertDialogAction>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Secure Payment Gateway</CardTitle>
            <CardDescription>
              Complete your payment for the selected government service.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handlePayment}>
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

              <Card>
                <CardHeader>
                  <CardTitle>Credit/Debit Card</CardTitle>
                  <CardDescription>
                    Enter your card details below. All transactions are secure and encrypted.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="0000 0000 0000 0000" required value={cardNumber} onChange={handleCardNumberChange} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input id="expiry" placeholder="MM/YY" required value={expiry} onChange={handleExpiryChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" required value={cvc} onChange={handleCvcChange} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                    {isProcessing ? "Processing..." : `Pay LKR ${amount}`}
                  </Button>
                </CardFooter>
              </Card>
            </CardContent>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}

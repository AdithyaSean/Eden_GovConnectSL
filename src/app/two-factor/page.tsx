
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import Link from "next/link";

export default function TwoFactorPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleResend = async () => {
        setLoading(true);
        if (!auth.currentUser) {
            // This might happen if the page is refreshed and auth state is lost.
            // A simple solution is to guide them back to login.
             toast({ title: "Session expired", description: "Please log in again to receive a new verification link.", variant: "destructive" });
             router.push("/login");
             setLoading(false);
             return;
        }

        try {
            await sendEmailVerification(auth.currentUser);
            toast({ title: "Verification Email Sent!", description: "A new link has been sent to your email address." });
        } catch (error) {
            console.error("Error resending verification email:", error);
            toast({ title: "Error", description: "Could not send a new verification link. Please try again.", variant: "destructive"});
        } finally {
            setLoading(false);
        }
    }
    
    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
               <MailCheck className="h-12 w-12 text-primary" />
            </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to the email address associated with your account. Please click the link in the email to complete your login.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button onClick={handleResend} className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Resend Verification Link"}
            </Button>
             <div className="text-center text-sm">
                <p>After verifying, <Link href="/login" className="underline">click here to log in</Link>.</p>
             </div>
             <div className="mt-4 border-t pt-4 text-center">
                <Button variant="ghost" onClick={handleLogout}>Back to Login</Button>
             </div>
        </CardContent>
      </Card>
    </div>
  );
}

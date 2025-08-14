
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserSquare, MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { sendEmailVerification } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useState } from "react";
import { auth } from '@/lib/firebase';

export default function TwoFactorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const handleResend = async () => {
    if (!auth.currentUser) {
        toast({title: "Not logged in", description: "No user session found.", variant: "destructive"});
        router.push('/login');
        return;
    }
    setLoading(true);
    try {
        await sendEmailVerification(auth.currentUser);
        toast({ title: "Verification Email Sent!", description: "A new verification link has been sent to your email."});
    } catch (error) {
        toast({ title: "Error", description: "Failed to resend verification email.", variant: "destructive"});
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <MailCheck className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to your email address. Please click the link in the email to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <Button className="w-full" asChild>
                <Link href="/login">Return to Login</Link>
            </Button>
            <div className="mt-4 text-sm">
                Didn't receive an email?{" "}
                <button onClick={handleResend} disabled={loading} className="underline disabled:text-muted-foreground">
                  {loading ? "Sending..." : "Resend link"}
                </button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

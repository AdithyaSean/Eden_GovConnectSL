
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserSquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ForgotPasswordPage() {
  const [nic, setNic] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nic) {
      toast({ title: "National ID is required.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      // 1. Check if a citizen with this NIC exists
      const citizenRef = doc(db, "citizens", nic);
      const citizenSnap = await getDoc(citizenRef);

      if (!citizenSnap.exists()) {
        toast({
          title: "Account Not Found",
          description: "No account found for this NIC number.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      const citizenData = citizenSnap.data();
      const email = citizenData?.email;

      if (!email) {
          toast({
          title: "Email Not Found",
          description: "No email is associated with this account. Cannot send reset link.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // 2. If NIC exists, send the reset email
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password Reset Email Sent",
        description: "A reset link has been sent to your registered email address. Please check your inbox.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "An Error Occurred",
        description: "Something went wrong. Please try again later.",
         variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <UserSquare className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>Enter your National ID number to receive a reset link at your registered email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="national-id">National ID Number</Label>
                <Input id="national-id" type="text" placeholder="e.g. 199012345V" required value={nic} onChange={(e) => setNic(e.target.value)} disabled={loading} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Remembered your password?{" "}
            <Link href="/login" className="underline">Login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

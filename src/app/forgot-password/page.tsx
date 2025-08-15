
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserSquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      toast({ title: "Please enter your NIC or Email.", variant: "destructive"});
      return;
    }
    setLoading(true);

    try {
      let email: string | null = null;
      
      // Check if identifier is an email or NIC
      if (identifier.includes('@')) {
        email = identifier;
      } else {
        // Assume it's an NIC and look up the email in the 'citizens' collection
        const citizenRef = doc(db, "citizens", identifier);
        const citizenSnap = await getDoc(citizenRef);
        if (citizenSnap.exists()) {
          email = citizenSnap.data().email;
        }
      }

      if (email) {
        await sendPasswordResetEmail(auth, email);
        toast({ title: "Password Reset Email Sent", description: "If an account exists, a reset link has been sent to the associated email." });
      } else {
        toast({ title: "Account Not Found", description: "No account found with that NIC or email.", variant: "destructive"});
      }

    } catch (error) {
      console.error("Forgot password error: ", error);
      toast({ title: "An Error Occurred", variant: "destructive"});
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
            <div className="flex justify-center -mb-5">
              <div className="relative w-96 h-48">
                <Image
                  src="/images/GovSL Logo.svg"
                  alt="GovConnect SL Logo"
                  fill
                  className="object-contain"
                  data-ai-hint="logo"
                />
              </div>
            </div>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your NIC or account email to receive a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email-or-nic">NIC or Email</Label>
                <Input
                  id="email-or-nic"
                  type="text"
                  placeholder="Your NIC or email address"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Remembered your password?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

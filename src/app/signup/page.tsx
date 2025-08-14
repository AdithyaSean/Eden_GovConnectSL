
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
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [nic, setNic] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !nic || !email || !password) {
      toast({ title: "All fields are required.", variant: "destructive" });
      return;
    }
    
    const nicRegex = /^(\d{9}[VvXx]|\d{12})$/;
    if (!nicRegex.test(nic)) {
        toast({
            title: "Invalid NIC Format",
            description: "Please enter a valid 10-digit (e.g., 123456789V) or 12-digit NIC.",
            variant: "destructive"
        });
        return;
    }

    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters long.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      // 1. Check if NIC is already registered in the 'citizens' collection
      const citizenDocRef = doc(db, "citizens", nic);
      const citizenDoc = await getDoc(citizenDocRef);

      if (citizenDoc.exists()) {
        toast({
          title: "Signup Failed",
          description: "This National ID Number is already registered.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // 2. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3. Create citizen profile in Firestore with NIC as document ID
      await setDoc(citizenDocRef, {
        uid: user.uid,
        fullName: fullName,
        nic: nic,
        email: email,
      });

      // 4. Send verification email
      await sendEmailVerification(user);

      toast({
        title: "Account Created Successfully!",
        description: "A verification link has been sent to your email. Please verify before logging in.",
      });

      // Redirect to a page that tells them to check their email
      router.push(`/two-factor?nic=${nic}`);

    } catch (error: any) {
      console.error("Signup error:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast({ 
            title: "Signup Failed", 
            description: "This email is already registered. Please log in or use a different email.", 
            variant: "destructive" 
        });
      } else {
        toast({ title: "An Error Occurred", description: "Could not create your account. Please try again.", variant: "destructive" });
      }
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
          <CardTitle className="text-2xl">Create Citizen Account</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" placeholder="Name as in NIC" required value={fullName} onChange={e => setFullName(e.target.value)} disabled={loading} />
              </div>
               <div className="grid gap-2">
                  <Label htmlFor="national-id">National ID Number</Label>
                  <Input id="national-id" placeholder="e.g., 19981234567V" required value={nic} onChange={e => setNic(e.target.value)} disabled={loading} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={loading}/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create an account'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

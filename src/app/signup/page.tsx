
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserSquare, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [nic, setNic] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password should be at least 6 characters long.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create citizen profile in Firestore with NIC as document ID
      const citizenRef = doc(db, "citizens", nic);
      await setDoc(citizenRef, {
        uid: user.uid,
        fullName,
        nic,
        email,
      });

      // Send verification email
      await sendEmailVerification(user);

      toast({
        title: "Account Created!",
        description: "A verification link has been sent to your email. Please verify to continue.",
      });

      router.push("/two-factor");

    } catch (error: any) {
      console.error("Signup failed: ", error);
      if (error.code === 'auth/email-already-in-use') {
        toast({ title: "Email already in use.", description: "Please use a different email or log in.", variant: "destructive" });
      } else {
        toast({ title: "An Error Occurred", description: "Something went wrong during signup.", variant: "destructive" });
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
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" placeholder="Name as in NIC" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="national-id">National ID Number</Label>
                <Input id="national-id" placeholder="e.g. 19981234567V" required value={nic} onChange={(e) => setNic(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2 relative">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute bottom-2 right-3 text-muted-foreground">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create an account"}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">Login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

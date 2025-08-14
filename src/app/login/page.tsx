
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserSquare, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nic || !password) {
      toast({ title: "All Fields Required", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      // 1. Get citizen doc from Firestore using NIC as doc ID
      const citizenRef = doc(db, "citizens", nic);
      const citizenSnap = await getDoc(citizenRef);

      if (!citizenSnap.exists()) {
        toast({ title: "Login Failed", description: "No account found for this NIC.", variant: "destructive" });
        setLoading(false);
        return;
      }

      // 2. Retrieve email from the citizen document
      const citizenData = citizenSnap.data();
      const email = citizenData?.email;

      if (!email) {
        toast({ title: "Login Failed", description: "No email linked to this account.", variant: "destructive" });
        setLoading(false);
        return;
      }

      // 3. Sign in with Firebase Auth using the retrieved email
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // 4. Check for email verification
      if (!userCredential.user.emailVerified) {
        toast({ title: "Email Not Verified", description: "Please check your inbox and verify your email address to log in.", variant: "destructive"});
        setLoading(false);
        // Optional: Resend verification
        // await sendEmailVerification(userCredential.user);
        return;
      }

      router.push("/dashboard");

    } catch (error: any) {
      console.error("Login failed: ", error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        toast({ title: "Login Failed", description: "Invalid credentials. Please check your NIC and password.", variant: "destructive" });
      } else {
        toast({ title: "An Error Occurred", description: "Something went wrong during login.", variant: "destructive" });
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
          <CardTitle className="text-2xl">Citizen Login</CardTitle>
          <CardDescription>Enter your National ID number to login</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="national-id">National ID Number</Label>
                <Input id="national-id" type="text" placeholder="e.g. 199012345V" required value={nic} onChange={(e) => setNic(e.target.value)} disabled={loading} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">Forgot your password?</Link>
                </div>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className="pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">Sign up</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

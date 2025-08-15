
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
import { UserSquare, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import type { User as AppUser } from "@/lib/types";
import Image from "next/image";


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
      // 1. Look up the citizen profile to get their UID
      const q = query(collection(db, "users"), where("nic", "==", nic));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({ title: "Login Failed", description: "No account found with this NIC.", variant: "destructive" });
        setLoading(false);
        return;
      }
      
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data() as AppUser;

      // 2. Check user status before attempting login
      if (userData.status === 'Suspended' || userData.status === 'Deleted') {
          toast({ title: "Account Inactive", description: `Your account is currently ${userData.status}. Please contact support.`, variant: "destructive" });
          setLoading(false);
          return;
      }
      
      const email = userData.email;
      if (!email) {
          toast({ title: "Login Failed", description: "No email associated with this NIC.", variant: "destructive" });
          setLoading(false);
          return;
      }

      // 3. Sign in with the retrieved email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // 4. Check if email is verified
      if (!userCredential.user.emailVerified) {
        // Redirect to 2FA page to prompt for verification
        router.push(`/two-factor?nic=${nic}`);
      } else {
        // Redirect to dashboard if verified
        localStorage.setItem("loggedInNic", nic); // Store NIC for dashboard access
        router.push(`/dashboard`);
      }

    } catch (error: any) {
        console.error("Login failed: ", error);
        if (error.code === 'auth/wrong-password') {
            toast({
                title: "Login Failed",
                description: "The password you entered is incorrect. Please try again.",
                variant: "destructive"
            });
        } else if (error.code === 'auth/invalid-credential') {
            toast({
                title: "Login Failed",
                description: "Invalid credentials. Please check your NIC and password.",
                variant: "destructive"
            });
        } else {
             toast({
                title: "An Error Occurred",
                description: "Something went wrong during login. Please try again later.",
                variant: "destructive"
            });
        }
    } finally {
        setLoading(false);
    }
  }
  
  const handleForgotPassword = async () => {
    if (!nic) {
      toast({ title: "Please enter your NIC", description: "We need your NIC to find your account and send a reset link.", variant: "destructive" });
      return;
    }
    
    try {
      const q = query(collection(db, "users"), where("nic", "==", nic));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({ title: "Account not found", description: "No account is associated with this NIC.", variant: "destructive" });
        return;
      }
      
      const email = querySnapshot.docs[0].data().email;
      if(!email) {
          toast({ title: "Error", description: "No email is associated with this account.", variant: "destructive" });
          return;
      }
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Password Reset Email Sent", description: `A reset link has been sent to the email associated with your NIC.` });
    } catch (error) {
      console.error("Forgot password error: ", error);
      toast({ title: "Error", description: "Could not send password reset email. Please try again.", variant: "destructive" });
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative w-48 h-24">
                <Image
                  src="/images/GovSL Logo.svg"
                  alt="GovConnect SL Logo"
                  fill
                  className="object-contain"
                  data-ai-hint="logo"
                />
              </div>
            </div>
          <CardTitle className="text-2xl">Citizen Login</CardTitle>
          <CardDescription>
            Enter your National ID number to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="national-id">National ID Number</Label>
                <Input
                  id="national-id"
                  type="text"
                  placeholder="e.g. 199012345V"
                  required
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </button>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="pr-10"
                  />
                   <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                  >
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
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
          <div className="mt-6 pt-4 border-t text-center text-sm">
            <Link href="/admin/login" className="text-muted-foreground hover:text-primary underline">
              Admin & Worker Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

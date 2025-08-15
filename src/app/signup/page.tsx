
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
import { UserSquare, Eye, EyeOff, Check, X } from "lucide-react";
import { FormEvent, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [nic, setNic] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const passwordRequirements = useMemo(() => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    return [
      { text: "At least one lowercase letter", met: hasLowercase },
      { text: "At least one uppercase letter", met: hasUppercase },
      { text: "At least one number", met: hasNumber },
      { text: "At least one special character", met: hasSpecialChar },
      { text: "Minimum 8 characters", met: hasMinLength },
    ];
  }, [password]);

  const passwordStrength = useMemo(() => {
    return passwordRequirements.filter(req => req.met).length * 20;
  }, [passwordRequirements]);


  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !nic || !email || !password) {
      toast({ title: "All fields are required.", variant: "destructive" });
      return;
    }
    
    if (passwordStrength < 100) {
      toast({ title: "Password does not meet requirements", description: "Please ensure your password meets all the criteria listed.", variant: "destructive" });
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
    
    setLoading(true);

    try {
      // 1. Check if NIC is already registered in the 'citizens' or 'users' collection
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

      // 3. Create citizen profile in Firestore 'citizens' collection
      await setDoc(citizenDocRef, {
        uid: user.uid,
        fullName: fullName,
        nic: nic,
        email: email,
      });

      // 4. Create user profile in Firestore 'users' collection for consistency
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
          uid: user.uid,
          id: user.uid,
          name: fullName,
          nic: nic,
          email: email,
          role: "Citizen",
          status: "Active",
          joined: serverTimestamp(),
          photoURL: ""
      });

      // 5. Send verification email
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
    <div className="flex items-center justify-center min-h-screen bg-background py-12">
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
                <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} disabled={loading} className="pr-10"/>
                     <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground">
                        {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                </div>
              </div>
              
              {password.length > 0 && (
                <div className="space-y-3">
                    <Progress value={passwordStrength} className="h-2" />
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {req.met ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                            <span className={cn(req.met ? "text-muted-foreground" : "text-destructive-foreground/80")}>
                                {req.text}
                            </span>
                          </div>
                        ))}
                    </div>
                </div>
              )}

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

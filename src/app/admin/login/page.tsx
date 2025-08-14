
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
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs, limit, addDoc, serverTimestamp } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { User } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showContactAdminDialog, setShowContactAdminDialog] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Clear any previous session info
    localStorage.removeItem("workerId");
    localStorage.removeItem("workerRole");

    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            toast({ title: "Login Failed", description: "No user profile found for this email.", variant: "destructive" });
            setLoading(false);
            return;
        }
        
        const userDoc = querySnapshot.docs[0];
        const userData = { id: userDoc.id, ...userDoc.data() } as User;
        
        // Check user status before attempting login
        if (userData.status === 'Suspended' || userData.status === 'Deleted') {
            toast({ title: "Account Inactive", description: `Your account is currently ${userData.status}. Please contact an administrator.`, variant: "destructive" });
            setLoading(false);
            return;
        }

        await signInWithEmailAndPassword(auth, email, password);

        if (userData.role === "Super Admin") {
            router.push("/admin/dashboard");
        } else if (userData.role.startsWith("worker_")) {
            localStorage.setItem("workerId", userData.id);
            localStorage.setItem("workerRole", userData.role);
            let dashboardPath = userData.role.replace('worker_', '');
            if(dashboardPath === 'finepayment') dashboardPath = 'fine-payment';
            if(dashboardPath === 'registeredvehicles') dashboardPath = 'registered-vehicles';
            
            router.push(`/worker/${dashboardPath}/dashboard`);
        } else {
            toast({ title: "Access Denied", description: "This login is for authorized workers and admins only.", variant: "destructive" });
            // Consider signing out the user if they are not an admin/worker
        }

    } catch (error: any) {
        console.error("Login error: ", error);
        if (error.code === 'auth/invalid-credential') {
          toast({ title: "Login Failed", description: "Invalid email or password. Please try again.", variant: "destructive" });
        } else {
          toast({ title: "An Error Occurred", description: "Something went wrong. Please try again.", variant: "destructive" });
        }
    } finally {
        setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({ title: "Email Required", description: "Please enter your email address to log a reset request.", variant: "destructive"});
      return;
    }

    try {
      // Find the worker to log their details in the request
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
          toast({ title: "User Not Found", description: "This email is not registered as a worker or admin.", variant: "destructive" });
          return;
      }

      const userData = querySnapshot.docs[0].data();

      // Log the reset request
      await addDoc(collection(db, "passwordResets"), {
          workerName: userData.name,
          workerEmail: userData.email,
          requestedAt: serverTimestamp(),
          status: 'Pending'
      });

      setShowContactAdminDialog(true);
      
    } catch (error) {
      console.error("Error logging password reset request: ", error);
      toast({ title: "Request Failed", description: "Could not log your request. Please try again.", variant: "destructive"});
    }

  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="mx-auto max-w-sm w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin & Worker Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@gov.lk or worker.transport@gov.lk"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm">
              <Link href="/login" className="underline">
                Return to Citizen Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showContactAdminDialog} onOpenChange={setShowContactAdminDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Password Reset Request Sent</AlertDialogTitle>
              <AlertDialogDescription>
                Your request has been sent to the system administrator. Please contact them directly at <span className="font-semibold">admin@gov.lk</span> to complete the password reset process.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowContactAdminDialog(false)}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </>
  );
}

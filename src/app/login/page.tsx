
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [nic, setNic] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nic) {
        toast({
            title: "NIC Required",
            description: "Please enter your National ID number.",
            variant: "destructive"
        });
        return;
    }
    // In a real app, you'd validate credentials against a backend.
    // For this prototype, we store the NIC in localStorage to simulate a session.
    localStorage.setItem("loggedInNic", nic);
    router.push("/two-factor");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
               <UserSquare className="h-12 w-12 text-primary" />
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
                  placeholder="e.g. 19981234567V"
                  required
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                  Login
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

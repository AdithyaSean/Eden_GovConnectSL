
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

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdmin) {
      router.push("/admin/dashboard");
      return;
    }

    // Logic to redirect worker based on email
    if (email.includes("worker")) {
        const role = email.split("@")[0].split(".")[1];
        if (role) {
            router.push(`/worker/${role}/dashboard`);
        } else {
            // Default worker redirect if role can't be determined
            router.push("/worker/transport/dashboard");
        }
    } else {
        // If not an admin and not a recognized worker email, do nothing or show an error.
        // For this prototype, we'll just prevent redirection.
        console.log("Not a valid worker email format.");
    }
  };

  return (
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
                  required={!isAdmin}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isAdmin}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required={!isAdmin} disabled={isAdmin} />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="is-admin" checked={isAdmin} onCheckedChange={(checked) => setIsAdmin(checked as boolean)} />
                <Label htmlFor="is-admin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Login as Admin
                </Label>
              </div>
              <Button type="submit" className="w-full">
                Login
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
  );
}

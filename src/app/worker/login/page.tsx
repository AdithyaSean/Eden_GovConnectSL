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
import { PenSquare } from "lucide-react";

export default function WorkerLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
               <PenSquare className="h-12 w-12 text-primary" />
            </div>
          <CardTitle className="text-2xl">Worker Portal</CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="worker@gov.lk"
                required
              />
            </div>
            <div className="grid gap-2">
               <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" asChild>
                <Link href="/worker/transport/dashboard">Login</Link>
            </Button>
          </div>
           <div className="mt-4 text-center text-sm">
            <Link href="/login" className="underline">
              Return to main website
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

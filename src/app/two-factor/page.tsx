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

export default function TwoFactorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
               <UserSquare className="h-12 w-12 text-primary" />
            </div>
          <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
          <CardDescription>
            Enter the code from your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="2fa-code">Authentication Code</Label>
              <Input
                id="2fa-code"
                type="text"
                placeholder="123456"
                required
              />
            </div>
            <Button type="submit" className="w-full" asChild>
                <Link href="/dashboard">Verify</Link>
            </Button>
          </div>
           <div className="mt-4 text-center text-sm">
            <Link href="/login" className="underline">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

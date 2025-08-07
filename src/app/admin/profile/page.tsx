
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { FormEvent } from "react";

export default function AdminProfilePage() {
    const { toast } = useToast();

    const handleUpdatePassword = (e: FormEvent) => {
        e.preventDefault();
        toast({
            title: "Password Updated",
            description: "Your password has been changed successfully. You will be logged out for security.",
        });
    }

  return (
    <AdminLayout>
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                 <Card>
                    <CardHeader className="text-center">
                        <Avatar className="w-24 h-24 mx-auto mb-4">
                            <AvatarImage src="https://placehold.co/100x100" alt="Admin" data-ai-hint="avatar user" />
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <CardTitle>Admin User</CardTitle>
                        <CardDescription>admin@gov.lk</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-center">
                        <p className="font-semibold">Role: <span className="font-normal">Super Admin</span></p>
                        <p className="font-semibold">Joined: <span className="font-normal">2024-01-01</span></p>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                 <form onSubmit={handleUpdatePassword}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Update Password</CardTitle>
                            <CardDescription>
                            Change your password here. After saving, you'll be logged out for security purposes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input id="confirm-password" type="password" required />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">Update Password</Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}


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
import { FormEvent, use, useEffect, useState } from "react";
import { notFound } from "next/navigation";

// A simple map to make role names more user-friendly
const roleDisplayNames = {
    transport: "Transport",
    immigration: "Immigration",
    identity: "Identity",
    missingdocuments: "Missing Documents",
    health: "Health",
    tax: "Tax",
    pension: "Pension",
    landregistry: "Land Registry",
    exams: "Exams",
    finepayment: "Fine Payment",
    registeredvehicles: "Registered Vehicles",
    support: "Support"
};

export default function WorkerProfilePage({ params }: { params: { role: string } }) {
    const { toast } = useToast();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        // On the client-side, we can confirm the role from localStorage as a fallback/check
        // This makes the component more robust if the param somehow doesn't match the session
        const storedRole = localStorage.getItem('workerRole');
        if (params.role && roleDisplayNames[params.role]) {
            setRole(params.role);
        } else if (storedRole && roleDisplayNames[storedRole]) {
            setRole(storedRole);
        } else {
            // If no valid role can be determined, this page is not accessible
            notFound();
        }
    }, [params.role]);

    const handleUpdatePassword = (e: FormEvent) => {
        e.preventDefault();
        toast({
            title: "Password Updated",
            description: "Your password has been changed successfully. You will be logged out.",
        });
    }
    
    if (!role) {
        return null; // Or a loading spinner
    }

    const displayName = roleDisplayNames[role] || "Unknown";

  return (
    <AdminLayout workerMode>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                 <Card>
                    <CardHeader className="text-center">
                        <Avatar className="w-24 h-24 mx-auto mb-4">
                            <AvatarImage src="https://placehold.co/100x100" alt="Worker" data-ai-hint="avatar user" />
                            <AvatarFallback>W</AvatarFallback>
                        </Avatar>
                        <CardTitle>{displayName} Worker</CardTitle>
                        <CardDescription>{`worker.${role}@gov.lk`}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-center">
                        <p className="font-semibold">Role: <span className="font-normal">{`worker_${role}`}</span></p>
                        <p className="font-semibold">Joined: <span className="font-normal">2024-02-15</span></p>
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

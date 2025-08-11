
"use client";

import { use, useEffect, useState, FormEvent } from "react";
import { notFound } from "next/navigation";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkerProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { toast } = useToast();
    const [worker, setWorker] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorker = async () => {
            if (id) {
                try {
                    const userDoc = await getDoc(doc(db, "users", id));
                    if (userDoc.exists()) {
                        const userData = { id: userDoc.id, ...userDoc.data() } as User;
                        if (userData.role.startsWith('worker_')) {
                            setWorker(userData);
                        } else {
                           notFound(); // Not a worker
                        }
                    } else {
                        notFound();
                    }
                } catch (error) {
                    console.error("Error fetching worker data:", error);
                    notFound();
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchWorker();
    }, [id]);

    const handleUpdatePassword = (e: FormEvent) => {
        e.preventDefault();
        toast({
            title: "Password Updated",
            description: "Your password has been changed successfully. You will be logged out.",
        });
        // In a real app, you would log the user out here.
    }

    if (loading) {
        return (
            <AdminLayout workerMode>
                <div className="flex-1 space-y-8 p-8 pt-6">
                    <Skeleton className="h-10 w-1/2" />
                     <div className="grid gap-8 md:grid-cols-3">
                        <div className="md:col-span-1">
                            <Skeleton className="h-64 w-full" />
                        </div>
                        <div className="md:col-span-2">
                             <Skeleton className="h-48 w-full" />
                        </div>
                     </div>
                </div>
            </AdminLayout>
        )
    }

    if (!worker) {
        return notFound();
    }

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
                            <AvatarImage src="https://placehold.co/100x100" alt={worker.name} data-ai-hint="avatar user" />
                            <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{worker.name}</CardTitle>
                        <CardDescription>{worker.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-center">
                        <p className="font-semibold">Role: <span className="font-normal">{worker.role}</span></p>
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

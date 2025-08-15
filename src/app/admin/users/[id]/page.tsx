
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, UserCog, UserX, ArrowLeft, UserCheck, KeyRound } from "lucide-react";
import { useEffect, useState, use } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import type { User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const roles = [
    "Citizen", "Super Admin", "worker_transport", "worker_immigration", "worker_identity", "worker_health", "worker_tax", "worker_pension", "worker_landregistry", "worker_exams", "worker_finepayment", "worker_registeredvehicles", "worker_missingdocuments", "worker_support"
];


export default function UserProfilePage({ params }: { params: { id: string } }) {
  const { id } = use(params);
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const fetchUser = async () => {
    if (id) {
        setLoading(true);
        try {
          const userDoc = await getDoc(doc(db, "users", id));
          if (userDoc.exists()) {
            setUser({ id: userDoc.id, ...userDoc.data() } as User);
          }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    } else {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleSaveChanges = async () => {
    if(user) {
      // Create a copy of the user object to avoid directly mutating state
      const userToUpdate = { ...user };
      // Remove id from the object to be saved, as it's the doc key.
      delete userToUpdate.id;

      await updateDoc(doc(db, "users", user.id), userToUpdate);
      toast({
          title: "Success",
          description: "User profile has been updated successfully.",
      });
    }
  }
  
  const handleAction = async (action: 'Active' | 'Suspended' | 'Deleted') => {
    if(!user) return;
    
    try {
        await updateDoc(doc(db, "users", user.id), { status: action });
        toast({
            title: `User ${action}`,
            description: `User account has been ${action.toLowerCase()}.`,
            variant: action === 'Deleted' ? 'destructive' : 'default',
        });
        // Refetch user data to update UI
        fetchUser(); 
    } catch (error) {
        console.error(`Error performing action ${action}:`, error);
        toast({ title: "Action Failed", description: "Could not update user status.", variant: "destructive" });
    }
  }
  
  const formatDate = (date: Timestamp | string) => {
    if (!date) return 'N/A';
    if (typeof date === 'string') return date;
    return date.toDate().toLocaleDateString();
  };
  
  if(loading) {
      return (
        <AdminLayout>
            <div className="flex-1 space-y-8 p-8 pt-6">
                <Skeleton className="h-10 w-1/2" />
                 <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-1">
                        <Skeleton className="h-64 w-full" />
                    </div>
                    <div className="md:col-span-2 space-y-8">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                 </div>
            </div>
        </AdminLayout>
      )
  }

  if (!user) {
    return (
        <AdminLayout>
            <div className="flex-1 flex items-center justify-center">
                <p>User not found.</p>
            </div>
        </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <div className="flex items-center gap-4">
               <Button asChild variant="outline" size="icon">
                    <Link href="/admin/users"><ArrowLeft /></Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
                  <p className="text-muted-foreground">Manage user details and permissions for {user.name}</p>
                </div>
            </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
             <Card>
                <CardHeader className="items-center text-center">
                    <Avatar className="w-24 h-24 mb-4">
                        <AvatarImage src={user.photoURL} alt={user.name} data-ai-hint="avatar user" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{user.role === 'Citizen' ? user.nic : user.email}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium">{user.status}</span>
                    </div>
                     <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Role</span>
                        <span className="font-medium">{user.role}</span>
                    </div>
                     <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Joined</span>
                        <span className="font-medium">{formatDate(user.joined)}</span>
                    </div>
                </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                    <CardDescription>Update the user's role and personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue={user.name} className="col-span-2" onChange={(e) => setUser({...user, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="identifier">{user.role === 'Citizen' ? 'NIC Number' : 'Email'}</Label>
                        <Input id="identifier" type="text" defaultValue={user.role === 'Citizen' ? user.nic : user.email} className="col-span-2" onChange={(e) => setUser({...user, [user.role === 'Citizen' ? 'nic' : 'email']: e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="role">Role</Label>
                        <Select defaultValue={user.role} onValueChange={(value) => setUser({...user, role: value})}>
                            <SelectTrigger className="col-span-2">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                 </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                    <CardDescription>Perform administrative actions on this user account.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="outline"><KeyRound className="mr-2"/>Change Password</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Manual Password Change</AlertDialogTitle>
                          <AlertDialogDescription>
                            To change this user's password, please go to the Firebase Authentication console, find the user by their email or UID, and use the "Reset Password" function. This will send them an email to set a new password.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction>OK</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button variant="outline" onClick={() => handleAction('Active')} disabled={user.status === 'Active'}><UserCheck className="mr-2"/>Activate Account</Button>
                    <Button variant="outline" onClick={() => handleAction('Suspended')} disabled={user.status === 'Suspended'}><ShieldAlert className="mr-2"/>Suspend Account</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={user.status === 'Deleted'}><UserX className="mr-2"/>Delete User Account</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently mark the user as deleted and prevent them from logging in.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleAction('Deleted')} className="bg-destructive hover:bg-destructive/90">Yes, delete user</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

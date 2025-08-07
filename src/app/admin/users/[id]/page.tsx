
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, UserCog, UserX } from "lucide-react";

// Mock data - in a real app, you'd fetch this based on params.id
const user = {
  id: 1,
  name: "John Doe",
  email: "john.d@example.com",
  nic: "199012345V",
  role: "Citizen",
  joined: "2024-05-10",
  status: "Active"
};

const roles = [
    "Citizen", "Super Admin", "worker_transport", "worker_immigration", "worker_identity", "worker_health", "worker_tax", "worker_pension", "worker_landregistry", "worker_exams"
];


export default function UserProfilePage({ params }: { params: { id: string } }) {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
        title: "Success",
        description: "User profile has been updated successfully.",
    });
  }
  
  const handleAction = (action: string) => {
    toast({
        title: "Action Performed",
        description: `User has been ${action}.`,
        variant: action === 'deleted' ? 'destructive' : 'default',
    });
  }

  return (
    <AdminLayout>
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
              <p className="text-muted-foreground">Manage user details and permissions for {user.name}</p>
            </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
             <Card>
                <CardHeader className="items-center text-center">
                    <Avatar className="w-24 h-24 mb-4">
                        <AvatarImage src={`https://placehold.co/100x100`} alt={user.name} data-ai-hint="avatar user" />
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
                        <span className="font-medium">{user.joined}</span>
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
                        <Input id="name" defaultValue={user.name} className="col-span-2" />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="identifier">{user.role === 'Citizen' ? 'NIC Number' : 'Email'}</Label>
                        <Input id="identifier" type="text" defaultValue={user.role === 'Citizen' ? user.nic : user.email} className="col-span-2" />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="role">Role</Label>
                        <Select defaultValue={user.role}>
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
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Reset the user's password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" className="col-span-2" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Update Password</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                    <CardDescription>Perform administrative actions on this user account.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <Button variant="outline" onClick={() => handleAction('activated')}><UserCog className="mr-2"/>Activate Account</Button>
                    <Button variant="outline" onClick={() => handleAction('suspended')}><ShieldAlert className="mr-2"/>Suspend Account</Button>
                    <Button variant="destructive" onClick={() => handleAction('deleted')}><UserX className="mr-2"/>Delete User Account</Button>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}


"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialUsers = [
  { id: 1, name: "John Doe", email: "john.d@example.com", nic: "199012345V", role: "Citizen", joined: "2024-05-10", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane.s@example.com", nic: "198567890V", role: "Citizen", joined: "2024-05-12", status: "Active" },
  { id: 3, name: "Admin User", email: "admin@gov.lk", nic: "", role: "Super Admin", joined: "2024-01-01", status: "Active" },
  { id: 4, name: "Transport Worker", email: "worker.transport@gov.lk", nic: "", role: "worker_transport", joined: "2024-02-15", status: "Active" },
  { id: 5, name: "Immigration Worker", email: "worker.immigration@gov.lk", nic: "", role: "worker_immigration", joined: "2024-02-16", status: "Suspended" },
];

const roles = [
    "Citizen", "Super Admin", "worker_transport", "worker_immigration", "worker_identity", "worker_health", "worker_tax", "worker_pension", "worker_landregistry", "worker_exams"
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUserRole, setNewUserRole] = useState("Citizen");

  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const userData = Object.fromEntries(formData.entries()) as { name: string; email: string; role: string, nic: string };
    const newUser = { 
        ...userData,
        role: newUserRole,
        id: users.length + 1, 
        joined: new Date().toISOString().split('T')[0],
        status: "Active" 
    };
    setUsers([...users, newUser]);
    setIsAddUserDialogOpen(false);
    setNewUserRole("Citizen");
  };

  return (
    <AdminLayout>
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
           <Button onClick={() => setIsAddUserDialogOpen(true)}><PlusCircle className="mr-2 h-4 w-4" />Add New User</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage platform users and their roles.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email / NIC</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                   <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.role === 'Citizen' ? user.nic : user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'Super Admin' ? 'destructive' : user.role.startsWith('worker_') ? 'outline' : 'secondary'}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'Active' ? 'default' : 'destructive'} className={user.status === 'Active' ? 'bg-green-600' : ''}>{user.status}</Badge>
                    </TableCell>
                     <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/users/${user.id}`}>
                              View Profile <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

       <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <form onSubmit={handleAddUser}>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Fill in the details for the new user. An email is required for Admins/Workers, and an NIC is required for Citizens.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" className="col-span-3" required />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Role</Label>
                <Select name="role" value={newUserRole} onValueChange={setNewUserRole}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
              {newUserRole === 'Citizen' ? (
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nic" className="text-right">NIC</Label>
                  <Input id="nic" name="nic" type="text" className="col-span-3" required />
                </div>
              ) : (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input id="email" name="email" type="email" className="col-span-3" required />
                </div>
              )}
               <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">Password</Label>
                  <Input id="password" name="password" type="password" className="col-span-3" required />
                </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

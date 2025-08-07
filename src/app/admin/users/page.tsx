
"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialUsers = [
  { id: 1, name: "John Doe", email: "john.d@example.com", role: "Citizen", joined: "2024-05-10" },
  { id: 2, name: "Jane Smith", email: "jane.s@example.com", role: "Citizen", joined: "2024-05-12" },
  { id: 3, name: "Admin User", email: "admin@gov.lk", role: "Super Admin", joined: "2024-01-01" },
  { id: 4, name: "Transport Worker", email: "worker.transport@gov.lk", role: "worker_transport", joined: "2024-02-15" },
  { id: 5, name: "Immigration Worker", email: "worker.immigration@gov.lk", role: "worker_immigration", joined: "2024-02-16" },
];

const roles = [
    "Citizen", "Super Admin", "worker_transport", "worker_immigration", "worker_identity", "worker_health", "worker_tax", "worker_pension", "worker_landregistry", "worker_exams"
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isChangeRoleDialogOpen, setIsChangeRoleDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const handleAddUser = () => {
    setCurrentUser(null);
    setIsEditUserDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setIsEditUserDialogOpen(true);
  };

  const handleChangeRole = (user) => {
    setCurrentUser(user);
    setSelectedRole(user.role);
    setIsChangeRoleDialogOpen(true);
  };
  
  const handleSaveUser = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData.entries());
    
    if (currentUser) {
      setUsers(users.map(u => u.id === currentUser.id ? { ...u, ...userData, id: u.id, joined: u.joined } : u));
    } else {
      const newUser = { ...userData, id: users.length + 1, joined: new Date().toISOString().split('T')[0] };
      setUsers([...users, newUser]);
    }
    setIsEditUserDialogOpen(false);
  };

  const handleSaveRole = () => {
    if(currentUser && selectedRole) {
         setUsers(users.map(u => u.id === currentUser.id ? { ...u, role: selectedRole } : u));
    }
    setIsChangeRoleDialogOpen(false);
  }

  return (
    <AdminLayout>
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
           <Button onClick={handleAddUser}>Add New User</Button>
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
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                   <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'Super Admin' ? 'destructive' : user.role.startsWith('worker_') ? 'outline' : 'secondary'}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.joined}</TableCell>
                     <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit User</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeRole(user)}>Change Role</DropdownMenuItem>
                           <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete User</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

       <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSaveUser}>
            <DialogHeader>
              <DialogTitle>{currentUser ? "Edit User" : "Add New User"}</DialogTitle>
              <DialogDescription>
                {currentUser ? "Update the user's details below." : "Fill in the details for the new user."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" defaultValue={currentUser?.name} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={currentUser?.email} className="col-span-3" required />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Role</Label>
                <Select name="role" defaultValue={currentUser?.role || "Citizen"}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isChangeRoleDialogOpen} onOpenChange={setIsChangeRoleDialogOpen}>
        <DialogContent>
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
              <DialogDescription>
                Select a new role for {currentUser?.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role-select" className="text-right">New Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger id="role-select" className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={handleSaveRole}>Save Role</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}


"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal-info");
  
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setActiveTab(hash);
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
              <TabsTrigger value="personal-info">Personal Information</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>

            <TabsContent value="personal-info">
                <Card>
                    <CardHeader className="text-center">
                        <Avatar className="w-24 h-24 mx-auto mb-4">
                            <AvatarImage src="https://placehold.co/100x100" alt="User" data-ai-hint="avatar user" />
                            <AvatarFallback>NS</AvatarFallback>
                        </Avatar>
                        <CardTitle>Nimal Silva</CardTitle>
                        <CardDescription>nimal.s@example.com</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        <div className="space-y-1">
                            <Label>Full Name</Label>
                            <p className="font-medium">Nimal Silva</p>
                        </div>
                        <div className="space-y-1">
                            <Label>Email</Label>
                            <p className="font-medium">nimal.s@example.com</p>
                        </div>
                         <div className="space-y-1">
                            <Label>NIC Number</Label>
                            <p className="font-medium">199012345V</p>
                        </div>
                         <div className="space-y-1">
                            <Label>Contact Number</Label>
                            <p className="font-medium">+94 77 123 4567</p>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <Button>Edit Profile</Button>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value="password">
                 <Card>
                    <CardHeader>
                        <CardTitle>Update Password</CardTitle>
                        <CardDescription>
                        Change your password here. After saving, you'll be logged out for security purposes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 max-w-2xl mx-auto">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" />
                        </div>
                    </CardContent>
                    <CardFooter className="justify-start max-w-2xl mx-auto">
                         <Button type="submit">Update Password</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}


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
import { Camera } from "lucide-react";
import { useEffect, useState, useRef, ChangeEvent } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { db, storage } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { User } from "@/lib/types";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal-info");
  const { user, loading, refetch, updateUserInState } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', nic: '', contactNumber: '+94 77 123 4567' });

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setActiveTab(hash);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        nic: user.nic || '',
        contactNumber: '+94 77 123 4567' // This can be updated if stored in user doc
      });
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    const storageRef = ref(storage, `profile-pictures/${user.id}/${file.name}`);

    try {
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef);

        const userDocRef = doc(db, "users", user.id);
        await updateDoc(userDocRef, { photoURL });
        
        // Update user state locally for an instant UI update
        updateUserInState({ ...user, photoURL });
        
        toast({
            title: "Success",
            description: "Profile picture updated successfully."
        });

    } catch (error) {
        console.error("Error uploading file:", error);
        toast({
            title: "Upload Failed",
            description: "Could not upload your profile picture. Please try again.",
            variant: "destructive"
        });
    } finally {
        setUploading(false);
    }
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    try {
        const userDocRef = doc(db, "users", user.id);
        const updatedData = {
            name: formData.name,
            // email and nic are typically not user-editable, but could be added here
        };
        await updateDoc(userDocRef, updatedData);
        
        // Update user state locally
        updateUserInState({ ...user, ...updatedData });
        
        toast({ title: "Success", description: "Profile updated successfully." });
        setIsEditing(false);
    } catch(error) {
        console.error("Error updating profile:", error);
        toast({ title: "Update Failed", description: "Could not update your profile.", variant: "destructive"});
    }
  }
  
  if (loading || !user) {
    return (
        <DashboardLayout>
             <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-10 w-1/2" />
                 <Card>
                    <CardHeader className="text-center">
                        <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                        <Skeleton className="h-8 w-1/3 mx-auto" />
                        <Skeleton className="h-6 w-1/2 mx-auto" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
             </div>
        </DashboardLayout>
    )
  }

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
                         <div className="relative mx-auto w-24 h-24 mb-4 group">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={user.photoURL || `https://placehold.co/100x100`} alt={user.name} data-ai-hint="avatar user" />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <button 
                                onClick={handleAvatarClick}
                                disabled={uploading}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Camera className="w-8 h-8 text-white" />
                                {uploading && <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg" className="hidden" />
                         </div>
                        <CardTitle>{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        <div className="space-y-1">
                            <Label htmlFor="name">Full Name</Label>
                             <Input id="name" value={formData.name} onChange={handleFormChange} disabled={!isEditing} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                             <Input id="email" value={formData.email} disabled />
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="nic">NIC Number</Label>
                             <Input id="nic" value={formData.nic} disabled />
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="contactNumber">Contact Number</Label>
                             <Input id="contactNumber" value={formData.contactNumber} onChange={handleFormChange} disabled={!isEditing} />
                        </div>
                    </CardContent>
                    <CardFooter className="justify-center gap-2">
                         {isEditing ? (
                            <>
                                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button onClick={handleSaveChanges}>Save Changes</Button>
                            </>
                         ) : (
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                         )}
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


"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import type { Application } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      const q = query(collection(db, "applications"), where("user", "==", user.name));
      
      try {
        const querySnapshot = await getDocs(q);
        const apps = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Application));
        setApplications(apps);
      } catch (error) {
        console.error("Error fetching applications: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);
  
  const formatDate = (date: Timestamp | string) => {
    if (typeof date === 'string') return date;
    return date.toDate().toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
           <Button className="w-full sm:w-auto">Apply for a New Service</Button>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Track all your submitted applications and their progress.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Service</TableHead>
                                <TableHead>Reference ID</TableHead>
                                <TableHead>Date Submitted</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                              Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                  <TableCell colSpan={5}>
                                    <Skeleton className="h-8 w-full" />
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : applications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">You have not submitted any applications yet.</TableCell>
                                </TableRow>
                            ) : (
                              applications.map((app) => (
                                 <TableRow key={app.id}>
                                    <TableCell className="font-medium">{app.service}</TableCell>
                                    <TableCell>{app.id}</TableCell>
                                    <TableCell>{formatDate(app.submitted)}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            app.status === 'Approved' || app.status === 'Completed' ? 'default'
                                            : app.status === 'In Review' || app.status === 'In Progress' ? 'secondary'
                                            : app.status === 'Pending Payment' ? 'outline'
                                            : 'destructive'
                                        }
                                         className={
                                            app.status === 'Approved' || app.status === 'Completed' ? 'bg-green-600' : ''
                                        }
                                        >{app.status}</Badge>
                                    </TableCell>
                                     <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">View Details</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}


"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import type { Application } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SERVICE_NAMES = ["National Medical ID Card Application", "Medical Appointment Request"];

export default function WorkerHealthDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "applications"), where("service", "in", SERVICE_NAMES));
        const querySnapshot = await getDocs(q);
        const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
        setApplications(apps);
      } catch (error) {
        console.error("Error fetching applications: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);
  
  const formatDate = (date: Timestamp | string | undefined) => {
    if (!date) return 'N/A';
    if (typeof date === 'string') return new Date(date).toLocaleString();
    if (date instanceof Timestamp) return date.toDate().toLocaleString();
    if (date instanceof Date) return date.toLocaleString();
    return 'Invalid Date';
  };

  return (
    <AdminLayout workerMode>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Health Services Dashboard</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Health-Related Applications</CardTitle>
            <CardDescription>Review Medical ID requests and appointments.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Submitted / Appointment Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                      </TableRow>
                    ))
                  ) : applications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">No applications found.</TableCell>
                      </TableRow>
                  ) : applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.user}</TableCell>
                      <TableCell>{app.service}</TableCell>
                      <TableCell>{app.service === 'Medical Appointment Request' ? formatDate(app.details?.appointmentDate) : formatDate(app.submitted)}</TableCell>
                      <TableCell>
                        <Badge variant={
                          app.status === 'Approved' || app.status === 'Completed' ? 'default'
                          : app.status === 'Pending' ? 'secondary'
                          : 'destructive'
                        } className={app.status === 'Approved' ? 'bg-green-600' : ''}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/worker/applications/${app.id}?from=/worker/health/dashboard`}>
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

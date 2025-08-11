
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, getCountFromServer, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Application } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";


const transportServices = [
    "Renew Driving License",
    "Fine Payment",
    "Registered Vehicles",
];

const appointmentServices = ["Renew Driving License"];

export default function WorkerTransportDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [appointments, setAppointments] = useState<Application[]>([]);
  const [stats, setStats] = useState({ pendingRenewals: 0, pendingRegistrations: 0, appointmentsToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all applications related to transport services
        const appsQuery = query(collection(db, "applications"), where("service", "in", transportServices));
        const appsSnapshot = await getDocs(appsQuery);
        const appsData = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
        
        // Separate applications with appointments from general ones
        const allAppointments = appsData.filter(app => appointmentServices.includes(app.service) && app.details?.appointmentDate);
        const generalApplications = appsData.filter(app => !allAppointments.some(appt => appt.id === app.id));

        setAppointments(allAppointments);
        setApplications(generalApplications);

        // Fetch stats
        const renewalsQuery = query(collection(db, "applications"), where("service", "==", "Renew Driving License"), where("status", "in", ["Pending", "In Progress", "Pending Payment"]));
        const registrationsQuery = query(collection(db, "applications"), where("service", "==", "Registered Vehicles"), where("status", "in", ["Pending", "In Progress", "Pending Payment"]));
        
        const [renewalsSnapshot, registrationsSnapshot] = await Promise.all([
          getCountFromServer(renewalsQuery),
          getCountFromServer(registrationsQuery)
        ]);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const appointmentsTodayCount = allAppointments.filter(app => {
            if (!app.details?.appointmentDate) return false;
            const appDate = (app.details.appointmentDate as Timestamp).toDate();
            return appDate >= today && appDate < tomorrow;
        }).length;

        setStats({ 
          pendingRenewals: renewalsSnapshot.data().count, 
          pendingRegistrations: registrationsSnapshot.data().count,
          appointmentsToday: appointmentsTodayCount
        });

      } catch (error) {
        console.error("Error fetching transport data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const formatDate = (date: Timestamp | string | undefined) => {
    if (!date) return 'N/A';
    if (typeof date === 'string') return new Date(date).toLocaleDateString();
    if (date instanceof Timestamp) return date.toDate().toLocaleDateString();
    return 'Invalid Date';
  };

  return (
    <AdminLayout workerMode>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <h1 className="text-3xl font-bold tracking-tight">Transport Worker Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending License Renewals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats.pendingRenewals}</div>}
              <p className="text-xs text-muted-foreground">New applications to review</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Registrations</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats.pendingRegistrations}</div>}
              <p className="text-xs text-muted-foreground">Waiting for validation</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats.appointmentsToday}</div>}
               <p className="text-xs text-muted-foreground">For driving tests & biometrics</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>All scheduled biometrics and driving test appointments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Appointment Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell>
                        </TableRow>
                      ))
                    ) : appointments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">No upcoming appointments.</TableCell>
                      </TableRow>
                    ) : ( appointments.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.user}</TableCell>
                        <TableCell>{formatDate(app.details?.appointmentDate)}</TableCell>
                        <TableCell>
                          <Badge variant={app.status === 'Approved' ? 'default' : 'secondary'} className={app.status === 'Approved' ? 'bg-green-600' : ''}>{app.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button asChild variant="outline" size="sm">
                              <Link href={`/worker/applications/${app.id}?from=/worker/transport/dashboard`}>View Details</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>General Applications</CardTitle>
               <CardDescription>Other non-appointment based applications.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell>
                        </TableRow>
                      ))
                    ) : applications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">No general applications found.</TableCell>
                      </TableRow>
                    ) : ( applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.service}</TableCell>
                        <TableCell>{app.user}</TableCell>
                        <TableCell>
                          <Badge variant={app.status === 'Paid' || app.status === 'Approved' || app.status === 'Completed' ? 'default' : 'secondary'} className={app.status === 'Paid' || app.status === 'Approved' || app.status === 'Completed' ? 'bg-green-600' : ''}>{app.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button asChild variant="outline" size="sm">
                              <Link href={`/worker/applications/${app.id}?from=/worker/transport/dashboard`}>View Details</Link>
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
      </div>
    </AdminLayout>
  );
}

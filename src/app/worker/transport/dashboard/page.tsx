
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, FileText, CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, getCountFromServer, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Application } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";


const transportServices = [
    "Renew Driving License",
    "Fine Payment",
    "Registered Vehicles",
    "Missing Documents", // Assuming transport handles lost licenses
];

export default function WorkerTransportDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState({ pendingRenewals: 0, pendingRegistrations: 0, appointments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch applications for this worker type
        const appsQuery = query(collection(db, "applications"), where("service", "in", transportServices));
        const appsSnapshot = await getDocs(appsQuery);
        const appsData = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
        setApplications(appsData);

        // Fetch stats
        const renewalsQuery = query(collection(db, "applications"), where("service", "==", "Renew Driving License"), where("status", "==", "Pending"));
        const renewalsSnapshot = await getCountFromServer(renewalsQuery);
        setStats(prev => ({ ...prev, pendingRenewals: renewalsSnapshot.data().count }));
        
        const registrationsQuery = query(collection(db, "applications"), where("service", "==", "Registered Vehicles"), where("status", "==", "Pending"));
        const registrationsSnapshot = await getCountFromServer(registrationsQuery);
        setStats(prev => ({ ...prev, pendingRegistrations: registrationsSnapshot.data().count }));

      } catch (error) {
        console.error("Error fetching transport data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const formatDate = (date: Timestamp | string) => {
    if (!date) return 'N/A';
    if (typeof date === 'string') return date;
    return date.toDate().toLocaleDateString();
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
              <div className="text-2xl font-bold">3</div>
               <p className="text-xs text-muted-foreground">For driving tests</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ref ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Submitted On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
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
                      <TableCell colSpan={5} className="text-center">No transport-related applications found.</TableCell>
                    </TableRow>
                  ) : ( applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{app.id}</TableCell>
                      <TableCell>{app.service}</TableCell>
                      <TableCell>{formatDate(app.submitted)}</TableCell>
                      <TableCell>
                        <Badge variant={app.status === 'Paid' || app.status === 'Approved' ? 'default' : 'secondary'} className={app.status === 'Paid' || app.status === 'Approved' ? 'bg-green-600' : ''}>{app.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost"><MoreHorizontal /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>View Application</DropdownMenuItem>
                            <DropdownMenuItem>Approve</DropdownMenuItem>
                            <DropdownMenuItem>Reject</DropdownMenuItem>
                            <DropdownMenuItem>Request Documents</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

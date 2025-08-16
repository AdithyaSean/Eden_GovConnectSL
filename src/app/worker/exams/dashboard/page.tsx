
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import type { Application, User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";


const SERVICE_NAME = "Exam Re-correction Appeal";
const statuses = ['All', 'Pending', 'Approved', 'Rejected', 'In Progress', 'Completed'];

export default function WorkerExamsDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const appsQuery = query(collection(db, "applications"), where("service", "==", SERVICE_NAME));
        const [appsSnapshot, usersSnapshot] = await Promise.all([
          getDocs(appsQuery),
          getDocs(collection(db, "users")),
        ]);

        const apps = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
        setApplications(apps);

        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setUsers(usersData);

      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const usersById = useMemo(() => {
    return users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {} as {[key: string]: User});
  }, [users]);
  
  const filteredAndSortedApplications = useMemo(() => {
    return applications
      .filter(app => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const user = app.userId ? usersById[app.userId] : null;

        const matchesSearch = searchQuery === "" || (user && user.nic.toLowerCase().includes(lowercasedQuery));
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const isCompletedA = a.status === 'Completed' || a.status === 'Rejected';
        const isCompletedB = b.status === 'Completed' || b.status === 'Rejected';

        if (isCompletedA && !isCompletedB) return 1;
        if (!isCompletedA && isCompletedB) return -1;

        const dateA = a.submitted instanceof Timestamp ? a.submitted.toMillis() : new Date(a.submitted).getTime();
        const dateB = b.submitted instanceof Timestamp ? b.submitted.toMillis() : new Date(b.submitted).getTime();

        return dateB - dateA;
      });
  }, [searchQuery, statusFilter, applications, usersById]);
  
  const getStatusClass = (status: Application['status']) => {
    switch (status) {
        case 'Approved':
            return 'bg-green-600 text-white border-0 shadow-sm';
        case 'Completed':
            return 'bg-blue-500 text-white border-0';
        case 'In Progress':
            return 'bg-orange-500 text-white border-0';
        case 'Rejected':
            return 'bg-red-600 text-white border-0';
        case 'Pending':
        default:
            return 'bg-gray-200 text-gray-800';
    }
  }

  const formatDate = (date: Timestamp | string) => {
    if (!date) return 'N/A';
    if (typeof date === 'string') return date;
    return date.toDate().toLocaleDateString();
  };

  return (
    <AdminLayout workerMode>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Exams Department Dashboard</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Re-correction Appeals</CardTitle>
            <CardDescription>Review and manage all submitted appeals for exam re-correction.</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="relative md:col-span-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search by NIC..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        {statuses.map(status => <SelectItem key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Exam Type</TableHead>
                    <TableHead>Submitted On</TableHead>
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
                  ) : filteredAndSortedApplications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">No appeals found.</TableCell>
                      </TableRow>
                  ) : filteredAndSortedApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.user}</TableCell>
                      <TableCell>{app.details?.examType || 'N/A'}</TableCell>
                      <TableCell>{formatDate(app.submitted)}</TableCell>
                      <TableCell>
                        <Badge className={cn("capitalize", getStatusClass(app.status))}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/worker/applications/${app.id}?from=/worker/exams/dashboard`}>
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

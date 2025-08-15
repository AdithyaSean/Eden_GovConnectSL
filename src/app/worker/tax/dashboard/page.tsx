
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState, FormEvent, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp, addDoc, serverTimestamp } from "firebase/firestore";
import type { Application, User, TaxRecord } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowRight, Search, UserCheck, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const SERVICE_NAME = "Tax Document Submission";
const appStatuses = ['All', 'Pending', 'Approved', 'Rejected', 'In Progress', 'Completed', 'In Review'];
const recordStatuses = ['All', 'Due', 'Paid'];

export default function WorkerTaxDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [searchNic, setSearchNic] = useState("");
  const [searchNicToAdd, setSearchNicToAdd] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  
  const [appStatusFilter, setAppStatusFilter] = useState("All");
  const [recordStatusFilter, setRecordStatusFilter] = useState("All");

  const fetchAllData = async () => {
      setLoading(true);
      setLoadingRecords(true);
      try {
        const appQuery = query(collection(db, "applications"), where("service", "==", SERVICE_NAME));
        const recordsQuery = query(collection(db, "taxRecords"));
        const usersQuery = query(collection(db, "users"));

        const [appSnapshot, recordsSnapshot, usersSnapshot] = await Promise.all([
            getDocs(appQuery),
            getDocs(recordsQuery),
            getDocs(usersQuery)
        ]);

        const apps = appSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
        setApplications(apps);
        setLoading(false);

        const records = recordsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TaxRecord));
        setTaxRecords(records);
        setLoadingRecords(false);

        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setAllUsers(usersData);

      } catch (e) {
          console.error("Error fetching data", e);
          setLoading(false);
          setLoadingRecords(false);
      }
  }

  useEffect(() => {
    fetchAllData();
  }, []);
  
  const usersById = useMemo(() => {
    return allUsers.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {} as {[key: string]: User});
  }, [allUsers]);

  const filteredAndSortedApplications = useMemo(() => {
    return applications
      .filter(app => {
        const lowercasedQuery = searchNic.toLowerCase();
        const user = app.userId ? usersById[app.userId] : null;

        const matchesSearch = searchNic === "" || (user && user.nic.toLowerCase().includes(lowercasedQuery));
        const matchesStatus = appStatusFilter === 'All' || app.status === appStatusFilter;

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
  }, [searchNic, appStatusFilter, applications, usersById]);

  const filteredAndSortedRecords = useMemo(() => {
    return taxRecords.filter(record => {
        const matchesNic = !searchNic || record.nic.toLowerCase().includes(searchNic.toLowerCase());
        const matchesStatus = recordStatusFilter === 'All' || record.status === recordStatusFilter;
        return matchesNic && matchesStatus;
    }).sort((a,b) => {
        const isCompletedA = a.status === 'Paid';
        const isCompletedB = b.status === 'Paid';

        if (isCompletedA && !isCompletedB) return 1;
        if (!isCompletedA && isCompletedB) return -1;
        
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        
        return dateB - dateA;
    });
  }, [taxRecords, searchNic, recordStatusFilter]);


  const handleUserSearch = async () => {
      if(!searchNicToAdd) return;
      setIsSearching(true);
      setFoundUser(null);
      
      const lowercasedQuery = searchNicToAdd.toLowerCase();
      const user = allUsers.find(u => u.nic?.toLowerCase().includes(lowercasedQuery));
      
      if(user) {
          setFoundUser(user);
      } else {
          toast({ title: "User not found", description: "No citizen found with that NIC.", variant: "destructive" });
      }
      setIsSearching(false);
  }
  
  const handleAddTaxRecord = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if(!foundUser) return;
      
      const formData = new FormData(e.target as HTMLFormElement);
      const recordData = Object.fromEntries(formData.entries());
      
      try {
          await addDoc(collection(db, "taxRecords"), {
              nic: foundUser.nic,
              year: Number(recordData.year),
              type: recordData.type,
              amount: recordData.amount,
              dueDate: recordData.dueDate,
              status: 'Due'
          });

           await addDoc(collection(db, "notifications"), {
              userId: foundUser.id,
              title: "New Tax Record Added",
              description: `A tax record for ${recordData.year} of LKR ${recordData.amount} has been added.`,
              href: `/payments`,
              icon: "AlertTriangle",
              read: false,
              createdAt: serverTimestamp()
          });

          toast({ title: "Tax Record Added Successfully" });
          fetchAllData();
          setFoundUser(null);
          setSearchNicToAdd("");
          (e.target as HTMLFormElement).reset();
      } catch (error) {
           toast({ title: "Failed to add record", variant: "destructive" });
      }
  }
  
  const getAppStatusClass = (status: Application['status']) => {
    switch (status) {
        case 'Approved':
            return 'bg-green-600 text-white border-0 shadow-sm';
        case 'Completed':
            return 'bg-blue-500 text-white border-0';
        case 'In Progress':
        case 'In Review':
            return 'bg-orange-500 text-white border-0';
        case 'Rejected':
            return 'bg-red-600 text-white border-0';
        case 'Pending':
        default:
            return 'bg-gray-200 text-gray-800';
    }
  }
  
  const getRecordStatusClass = (status: TaxRecord['status']) => {
      return status === 'Paid' ? 'bg-green-600 text-white border-0' : 'bg-red-600 text-white border-0';
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
          <h1 className="text-3xl font-bold tracking-tight">IRD Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Tax Document Submissions</CardTitle>
                    <CardDescription>Review and manage all tax-related document submissions from citizens.</CardDescription>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="relative md:col-span-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input 
                                placeholder="Search by NIC..." 
                                className="pl-10"
                                value={searchNic}
                                onChange={(e) => setSearchNic(e.target.value)} 
                            />
                        </div>
                        <Select value={appStatusFilter} onValueChange={setAppStatusFilter}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                {appStatuses.map(status => <SelectItem key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</SelectItem>)}
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
                            <TableHead>Documents Uploaded</TableHead>
                            <TableHead>Submitted On</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                              <TableRow key={i}>
                                <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                              </TableRow>
                            ))
                          ) : filteredAndSortedApplications.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">No applications found.</TableCell>
                              </TableRow>
                          ) : filteredAndSortedApplications.map((app) => (
                            <TableRow key={app.id}>
                              <TableCell className="font-medium">{app.user}</TableCell>
                              <TableCell>{Object.keys(app.documents || {}).length}</TableCell>
                              <TableCell>{formatDate(app.submitted)}</TableCell>
                              <TableCell>
                                <Badge className={cn("capitalize", getAppStatusClass(app.status))}>
                                  {app.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button asChild variant="outline" size="sm">
                                  <Link href={`/worker/applications/${app.id}?from=/worker/tax/dashboard`}>
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

                <Card>
                   <CardHeader>
                       <CardTitle>All Tax Records</CardTitle>
                       <CardDescription>A log of all tax payment records in the system.</CardDescription>
                        <div className="pt-4">
                           <Select value={recordStatusFilter} onValueChange={setRecordStatusFilter}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {recordStatuses.map(status => <SelectItem key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                   </CardHeader>
                   <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Citizen NIC</TableHead>
                                    <TableHead>Year</TableHead>
                                    <TableHead>Tax Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loadingRecords ? <TableRow><TableCell colSpan={5}><Skeleton className="h-8"/></TableCell></TableRow>
                                : filteredAndSortedRecords.map(record => (
                                    <TableRow key={record.id}>
                                        <TableCell>{record.nic}</TableCell>
                                        <TableCell>{record.year}</TableCell>
                                        <TableCell>{record.type}</TableCell>
                                        <TableCell>LKR {record.amount}</TableCell>
                                        <TableCell>
                                           <Badge className={cn("capitalize", getRecordStatusClass(record.status))}>
                                              {record.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                   </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>Add Tax Record</CardTitle>
                        <CardDescription>Search for a citizen and add a new tax record.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="search-nic-tax">Search Citizen by NIC</Label>
                            <div className="flex gap-2">
                                <Input id="search-nic-tax" value={searchNicToAdd} onChange={e => setSearchNicToAdd(e.target.value)} placeholder="Enter NIC..."/>
                                <Button onClick={handleUserSearch} disabled={isSearching || !searchNicToAdd}>
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        
                        {isSearching && <Skeleton className="h-10 w-full" />}
                        
                        {foundUser && (
                            <form className="space-y-4 pt-4 border-t" onSubmit={handleAddTaxRecord}>
                                <div className="p-3 rounded-md bg-muted flex items-center gap-2">
                                    <UserCheck className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="font-semibold">{foundUser.name}</p>
                                        <p className="text-sm text-muted-foreground">{foundUser.nic}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tax-type">Tax Type</Label>
                                    <Input id="tax-type" name="type" required placeholder="e.g., Income Tax (Q1)" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tax-year">Year</Label>
                                    <Input id="tax-year" name="year" type="number" required placeholder="e.g., 2024" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tax-amount">Amount (LKR)</Label>
                                    <Input id="tax-amount" name="amount" type="number" required placeholder="e.g., 15000.00" />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="tax-due-date">Due Date</Label>
                                    <Input id="tax-due-date" name="dueDate" type="date" required />
                                </div>
                                <Button type="submit" className="w-full">Add Tax Record</Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>

        </div>

      </div>
    </AdminLayout>
  );
}

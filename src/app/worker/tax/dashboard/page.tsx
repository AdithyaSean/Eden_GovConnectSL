
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState, FormEvent } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp, addDoc } from "firebase/firestore";
import type { Application, User, TaxRecord } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowRight, Search, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const SERVICE_NAME = "Tax Document Submission";

export default function WorkerTaxDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [searchNic, setSearchNic] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  
  const fetchAllData = async () => {
      setLoading(true);
      setLoadingRecords(true);
      try {
        const appQuery = query(collection(db, "applications"), where("service", "==", SERVICE_NAME));
        const appSnapshot = await getDocs(appQuery);
        const apps = appSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
        setApplications(apps);
        setLoading(false);

        const recordsQuery = query(collection(db, "taxRecords"));
        const recordsSnapshot = await getDocs(recordsQuery);
        const records = recordsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TaxRecord));
        setTaxRecords(records);
        setLoadingRecords(false);

        const usersQuery = query(collection(db, "users"));
        const usersSnapshot = await getDocs(usersQuery);
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
  
  const handleUserSearch = async () => {
      if(!searchNic) return;
      setIsSearching(true);
      setFoundUser(null);
      
      const lowercasedQuery = searchNic.toLowerCase();
      const user = allUsers.find(u => u.nic?.toLowerCase().includes(lowercasedQuery));
      
      if(user) {
          setFoundUser(user);
      } else {
          toast({ title: "User not found", variant: "destructive" });
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
          toast({ title: "Tax Record Added Successfully" });
          fetchAllData(); // Refresh all lists
          setFoundUser(null);
          setSearchNic("");
          (e.target as HTMLFormElement).reset();
      } catch (error) {
           toast({ title: "Failed to add record", variant: "destructive" });
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
          <h1 className="text-3xl font-bold tracking-tight">IRD Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Tax Document Submissions</CardTitle>
                    <CardDescription>Review and manage all tax-related document submissions from citizens.</CardDescription>
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
                          ) : applications.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">No applications found.</TableCell>
                              </TableRow>
                          ) : applications.map((app) => (
                            <TableRow key={app.id}>
                              <TableCell className="font-medium">{app.user}</TableCell>
                              <TableCell>{Object.keys(app.documents || {}).length}</TableCell>
                              <TableCell>{formatDate(app.submitted)}</TableCell>
                              <TableCell>
                                <Badge variant={
                                  app.status === 'Approved' || app.status === 'Completed' ? 'default'
                                  : app.status === 'Pending' || app.status === 'In Review' ? 'secondary'
                                  : 'destructive'
                                } className={app.status === 'Approved' ? 'bg-green-600' : ''}>
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
                                : taxRecords.map(record => (
                                    <TableRow key={record.id}>
                                        <TableCell>{record.nic}</TableCell>
                                        <TableCell>{record.year}</TableCell>
                                        <TableCell>{record.type}</TableCell>
                                        <TableCell>LKR {record.amount}</TableCell>
                                        <TableCell>
                                           <Badge variant={record.status === 'Paid' ? 'default' : 'destructive'}
                                          className={record.status === 'Paid' ? 'bg-green-600' : ''}>
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
                                <Input id="search-nic-tax" value={searchNic} onChange={e => setSearchNic(e.target.value)} placeholder="Enter NIC..."/>
                                <Button onClick={handleUserSearch} disabled={isSearching || !searchNic}>
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

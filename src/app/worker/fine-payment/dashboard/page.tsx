
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState, FormEvent, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp, addDoc, doc, serverTimestamp } from "firebase/firestore";
import type { Fine, User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowRight, Search, UserCheck, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const statuses = ['All', 'Pending', 'Paid'];

export default function WorkerFinePaymentDashboard() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchNic, setSearchNic] = useState("");
  const [searchNicToAdd, setSearchNicToAdd] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const fetchFinesAndUsers = async () => {
      setLoading(true);
      try {
        const finesQuery = query(collection(db, "fines"));
        const finesSnapshot = await getDocs(finesQuery);
        const fineData = finesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Fine));
        setFines(fineData);

        const usersQuery = query(collection(db, "users"));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setAllUsers(usersData);

      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchFinesAndUsers();
  }, []);
  
  const filteredAndSortedFines = useMemo(() => {
    return fines.filter(fine => {
        const matchesNic = !searchNic || fine.nic.toLowerCase().includes(searchNic.toLowerCase());
        const matchesStatus = statusFilter === 'All' || fine.status === statusFilter;
        return matchesNic && matchesStatus;
    }).sort((a,b) => {
        const isCompletedA = a.status === 'Paid';
        const isCompletedB = b.status === 'Paid';

        if (isCompletedA && !isCompletedB) return 1;
        if (!isCompletedA && isCompletedB) return -1;
        
        const dateA = new Date(a.issuedDate).getTime();
        const dateB = new Date(b.issuedDate).getTime();
        
        return dateB - dateA;
    })
  }, [fines, searchNic, statusFilter]);

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
  
  const handleAddFine = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if(!foundUser) return;
      
      const formData = new FormData(e.target as HTMLFormElement);
      const fineData = Object.fromEntries(formData.entries());
      
      try {
          await addDoc(collection(db, "fines"), {
              nic: foundUser.nic,
              type: fineData.type,
              amount: fineData.amount,
              issuedDate: new Date().toISOString().split('T')[0],
              dueDate: fineData.dueDate,
              status: 'Pending'
          });

          // Create notification for the user
          await addDoc(collection(db, "notifications"), {
              userId: foundUser.id,
              title: "New Fine Issued",
              description: `A new fine of LKR ${fineData.amount} for '${fineData.type}' has been added to your record.`,
              href: `/payments`,
              icon: "AlertTriangle",
              read: false,
              createdAt: serverTimestamp()
          });

          toast({ title: "Fine Added Successfully" });
          fetchFinesAndUsers(); // Refresh the list
          setFoundUser(null);
          setSearchNicToAdd("");
          (e.target as HTMLFormElement).reset();
      } catch (error) {
           toast({ title: "Failed to add fine", variant: "destructive" });
      }
  }
  
  const getStatusClass = (status: Fine['status']) => {
    switch(status){
        case 'Paid':
            return 'bg-green-600 text-white border-0 shadow-sm';
        case 'Pending':
        default:
            return 'bg-red-600 text-white border-0';
    }
  }

  return (
    <AdminLayout workerMode>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Fine Management Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                 <Card>
                  <CardHeader>
                    <CardTitle>All Recorded Fines</CardTitle>
                    <CardDescription>Review and manage all fines in the system.</CardDescription>
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
                            <TableHead>Citizen NIC</TableHead>
                            <TableHead>Fine Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                              <TableRow key={i}>
                                <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                              </TableRow>
                            ))
                          ) : filteredAndSortedFines.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">No fines found.</TableCell>
                              </TableRow>
                          ) : filteredAndSortedFines.map((fine) => (
                            <TableRow key={fine.id}>
                              <TableCell className="font-medium">{fine.nic}</TableCell>
                              <TableCell>{fine.type}</TableCell>
                              <TableCell>LKR {fine.amount}</TableCell>
                              <TableCell>{fine.dueDate}</TableCell>
                              <TableCell>
                                 <Badge className={cn("capitalize", getStatusClass(fine.status))}>
                                  {fine.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
            </div>
            
            <div className="lg:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>Add New Fine</CardTitle>
                        <CardDescription>Search for a citizen and add a new fine record.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="search-nic">Search Citizen by NIC</Label>
                            <div className="flex gap-2">
                                <Input id="search-nic" value={searchNicToAdd} onChange={e => setSearchNicToAdd(e.target.value)} placeholder="Enter NIC..."/>
                                <Button onClick={handleUserSearch} disabled={isSearching || !searchNicToAdd}>
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        
                        {isSearching && <Skeleton className="h-10 w-full" />}
                        
                        {foundUser && (
                            <form className="space-y-4 pt-4 border-t" onSubmit={handleAddFine}>
                                <div className="p-3 rounded-md bg-muted flex items-center gap-2">
                                    <UserCheck className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="font-semibold">{foundUser.name}</p>
                                        <p className="text-sm text-muted-foreground">{foundUser.nic}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fine-type">Fine Type</Label>
                                    <Input id="fine-type" name="type" required placeholder="e.g., Speeding Violation" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fine-amount">Amount (LKR)</Label>
                                    <Input id="fine-amount" name="amount" type="number" required placeholder="e.g., 2500.00" />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="fine-due-date">Due Date</Label>
                                    <Input id="fine-due-date" name="dueDate" type="date" required />
                                </div>
                                <Button type="submit" className="w-full">Add Fine to Record</Button>
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

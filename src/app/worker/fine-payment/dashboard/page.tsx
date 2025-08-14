
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState, FormEvent } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp, addDoc, doc } from "firebase/firestore";
import type { Fine, User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowRight, Search, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function WorkerFinePaymentDashboard() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchNic, setSearchNic] = useState("");
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const fetchFines = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "fines"));
        const querySnapshot = await getDocs(q);
        const fineData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Fine));
        setFines(fineData);
      } catch (error) {
        console.error("Error fetching fines: ", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchFines();
  }, []);
  
  const handleUserSearch = async () => {
      if(!searchNic) return;
      setIsSearching(true);
      setFoundUser(null);
      try {
          const q = query(collection(db, "users"), where("nic", "==", searchNic));
          const querySnapshot = await getDocs(q);
          if(!querySnapshot.empty){
              const user = querySnapshot.docs[0].data() as User;
              setFoundUser(user);
          } else {
              toast({ title: "User not found", variant: "destructive" });
          }
      } catch (e) {
          toast({ title: "Search failed", variant: "destructive" });
      } finally {
          setIsSearching(false);
      }
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
          toast({ title: "Fine Added Successfully" });
          fetchFines(); // Refresh the list
          setFoundUser(null);
          setSearchNic("");
          (e.target as HTMLFormElement).reset();
      } catch (error) {
           toast({ title: "Failed to add fine", variant: "destructive" });
      }
  }

  return (
    <AdminLayout workerMode>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Fine Management Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                 <Card>
                  <CardHeader>
                    <CardTitle>All Recorded Fines</CardTitle>
                    <CardDescription>Review and manage all fines in the system.</CardDescription>
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
                          ) : fines.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">No fines found.</TableCell>
                              </TableRow>
                          ) : fines.map((fine) => (
                            <TableRow key={fine.id}>
                              <TableCell className="font-medium">{fine.nic}</TableCell>
                              <TableCell>{fine.type}</TableCell>
                              <TableCell>LKR {fine.amount}</TableCell>
                              <TableCell>{fine.dueDate}</TableCell>
                              <TableCell>
                                 <Badge variant={fine.status === 'Paid' ? 'default' : 'destructive'}
                                  className={fine.status === 'Paid' ? 'bg-green-600' : ''}>
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
                                <Input id="search-nic" value={searchNic} onChange={e => setSearchNic(e.target.value)} placeholder="Enter NIC..."/>
                                <Button onClick={handleUserSearch} disabled={isSearching || !searchNic}>
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

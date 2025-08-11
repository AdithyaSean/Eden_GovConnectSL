
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, getCountFromServer, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Application, Fine } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ReceiptText, AlertTriangle, CheckCircle } from "lucide-react";

export default function WorkerFinePaymentDashboard() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [stats, setStats] = useState({ pendingFines: 0, paidToday: 0, disputedFines: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFines = async () => {
      setLoading(true);
      const q = query(collection(db, "fines"));
      try {
        const querySnapshot = await getDocs(q);
        const finesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Fine));
        setFines(finesData);

        // Stats
        const pendingQuery = query(q, where("status", "==", "Pending"));
        const paidQuery = query(q, where("status", "==", "Paid")); // Simplified for demo

        const [pendingSnapshot, paidSnapshot] = await Promise.all([
          getCountFromServer(pendingQuery),
          getCountFromServer(paidQuery),
        ]);

        setStats({
          pendingFines: pendingSnapshot.data().count,
          paidToday: paidSnapshot.data().count,
          disputedFines: 0 // Placeholder
        });

      } catch (error) {
        console.error("Error fetching fines data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFines();
  }, []);
  
  return (
    <AdminLayout workerMode>
      <div className="flex-1 space-y-8 p-8 pt-6">
        <h1 className="text-3xl font-bold tracking-tight">Fine Payment Worker Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Fines</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats.pendingFines}</div>}
              <p className="text-xs text-muted-foreground">Total number of unpaid fines</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payments Received Today</CardTitle>
              <ReceiptText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats.paidToday}</div>}
              <p className="text-xs text-muted-foreground">Total fines settled today</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disputed Fines</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats.disputedFines}</div>}
               <p className="text-xs text-muted-foreground">Under review or appealed</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Fine Payments</CardTitle>
            <CardDescription>Review and verify recent fine payments from citizens.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fine ID</TableHead>
                  <TableHead>NIC</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                        </TableRow>
                    ))
                ) : fines.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">No fines found.</TableCell>
                    </TableRow>
                ) : (
                fines.map((fine) => (
                  <TableRow key={fine.id}>
                    <TableCell className="font-medium">{fine.id}</TableCell>
                    <TableCell>{fine.nic}</TableCell>
                    <TableCell>LKR {fine.amount}</TableCell>
                    <TableCell>
                      <Badge variant={fine.status === 'Paid' ? 'default' : 'destructive'} className={fine.status === 'Paid' ? 'bg-green-600' : ''}>{fine.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Verify Payment</Button>
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}


"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import type { Fine } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function WorkerFinePaymentDashboard() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchFines();
  }, []);

  return (
    <AdminLayout workerMode>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Fine Management Dashboard</h1>
        </div>
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
    </AdminLayout>
  );
}

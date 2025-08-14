
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, Timestamp, doc, updateDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PasswordResetRequest {
    id: string;
    workerName: string;
    workerEmail: string;
    requestedAt: Timestamp;
    status: 'Pending' | 'Resolved';
}

export default function PasswordResetsPage() {
  const [requests, setRequests] = useState<PasswordResetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "passwordResets"), orderBy("requestedAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PasswordResetRequest));
      setRequests(data);
    } catch (error) {
      console.error("Error fetching password reset requests: ", error);
      toast({ title: "Error", description: "Could not fetch requests.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleResolve = async (id: string) => {
    const requestRef = doc(db, "passwordResets", id);
    try {
        await updateDoc(requestRef, { status: "Resolved" });
        toast({ title: "Request Resolved", description: "The request has been marked as resolved."});
        fetchRequests(); // Refresh the list
    } catch (error) {
        console.error("Error resolving request: ", error);
        toast({ title: "Error", description: "Could not update the request status.", variant: "destructive"});
    }
  };
  
  const formatDate = (date: Timestamp | string | undefined) => {
    if (!date) return 'N/A';
    if (date instanceof Timestamp) return date.toDate().toLocaleString();
    if (typeof date === 'string') return new Date(date).toLocaleString();
    return 'Invalid Date';
  };

  return (
    <AdminLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Password Reset Requests</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Worker Requests</CardTitle>
            <CardDescription>
              This is a log of all password reset requests from workers. Manually reset their password in Firebase Authentication, then mark the request as resolved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker Name</TableHead>
                    <TableHead>Worker Email</TableHead>
                    <TableHead>Time of Request</TableHead>
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
                  ) : requests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">No password reset requests found.</TableCell>
                      </TableRow>
                  ) : requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.workerName}</TableCell>
                      <TableCell>{req.workerEmail}</TableCell>
                      <TableCell>{formatDate(req.requestedAt)}</TableCell>
                      <TableCell>
                        <Badge variant={req.status === 'Resolved' ? 'default' : 'destructive'}
                         className={req.status === 'Resolved' ? 'bg-green-600' : ''}>
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {req.status === 'Pending' && (
                            <Button variant="outline" size="sm" onClick={() => handleResolve(req.id)}>
                                <CheckCircle className="mr-2"/> Mark as Resolved
                            </Button>
                        )}
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

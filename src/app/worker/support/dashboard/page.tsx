
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, Timestamp, orderBy } from "firebase/firestore";
import type { SupportTicket } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WorkerSupportDashboard() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "supportTickets"), orderBy("submittedAt", "desc"));
      const querySnapshot = await getDocs(q);
      const allTickets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket));
      setTickets(allTickets);
    } catch (error) {
      console.error("Error fetching tickets: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    if (!searchQuery) {
      return tickets;
    }
    return tickets.filter(ticket =>
      ticket.userNic?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, tickets]);

  const formatDate = (date: Timestamp | Date | undefined) => {
    if (!date) return 'N/A';
    if (date instanceof Timestamp) return date.toDate().toLocaleString();
    if (date instanceof Date) return date.toLocaleString();
    return 'Invalid Date';
  };

  return (
    <AdminLayout workerMode>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Citizen Support Dashboard</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Ticket Queue ({filteredTickets.length})</CardTitle>
            <CardDescription>All support tickets from citizens. Search by NIC to find specific tickets.</CardDescription>
            <div className="relative pt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by citizen NIC..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Citizen Name</TableHead>
                    <TableHead>Citizen NIC</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredTickets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">No tickets found for the current filter.</TableCell>
                      </TableRow>
                  ) : filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.name}</TableCell>
                      <TableCell>{ticket.userNic}</TableCell>
                      <TableCell className="truncate max-w-sm">{ticket.subject}</TableCell>
                      <TableCell>{formatDate(ticket.submittedAt)}</TableCell>
                      <TableCell>
                        <Badge variant={ticket.status === 'Open' ? 'destructive' : ticket.status === 'Closed' ? 'default' : 'secondary'}
                         className={ticket.status === 'Closed' ? 'bg-green-600' : ''}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/worker/support/tickets/${ticket.id}`}>
                            Open Ticket <ArrowRight className="ml-2 h-4 w-4" />
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

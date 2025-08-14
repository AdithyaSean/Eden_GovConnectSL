
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp, doc, updateDoc } from "firebase/firestore";
import type { SupportTicket } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

export default function WorkerSupportDashboard() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const { toast } = useToast();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "supportTickets"), where("status", "in", ["Open", "In Progress"]));
      const querySnapshot = await getDocs(q);
      const ticketData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket))
        .sort((a,b) => (a.submittedAt as Timestamp).toMillis() - (b.submittedAt as Timestamp).toMillis()); // Oldest first
      setTickets(ticketData);
    } catch (error) {
      console.error("Error fetching tickets: ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleReplySubmit = async (status: 'In Progress' | 'Closed') => {
    if (!activeTicket || !replyMessage) return;

    const ticketRef = doc(db, "supportTickets", activeTicket.id);
    const newReply = `${activeTicket.reply}\n\n[Support Reply on ${new Date().toLocaleString()}]:\n${replyMessage}`;

    try {
      await updateDoc(ticketRef, {
        reply: newReply,
        status: status
      });
      toast({ title: "Reply Sent", description: `Ticket has been marked as ${status}.`});
      setReplyMessage("");
      setActiveTicket(null);
      fetchTickets(); // Refresh list
    } catch (e) {
      console.error("Error sending reply: ", e);
      toast({ title: "Error", description: "Could not send reply.", variant: "destructive"});
    }
  }

  const formatDate = (date: Timestamp | string) => {
    if (!date) return 'N/A';
    if (typeof date === 'string') return date;
    return date.toDate().toLocaleString();
  };

  return (
    <AdminLayout workerMode>
      <div className="flex-1 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Citizen Support Center</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle>Ticket Queue</CardTitle>
                    <CardDescription>Open tickets from citizens.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible>
                    {loading ? <Skeleton className="h-20" /> :
                     tickets.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No open tickets.</p> :
                     tickets.map(ticket => (
                        <AccordionItem value={ticket.id} key={ticket.id}>
                            <AccordionTrigger onClick={() => setActiveTicket(ticket)}>{ticket.subject}</AccordionTrigger>
                            <AccordionContent className="text-sm">
                                <p><strong>From:</strong> {ticket.name}</p>
                                <p><strong>Date:</strong> {formatDate(ticket.submittedAt)}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                </CardContent>
            </Card>

            <div className="md:col-span-2">
                {activeTicket ? (
                     <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>Conversation Details</CardTitle>
                                    <CardDescription>Ticket ID: {activeTicket.id}</CardDescription>
                                </div>
                                 <Badge variant={activeTicket.status === 'Open' ? 'destructive' : 'secondary'}>{activeTicket.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                           <div>
                            <Label className="font-semibold">Message History</Label>
                            <div className="mt-2 p-4 bg-muted rounded-md max-h-60 overflow-y-auto text-sm whitespace-pre-wrap">
                                {activeTicket.message}
                            </div>
                           </div>
                           {activeTicket.reply && (
                                <div>
                                <Label className="font-semibold">Your Reply History</Label>
                                <div className="mt-2 p-4 bg-primary/10 rounded-md max-h-60 overflow-y-auto text-sm whitespace-pre-wrap">
                                    {activeTicket.reply}
                                </div>
                               </div>
                           )}
                           <div>
                            <Label htmlFor="reply" className="font-semibold">Your Reply</Label>
                            <Textarea 
                                id="reply"
                                className="mt-2" 
                                placeholder="Type your response to the citizen here..." 
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                            />
                           </div>
                           <div className="flex justify-end gap-2">
                               <Button variant="outline" onClick={() => handleReplySubmit('In Progress')}>Send & Keep Open</Button>
                               <Button onClick={() => handleReplySubmit('Closed')}>Send & Close Ticket</Button>
                           </div>
                        </CardContent>
                     </Card>
                ) : (
                    <div className="flex items-center justify-center h-full min-h-[400px] bg-muted rounded-lg">
                        <p className="text-muted-foreground">Select a ticket to view details</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}

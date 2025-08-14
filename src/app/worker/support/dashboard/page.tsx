
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp, doc, updateDoc, orderBy } from "firebase/firestore";
import type { SupportTicket } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";


export default function WorkerSupportDashboard() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const { toast } = useToast();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "supportTickets"), where("status", "in", ["Open", "In Progress"]), orderBy("submittedAt", "asc"));
      const querySnapshot = await getDocs(q);
      const ticketData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket));
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

  useEffect(() => {
    if(activeTicket) {
      const updatedTicket = tickets.find(t => t.id === activeTicket.id);
      if(updatedTicket) {
        setActiveTicket(updatedTicket);
      }
    }
  }, [tickets, activeTicket]);


  const handleReplySubmit = async (status: 'In Progress' | 'Closed') => {
    if (!activeTicket || !replyMessage) return;

    const ticketRef = doc(db, "supportTickets", activeTicket.id);
    const newReply = `${activeTicket.reply || ''}\n\n[Support Reply on ${new Date().toLocaleString()}]:\n${replyMessage}`;

    try {
      await updateDoc(ticketRef, {
        reply: newReply,
        status: status
      });
      toast({ title: "Reply Sent", description: `Ticket has been marked as ${status}.`});
      setReplyMessage("");
      if (status === 'Closed') {
          setActiveTicket(null);
      }
      fetchTickets();
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Ticket Queue ({tickets.length})</CardTitle>
                    <CardDescription>Open tickets from citizens.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 p-2">
                    {loading ? <Skeleton className="h-20" /> :
                     tickets.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No open tickets.</p> :
                     tickets.map(ticket => (
                        <button 
                            key={ticket.id} 
                            onClick={() => setActiveTicket(ticket)} 
                            className={cn(
                                "block w-full text-left p-3 rounded-lg hover:bg-muted",
                                activeTicket?.id === ticket.id && "bg-muted"
                            )}
                        >
                            <div className="flex justify-between items-start">
                                <p className="font-semibold truncate">{ticket.subject}</p>
                                <Badge variant={ticket.status === 'Open' ? 'destructive' : 'secondary'}>{ticket.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                From: {ticket.name}
                            </p>
                        </button>
                    ))}
                </CardContent>
            </Card>

            <div className="lg:col-span-2">
                {activeTicket ? (
                     <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">{activeTicket.subject}</CardTitle>
                                    <CardDescription>From: {activeTicket.name} ({activeTicket.email})</CardDescription>
                                </div>
                                 <Badge variant={activeTicket.status === 'Open' ? 'destructive' : 'secondary'}>{activeTicket.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                           <div>
                            <Label className="font-semibold">Conversation History</Label>
                            <div className="mt-2 p-4 bg-muted rounded-md max-h-60 overflow-y-auto text-sm space-y-4 whitespace-pre-wrap">
                                 <div>
                                     <Label className="font-semibold">Citizen's Message History:</Label>
                                     <p className="text-sm text-muted-foreground">{activeTicket.message}</p>
                                   </div>
                                   {activeTicket.reply && (
                                     <div>
                                         <Label className="font-semibold">Your Reply History:</Label>
                                         <p className="text-sm text-muted-foreground bg-primary/10 p-3 rounded-md">{activeTicket.reply}</p>
                                     </div>
                                   )}
                            </div>
                           </div>
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
                        <p className="text-muted-foreground">Select a ticket from the queue to view details</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}

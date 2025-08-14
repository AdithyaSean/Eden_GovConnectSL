
"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp, doc, updateDoc, orderBy, addDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import type { SupportTicket, SupportMessage } from "@/lib/types";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "supportTickets"));
      const querySnapshot = await getDocs(q);
      const allTickets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket));
      
      const filteredAndSortedTickets = allTickets
        .filter(t => t.status !== 'Closed')
        .sort((a, b) => (b.submittedAt as Timestamp).toMillis() - (a.submittedAt as Timestamp).toMillis());

      setTickets(filteredAndSortedTickets);
    } catch (error) {
      console.error("Error fetching tickets: ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  const createNotification = async (userId: string, title: string, description: string, href: string) => {
    try {
        await addDoc(collection(db, "notifications"), {
            userId,
            title,
            description,
            href,
            icon: "MessageSquare",
            read: false,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error creating notification:", error);
    }
  }


  const handleReplySubmit = async (status: 'In Progress' | 'Closed') => {
    if (!activeTicket || !replyMessage) return;

    setIsSubmitting(true);
    const ticketRef = doc(db, "supportTickets", activeTicket.id);
    const newMessage: SupportMessage = {
        content: replyMessage,
        author: "Support",
        timestamp: Timestamp.now()
    };

    try {
      await updateDoc(ticketRef, {
        messages: arrayUnion(newMessage),
        status: status
      });

      if (activeTicket.userId) {
          await createNotification(
              activeTicket.userId,
              `Reply for ticket: ${activeTicket.subject.substring(0, 20)}...`,
              `A support agent has replied to your ticket.`,
              `/support`
          );
      }

      toast({ title: "Reply Sent", description: `Ticket has been marked as ${status}.`});
      setReplyMessage("");
      
      // Optimistically update UI
      const updatedTicket = {
          ...activeTicket,
          messages: [...(activeTicket.messages || []), newMessage],
          status
      };
      
      if (status === 'Closed') {
          setActiveTicket(null);
          setTickets(prev => prev.filter(t => t.id !== activeTicket.id));
      } else {
          setActiveTicket(updatedTicket);
          setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
      }
      
    } catch (e) {
      console.error("Error sending reply: ", e);
      toast({ title: "Error", description: "Could not send reply.", variant: "destructive"});
    } finally {
        setIsSubmitting(false);
    }
  }

  const formatDate = (date: Timestamp | Date | undefined) => {
    if (!date) return 'N/A';
    if (date instanceof Timestamp) return date.toDate().toLocaleString();
    if (date instanceof Date) return date.toLocaleString();
    return 'Invalid Date';
  };

  return (
    <AdminLayout workerMode>
      <div className="flex-1 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Citizen Support Dashboard</h1>
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

            <div className="lg:col-span-2 space-y-8">
                {activeTicket ? (
                     <>
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
                            <CardContent>
                                <div className="mt-2 p-4 bg-muted rounded-md max-h-80 overflow-y-auto text-sm space-y-4">
                                    {(activeTicket.messages || []).map((msg, index) => (
                                        <div key={index} className={cn("p-3 rounded-lg", msg.author === 'Citizen' ? 'bg-primary/10' : 'bg-secondary')}>
                                            <p className="font-semibold">{msg.author} <span className="text-xs text-muted-foreground ml-2">{formatDate(msg.timestamp)}</span></p>
                                            <p className="text-sm text-foreground whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle>Reply to Citizen</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Label htmlFor="reply" className="sr-only">Your Reply</Label>
                                <Textarea 
                                    id="reply"
                                    className="mt-2" 
                                    placeholder="Type your response to the citizen here..." 
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    disabled={isSubmitting}
                                    rows={5}
                                />
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => handleReplySubmit('In Progress')} disabled={isSubmitting || !replyMessage.trim()}>
                                   {isSubmitting ? "Sending..." : "Send & Keep Open"}
                                </Button>
                               <Button onClick={() => handleReplySubmit('Closed')} disabled={isSubmitting || !replyMessage.trim()}>
                                   {isSubmitting ? "Sending..." : "Send & Close Ticket"}
                                </Button>
                            </CardFooter>
                         </Card>
                     </>
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
    

    

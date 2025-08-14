
"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FormEvent, useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp, query, where, getDocs, Timestamp, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { SupportTicket, SupportMessage } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";


export default function SupportPage() {
    const { toast } = useToast();
    const { user, loading: authLoading } = useAuth();
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loadingTickets, setLoadingTickets] = useState(true);
    const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
    const [userReply, setUserReply] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTickets = async () => {
        if (!user) {
            setLoadingTickets(false);
            return;
        };

        setLoadingTickets(true);
        try {
            const q = query(collection(db, "supportTickets"), where("userId", "==", user.id));
            const querySnapshot = await getDocs(q);
            const userTickets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket))
                .sort((a, b) => (b.submittedAt as Timestamp).toMillis() - (a.submittedAt as Timestamp).toMillis());
            setTickets(userTickets);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        } finally {
            setLoadingTickets(false);
        }
    }
    
    useEffect(() => {
        if(!authLoading && user){
            fetchTickets();
        }
    }, [user, authLoading]);

    const handleUserReply = async () => {
        if (!userReply.trim() || !activeTicket) return;
        
        setIsSubmitting(true);
        const ticketRef = doc(db, "supportTickets", activeTicket.id);
        const newMessage: SupportMessage = {
            content: userReply,
            author: "Citizen",
            timestamp: Timestamp.now()
        };
        
        try {
            await updateDoc(ticketRef, {
                messages: arrayUnion(newMessage),
                status: "Open" // Re-open the ticket if the user replies
            });
            toast({ title: "Reply Sent" });
            setUserReply("");
            await fetchTickets(); // Refresh data
            // Update active ticket in state
            setActiveTicket(prev => prev ? {
                 ...prev, 
                 messages: [...(prev.messages || []), newMessage], 
                 status: "Open" 
            } : null);

        } catch (error) {
            console.error("Error sending reply:", error);
            toast({ title: "Reply Failed", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleCloseTicket = async () => {
        if (!activeTicket) return;
        const ticketRef = doc(db, "supportTickets", activeTicket.id);
        try {
             await updateDoc(ticketRef, { status: "Closed" });
             toast({ title: "Ticket Closed"});
             await fetchTickets();
             setActiveTicket(prev => prev ? {...prev, status: "Closed"} : null);
        } catch(e){
            toast({ title: "Error", description: "Could not close ticket.", variant: "destructive" });
        }
    }
    
    const handleNewTicketSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return toast({ title: "Please log in.", variant: "destructive"});
        
        const formData = new FormData(e.target as HTMLFormElement);
        const { subject, message } = Object.fromEntries(formData.entries()) as { subject: string, message: string };

        if (!subject.trim() || !message.trim()) {
            return toast({ title: "Please fill out all fields.", variant: "destructive" });
        }
        
        const firstMessage: SupportMessage = {
            content: message,
            author: "Citizen",
            timestamp: Timestamp.now()
        };

        try {
             const newTicketRef = await addDoc(collection(db, "supportTickets"), {
                subject,
                messages: [firstMessage],
                status: 'Open',
                submittedAt: serverTimestamp(),
                userNic: user.nic,
                userId: user.id,
                name: user.name,
                email: user.email,
            });
            toast({ title: "Support Ticket Created", description: "Our team will get back to you shortly."});
            await fetchTickets();
            const newTicket = await getDoc(newTicketRef);
            setActiveTicket({ id: newTicket.id, ...newTicket.data() } as SupportTicket);

        } catch(err){
            toast({ title: "Failed to create ticket", variant: "destructive" });
        }
    }
    
    const formatDate = (date: Timestamp | Date | undefined) => {
        if (!date) return 'N/A';
        if (date instanceof Timestamp) return date.toDate().toLocaleString();
        if (date instanceof Date) return date.toLocaleString();
        return 'Invalid Date';
    };

  return (
    <DashboardLayout>
      <div className="flex-1 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Citizen Support Center</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>My Tickets</CardTitle>
                    <CardDescription>Select a ticket to view the conversation.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 p-2">
                   {loadingTickets ? (
                     <Skeleton className="h-20 w-full" />
                   ) : tickets.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">You have not submitted any support tickets yet.</p>
                   ) : (
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
                                    <Badge variant={ticket.status === 'Open' ? 'destructive' : ticket.status === 'Closed' ? 'default' : 'secondary'}  
                                    className={cn("text-xs", ticket.status === 'Closed' ? 'bg-green-600' : '')}
                                    >
                                        {ticket.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Last update: {formatDate(ticket.messages?.[ticket.messages.length - 1]?.timestamp)}
                                </p>
                            </button>
                        ))
                   )}
                </CardContent>
            </Card>

            <div className="lg:col-span-2">
                 {activeTicket ? (
                     <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">{activeTicket.subject}</CardTitle>
                                    <CardDescription>Ticket ID: {activeTicket.id}</CardDescription>
                                </div>
                                <Badge variant={activeTicket.status === 'Open' ? 'destructive' : activeTicket.status === 'Closed' ? 'default' : 'secondary'}  
                                    className={cn("text-base", activeTicket.status === 'Closed' ? 'bg-green-600' : '')}>
                                    {activeTicket.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                           <div>
                                <h3 className="font-semibold mb-2">Conversation History</h3>
                                <div className="mt-2 p-4 bg-muted rounded-md max-h-80 overflow-y-auto text-sm space-y-4">
                                   {(activeTicket.messages || []).map((msg, index) => (
                                       <div key={index} className={cn("p-3 rounded-lg", msg.author === 'Citizen' ? 'bg-primary/10' : 'bg-secondary')}>
                                           <p className="font-semibold">{msg.author} <span className="text-xs text-muted-foreground ml-2">{formatDate(msg.timestamp)}</span></p>
                                           <p className="text-sm text-foreground whitespace-pre-wrap">{msg.content}</p>
                                       </div>
                                   ))}
                                </div>
                           </div>
                           {activeTicket.status !== 'Closed' && (
                                <div className="pt-4 border-t">
                                    <Label htmlFor="user-reply" className="font-semibold">Send a Reply</Label>
                                    <Textarea 
                                        id="user-reply"
                                        className="mt-2"
                                        placeholder="Type your reply here..."
                                        value={userReply}
                                        onChange={(e) => setUserReply(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <Button onClick={handleUserReply} disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send Reply"}</Button>
                                        <Button variant="link" onClick={handleCloseTicket}>My issue is resolved, close this ticket.</Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                     </Card>
                ) : (
                    <form onSubmit={handleNewTicketSubmit}>
                         <Card>
                             <CardHeader>
                                <CardTitle>Create a New Support Ticket</CardTitle>
                                <CardDescription>Can't find your issue? Submit a new ticket and our team will assist you.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" name="subject" placeholder="e.g., Passport photo upload failed" />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" name="message" placeholder="Please describe your issue in detail." />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit">Create Ticket</Button>
                            </CardFooter>
                         </Card>
                    </form>
                )}
            </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

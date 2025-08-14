
"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FormEvent, useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp, query, where, getDocs, Timestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { SupportTicket } from "@/lib/types";
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

    const handleUserReply = async () => {
        if (!userReply.trim() || !activeTicket) return;
        
        const ticketRef = doc(db, "supportTickets", activeTicket.id);
        
        try {
            const newMessage = `${activeTicket.message}\n\n[User Reply on ${new Date().toLocaleString()}]:\n${userReply}`;
            await updateDoc(ticketRef, {
                message: newMessage,
                status: "Open"
            });
            toast({ title: "Reply Sent" });
            setUserReply("");
            await fetchTickets();
            setActiveTicket(prev => prev ? {...prev, message: newMessage, status: "Open"} : null);

        } catch (error) {
            console.error("Error sending reply:", error);
            toast({ title: "Reply Failed", variant: "destructive" });
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
    
    useEffect(() => {
        if(!authLoading && user){
            fetchTickets();
        }
    }, [user, authLoading]);

    const formatDate = (date: Timestamp | string) => {
        if (!date) return 'N/A';
        if (typeof date === 'string') return date;
        return date.toDate().toLocaleString();
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
                                    Last update: {formatDate(ticket.submittedAt)}
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
                                <div className="mt-2 p-4 bg-muted rounded-md max-h-60 overflow-y-auto text-sm space-y-4">
                                   <div>
                                     <Label className="font-semibold">Your Message History:</Label>
                                     <p className="text-sm text-muted-foreground whitespace-pre-wrap">{activeTicket.message}</p>
                                   </div>
                                   {activeTicket.reply && (
                                     <div>
                                         <Label className="font-semibold">Support Reply History:</Label>
                                         <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-primary/10 p-3 rounded-md">{activeTicket.reply}</p>
                                     </div>
                                   )}
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
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <Button onClick={handleUserReply}>Send Reply</Button>
                                        <Button variant="link" onClick={handleCloseTicket}>My issue is resolved, close this ticket.</Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                     </Card>
                ) : (
                    <div className="flex items-center justify-center h-full min-h-[400px] bg-muted rounded-lg">
                        <p className="text-muted-foreground">Select a ticket to view details or create a new one.</p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

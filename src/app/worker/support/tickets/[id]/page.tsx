
"use client";

import { use, useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc, updateDoc, Timestamp, arrayUnion, serverTimestamp } from "firebase/firestore";
import type { SupportTicket, SupportMessage } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { sendEmail } from "@/lib/email";


export default function SupportTicketPage({ params }: { params: { id: string } }) {
  const { id } = use(params);
  const router = useRouter();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const ticketDoc = await getDoc(doc(db, "supportTickets", id));
      if(ticketDoc.exists()) {
          setTicket({ id: ticketDoc.id, ...doc.data() } as SupportTicket);
      } else {
          notFound();
      }
    } catch (error) {
      console.error("Error fetching ticket: ", error);
      notFound();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(id) {
        fetchTicket();
    }
  }, [id]);

  const createNotification = async (userId: string, title: string, description: string, href: string, recipientEmail?: string) => {
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

        if (recipientEmail) {
             await sendEmail({
                to: recipientEmail,
                subject: `[GovConnect SL] ${title}`,
                html: `<p>${description}</p><p>You can view the full conversation by logging into your account.</p>`
            });
        }

    } catch (error) {
        console.error("Error creating notification:", error);
    }
  }

  const handleReplySubmit = async (status: 'In Progress' | 'Closed') => {
    if (!ticket || !replyMessage) return;

    setIsSubmitting(true);
    const ticketRef = doc(db, "supportTickets", ticket.id);
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

      if (ticket.userId) {
          const description = `A support agent has replied to your ticket.`;
          await createNotification(
              ticket.userId,
              `Reply for ticket: ${ticket.subject.substring(0, 20)}...`,
              description,
              `/support`,
              ticket.email
          );
      }

      toast({ title: "Reply Sent", description: `Ticket has been marked as ${status}.`});
      setReplyMessage("");
      
      if (status === 'Closed') {
          router.push("/worker/support/dashboard");
      } else {
          // Refetch to show the new message
          fetchTicket();
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
  
  if (loading) {
      return (
          <AdminLayout workerMode>
              <div className="flex-1 p-8 pt-6 space-y-6">
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
          </AdminLayout>
      )
  }

  if (!ticket) {
      return notFound();
  }

  return (
    <AdminLayout workerMode>
      <div className="flex-1 p-4 md:p-8 pt-6 space-y-6">
        <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
                <Link href="/worker/support/dashboard"><ArrowLeft/></Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Support Ticket Details</h1>
        </div>
        
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl">{ticket.subject}</CardTitle>
                        <CardDescription>
                            From: {ticket.name} ({ticket.email}) | NIC: {ticket.userNic} | Ticket ID: {ticket.id}
                        </CardDescription>
                    </div>
                    <Badge variant={ticket.status === 'Open' ? 'destructive' : ticket.status === 'Closed' ? 'default' : 'secondary'}
                        className={cn("text-base", ticket.status === 'Closed' ? 'bg-green-600' : '')}>
                        {ticket.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mt-2 p-4 bg-muted rounded-md max-h-80 overflow-y-auto text-sm space-y-4">
                    {(ticket.messages || []).map((msg, index) => (
                        <div key={index} className={cn("p-3 rounded-lg", msg.author === 'Citizen' ? 'bg-primary/10' : 'bg-secondary')}>
                            <p className="font-semibold">{msg.author} <span className="text-xs text-muted-foreground ml-2">{formatDate(msg.timestamp)}</span></p>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
        
        {ticket.status !== 'Closed' && (
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
        )}

      </div>
    </AdminLayout>
  );
}

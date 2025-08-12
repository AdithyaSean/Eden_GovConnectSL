
"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, Timestamp, doc, updateDoc } from "firebase/firestore";
import type { Application } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, Star, MessageSquare } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@/components/rating";


export default function AppointmentsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchApplications = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const q = query(collection(db, "applications"), where("userId", "==", user.id));
    
    try {
      const querySnapshot = await getDocs(q);
      const apps = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Application))
        .filter(app => app.details?.appointmentDate); // Only get apps with appointments
      setApplications(apps);
    } catch (error) {
      console.error("Error fetching applications: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const handleCancelAppointment = async (appId: string) => {
    try {
      const appRef = doc(db, "applications", appId);
      await updateDoc(appRef, { status: 'Rejected', workerComment: 'Appointment cancelled by citizen.' });
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been successfully cancelled.",
      });
      fetchApplications(); // Refresh list
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        title: "Cancellation Failed",
        description: "Could not cancel the appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      toast({ title: "Please select a rating.", variant: "destructive" });
      return;
    }
    if (!selectedApp) return;

    setIsSubmitting(true);
    try {
      const appRef = doc(db, "applications", selectedApp.id);
      await updateDoc(appRef, {
        appointmentRating: rating,
        appointmentFeedback: feedback,
      });
      toast({
        title: "Feedback Submitted",
        description: "Thank you for rating your appointment!",
      });
      setSelectedApp(null);
      setRating(0);
      setFeedback("");
      fetchApplications(); // Refresh list
    } catch (error) {
      toast({ title: "Submission Failed", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (date: Timestamp | string | undefined) => {
    if (!date) return 'N/A';
    if (date instanceof Timestamp) return date.toDate().toLocaleString();
    if (typeof date === 'string') return new Date(date).toLocaleString();
    return 'Invalid Date';
  };

  const upcomingAppointments = applications.filter(app => app.details.appointmentDate && (app.details.appointmentDate as Timestamp).toDate() > new Date());
  const pastAppointments = applications.filter(app => app.details.appointmentDate && (app.details.appointmentDate as Timestamp).toDate() <= new Date());

  return (
    <>
      <DashboardLayout>
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled appointments for government services.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? <TableRow><TableCell colSpan={4}><Skeleton className="h-8" /></TableCell></TableRow>
                   : upcomingAppointments.length === 0 ? <TableRow><TableCell colSpan={4} className="h-24 text-center">No upcoming appointments.</TableCell></TableRow>
                   : upcomingAppointments.map(app => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.service}</TableCell>
                        <TableCell>{formatDate(app.details.appointmentDate)}</TableCell>
                        <TableCell><Badge variant="secondary">{app.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm" onClick={() => handleCancelAppointment(app.id)}>Cancel</Button>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Past Appointments</CardTitle>
              <CardDescription>Review your past appointments and provide feedback.</CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? <TableRow><TableCell colSpan={4}><Skeleton className="h-8" /></TableCell></TableRow>
                   : pastAppointments.length === 0 ? <TableRow><TableCell colSpan={4} className="h-24 text-center">No past appointments.</TableCell></TableRow>
                   : pastAppointments.map(app => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.service}</TableCell>
                        <TableCell>{formatDate(app.details.appointmentDate)}</TableCell>
                        <TableCell>
                            <Badge className={app.status === 'Completed' || app.status === 'Approved' ? 'bg-green-600' : ''}>
                                {app.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {app.appointmentRating ? (
                            <Rating rating={app.appointmentRating} />
                          ) : (
                             <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>Rate Now</Button>
                          )}
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
      <Dialog open={!!selectedApp} onOpenChange={(isOpen) => !isOpen && setSelectedApp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Appointment</DialogTitle>
            <DialogDescription>
              Your feedback helps us improve our services.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`h-8 w-8 cursor-pointer ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="feedback">Feedback (Optional)</Label>
                <Textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Tell us about your experience..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedApp(null)}>Cancel</Button>
            <Button onClick={handleRatingSubmit} disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Feedback"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Clock, AlertTriangle, FileCheck2, Hourglass } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Application } from "@/lib/types";

const processingTimeData = [
    { month: "Jan", time: 7.2 },
    { month: "Feb", time: 6.8 },
    { month: "Mar", time: 8.1 },
    { month: "Apr", time: 7.5 },
    { month: "May", time: 6.2 },
    { month: "Jun", time: 5.9 },
]


export default function AdminAnalyticsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            const querySnapshot = await getDocs(collection(db, "applications"));
            const appsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
            setApplications(appsData);
            setLoading(false);
        }
        fetchApps();
    }, []);

    const analyticsData = useMemo(() => {
        if (applications.length === 0) {
            return {
                docReadiness: 0,
                peakHour: "N/A",
                peakHoursData: Array.from({ length: 24 }, (_, i) => ({
                  hour: `${i.toString().padStart(2, '0')}:00`,
                  applications: 0,
                })),
            };
        }

        // Doc Readiness
        const readyDocsCount = applications.filter(app => app.documents && Object.keys(app.documents).length > 0).length;
        const docReadiness = Math.round((readyDocsCount / applications.length) * 100);

        // Peak Hours in SLST (UTC+5:30)
        const submissionsByHour: { [key: number]: number } = {};
        for(let i=0; i<24; i++) { submissionsByHour[i] = 0; }

        applications.forEach(app => {
            if (app.submitted && typeof app.submitted !== 'string') {
                const date = (app.submitted as Timestamp).toDate();
                // Convert to SLST by adding 5 hours and 30 minutes
                const slstOffset = 5.5 * 60 * 60 * 1000;
                const slstDate = new Date(date.getTime() + slstOffset);
                const hour = slstDate.getUTCHours();
                submissionsByHour[hour]++;
            }
        });
        
        let peakHour = 0;
        let maxSubmissions = 0;
        for (const hour in submissionsByHour) {
            if (submissionsByHour[hour] > maxSubmissions) {
                maxSubmissions = submissionsByHour[hour];
                peakHour = parseInt(hour, 10);
            }
        }

        const peakHoursData = Object.entries(submissionsByHour).map(([hour, count]) => ({
            hour: `${hour.toString().padStart(2, '0')}:00`,
            applications: count
        }));
        
        const formatPeakHour = (hour: number) => {
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const h = hour % 12 || 12; // convert 0 to 12
            return `${h} ${ampm} (SLST)`;
        }

        return {
            docReadiness,
            peakHour: formatPeakHour(peakHour),
            peakHoursData,
        }

    }, [applications]);

  return (
    <AdminLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">System Analytics</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
                    <Hourglass className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">6.8 Days</div>
                    <p className="text-xs text-muted-foreground">From submission to completion</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Appointment No-Show Rate</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12%</div>
                    <p className="text-xs text-muted-foreground">For biometrics & in-person visits</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Document Readiness</CardTitle>
                    <FileCheck2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.docReadiness}%</div>
                    <p className="text-xs text-muted-foreground">Applications with all docs on first submission</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.peakHour}</div>
                    <p className="text-xs text-muted-foreground">Highest application traffic</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
             <Card>
                <CardHeader>
                    <CardTitle>Application Submissions by Hour</CardTitle>
                    <CardDescription>This chart shows the peak hours for user activity based on all submissions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData.peakHoursData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
                            <Tooltip />
                            <Bar dataKey="applications" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Processing Time Trend</CardTitle>
                    <CardDescription>Average days to process an application over time.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={processingTimeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="time" stroke="hsl(var(--primary))" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Document Readiness Status</CardTitle>
                <CardDescription>Overview of document completion for recent applications.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Application ID</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Documents Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.slice(0,5).map(app => (
                            <TableRow key={app.id}>
                                <TableCell className="font-medium truncate max-w-28">{app.id}</TableCell>
                                <TableCell>{app.service}</TableCell>
                                <TableCell>{app.user}</TableCell>
                                <TableCell>
                                    <Badge variant={app.documents && Object.keys(app.documents).length > 0 ? "default" : "destructive"}
                                        className={app.documents && Object.keys(app.documents).length > 0 ? "bg-green-600" : ""}
                                    >
                                        {app.documents && Object.keys(app.documents).length > 0 ? "Complete" : "Incomplete"}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

      </div>
    </AdminLayout>
  );
}

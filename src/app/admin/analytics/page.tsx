
"use client";

import { AdminLayout } from "@/components/admin-layout";
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
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Clock, Hourglass, Star, UserX } from "lucide-react";
import { useAnalytics } from "@/hooks/use-analytics";
import { Rating } from "@/components/rating";
import { StatCard } from "@/components/stat-card";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-background border rounded-md shadow-lg">
                <p className="label font-bold">{`${label}`}</p>
                <p className="intro text-sm">{`${payload[0].name} : ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};


export default function AdminAnalyticsPage() {
    const { analyticsData, loading } = useAnalytics();

  return (
    <AdminLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">System Analytics</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Avg. Processing Time"
                value={`${analyticsData.avgProcessingTime} Days`}
                description="From submission to completion"
                icon={Hourglass}
                gradient="bg-gradient-to-br from-purple-500 to-violet-600"
                loading={loading}
            />
             <StatCard
                title="Avg. Appointment Rating"
                value={`${analyticsData.avgAppointmentRating.toFixed(1)} / 5`}
                description="Based on citizen feedback"
                icon={Star}
                gradient="bg-gradient-to-br from-yellow-400 to-orange-500"
                loading={loading}
            />
            <StatCard
                title="Appointment No-Show Rate"
                value={`${analyticsData.noShowRate}%`}
                description="Users who missed appointments"
                icon={UserX}
                gradient="bg-gradient-to-br from-red-500 to-rose-600"
                loading={loading}
            />
            <StatCard
                title="Peak Hour"
                value={analyticsData.peakHour}
                description="Highest application traffic"
                icon={Clock}
                gradient="bg-gradient-to-br from-sky-500 to-cyan-500"
                loading={loading}
            />
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
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="applications" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Applications"/>
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
                        <LineChart data={analyticsData.processingTimeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="time" stroke="hsl(var(--primary))" strokeWidth={2} name="Avg Days"/>
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Recent Appointment Feedback</CardTitle>
                <CardDescription>Latest ratings and comments submitted by citizens for their appointments.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Feedback</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {analyticsData.recentFeedback.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">No feedback submitted yet.</TableCell>
                            </TableRow>
                        ) : analyticsData.recentFeedback.map(app => (
                            <TableRow key={app.id}>
                                <TableCell className="font-medium">{app.service}</TableCell>
                                <TableCell>{app.user}</TableCell>
                                <TableCell>
                                    <Rating rating={app.appointmentRating || 0} />
                                </TableCell>
                                <TableCell className="text-muted-foreground">{app.appointmentFeedback}</TableCell>
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

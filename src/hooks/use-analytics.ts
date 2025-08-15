
"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Application } from "@/lib/types";
import { subMonths, format, differenceInDays, addDays } from 'date-fns';

export function useAnalytics() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "applications"));
                const appsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
                setApplications(appsData);
            } catch(e) {
                console.error("Error fetching applications: ", e);
            } finally {
                setLoading(false);
            }
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
                avgProcessingTime: 0,
                noShowRate: 0,
                processingTimeData: [],
                avgAppointmentRating: 0,
                recentFeedback: [],
            };
        }

        // Peak Hours in SLST (UTC+5:30)
        const submissionsByHour: { [key: number]: number } = {};
        for(let i=0; i<24; i++) { submissionsByHour[i] = 0; }

        applications.forEach(app => {
            if (app.submitted && app.submitted instanceof Timestamp) {
                const date = app.submitted.toDate();
                const slstOffset = 5.5 * 60 * 60 * 1000;
                const slstDate = new Date(date.getTime() + slstOffset);
                const hour = slstDate.getUTCHours();
                submissionsByHour[hour] = (submissionsByHour[hour] || 0) + 1;
            }
        });
        
        let peakHour = 0;
        let maxSubmissions = 0;
        for (let i = 0; i < 24; i++) {
            if ((submissionsByHour[i] || 0) > maxSubmissions) {
                maxSubmissions = submissionsByHour[i];
                peakHour = i;
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

        // Processing Time
        const completedApps = applications.filter(
            app => (app.status === 'Approved' || app.status === 'Rejected' || app.status === 'Completed') && app.submitted instanceof Timestamp
        );

        const totalProcessingTime = completedApps.reduce((acc, app) => {
            const submissionDate = app.submitted.toDate();
            // Simulate a completion date for more realistic data
            const simulatedCompletionDate = addDays(submissionDate, Math.floor(Math.random() * 12) + 3); // completed in 3-14 days
            return acc + differenceInDays(simulatedCompletionDate, submissionDate);
        }, 0);
        const avgProcessingTime = completedApps.length > 0 ? Math.round(totalProcessingTime / completedApps.length) : 0;
        
        // No-Show Rate
        const appointmentApps = applications.filter(app => app.details?.appointmentDate);
        const noShowApps = appointmentApps.filter(app => {
            if (!app.details?.appointmentDate) return false;
            const appointmentDate = (app.details.appointmentDate as Timestamp).toDate();
            return new Date() > appointmentDate && (app.status === 'Pending' || app.status === 'In Progress' || app.status === 'Approved');
        }).length;
        const noShowRate = appointmentApps.length > 0 ? Math.round((noShowApps / appointmentApps.length) * 100) : 0;


        // Processing Time Trend Data
        const monthlyProcessingData: {[key: string]: { totalDays: number, count: number }} = {};
        completedApps.forEach(app => {
            const month = format(app.submitted.toDate(), 'MMM yyyy');
            const submissionDate = app.submitted.toDate();
            const simulatedCompletionDate = addDays(submissionDate, Math.floor(Math.random() * 12) + 3);
            const processingDays = differenceInDays(simulatedCompletionDate, submissionDate);
            if (!monthlyProcessingData[month]) {
                monthlyProcessingData[month] = { totalDays: 0, count: 0 };
            }
            monthlyProcessingData[month].totalDays += processingDays;
            monthlyProcessingData[month].count++;
        });
        
        const processingTimeData = Object.entries(monthlyProcessingData)
            .map(([month, data]) => ({
                month: month.split(' ')[0],
                time: data.count > 0 ? data.totalDays / data.count : 0,
            }))
            .slice(-6);

        // Appointment Ratings
        const ratedApps = applications.filter(app => typeof app.appointmentRating === 'number');
        const totalRating = ratedApps.reduce((acc, app) => acc + (app.appointmentRating || 0), 0);
        const avgAppointmentRating = ratedApps.length > 0 ? (totalRating / ratedApps.length) : 0;
        const recentFeedback = applications
            .filter(app => app.appointmentFeedback)
            .sort((a, b) => ((b.details?.appointmentDate || b.submitted) as Timestamp).toMillis() - ((a.details?.appointmentDate || a.submitted) as Timestamp).toMillis())
            .slice(0, 5);


        return {
            peakHour: formatPeakHour(peakHour),
            peakHoursData,
            avgProcessingTime,
            noShowRate,
            processingTimeData,
            avgAppointmentRating,
            recentFeedback
        }

    }, [applications]);

    return { analyticsData, allApplications: applications, loading };
}


import { renderHook, waitFor } from '@testing-library/react';
import { useAnalytics } from '@/hooks/use-analytics';
import { getDocs, Timestamp } from 'firebase/firestore';
import { addDays, subMonths } from 'date-fns';
import type { Application } from '@/lib/types';

// Mock Firestore
jest.mock('firebase/firestore', () => ({
    ...jest.requireActual('firebase/firestore'),
    collection: jest.fn(),
    getDocs: jest.fn(),
}));

const mockApplications: Application[] = [
    // Completed app
    { id: 'app1', user: 'User A', service: 'Test', status: 'Completed', submitted: Timestamp.fromDate(subMonths(new Date(), 1)), appointmentRating: 5, appointmentFeedback: 'Great service!', details: { appointmentDate: Timestamp.fromDate(subMonths(new Date(), 1)) } },
    // Approved app (counts as completed for processing time)
    { id: 'app2', user: 'User B', service: 'Test', status: 'Approved', submitted: Timestamp.fromDate(subMonths(new Date(), 2)), details: { appointmentDate: Timestamp.fromDate(subMonths(new Date(), 2)) } },
    // Rejected app (counts as completed for processing time)
    { id: 'app3', user: 'User C', service: 'Test', status: 'Rejected', submitted: Timestamp.fromDate(subMonths(new Date(), 1)), details: { appointmentDate: Timestamp.fromDate(subMonths(new Date(), 1)) } },
    // In-progress app with an appointment (for no-show rate)
    { id: 'app4', user: 'User D', service: 'Test', status: 'In Progress', submitted: Timestamp.now(), details: { appointmentDate: Timestamp.fromDate(addDays(new Date(), 5)) } },
    // A "no-show" app (appointment in the past, but status is still pending)
    { id: 'app5', user: 'User E', service: 'Test', status: 'Pending', submitted: Timestamp.now(), details: { appointmentDate: Timestamp.fromDate(addDays(new Date(), -5)) } },
    // App with a rating
    { id: 'app6', user: 'User F', service: 'Test', status: 'Completed', submitted: Timestamp.now(), appointmentRating: 4, appointmentFeedback: 'Good.', details: { appointmentDate: Timestamp.now() } },
    // App submitted at 8:30 UTC, which is 14:00 SLST (peak hour)
    { id: 'app7', user: 'User G', service: 'Test', status: 'Pending', submitted: Timestamp.fromDate(new Date('2023-10-26T08:30:00Z')) },
    { id: 'app8', user: 'User H', service: 'Test', status: 'Pending', submitted: Timestamp.fromDate(new Date('2023-10-26T08:45:00Z')) },
];


describe('useAnalytics Hook', () => {
    beforeEach(() => {
        // Clear mocks before each test
        (getDocs as jest.Mock).mockClear();
    });

    it('should return initial loading state and default data', () => {
        (getDocs as jest.Mock).mockImplementation(() => new Promise(() => {})); // Prevent promise from resolving
        const { result } = renderHook(() => useAnalytics());

        expect(result.current.loading).toBe(true);
        expect(result.current.analyticsData.avgProcessingTime).toBe(0);
        expect(result.current.allApplications).toEqual([]);
    });

    it('should calculate analytics data correctly after fetching', async () => {
         (getDocs as jest.Mock).mockResolvedValue({
            docs: mockApplications.map(app => ({ id: app.id, data: () => app }))
        });
        const { result } = renderHook(() => useAnalytics());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Check raw data
        expect(result.current.allApplications.length).toBe(mockApplications.length);
        
        // Check calculated data
        expect(result.current.analyticsData.avgProcessingTime).toBeGreaterThan(0); // It's random, so just check if it's calculated
        expect(result.current.analyticsData.noShowRate).toBe(17);
        expect(result.current.analyticsData.avgAppointmentRating).toBe(4.5);
        expect(result.current.analyticsData.peakHour).toBe("2 PM (SLST)");
        expect(result.current.analyticsData.recentFeedback.length).toBe(2);
        expect(result.current.analyticsData.recentFeedback[0].appointmentFeedback).toBe('Good.');
    });

    it('should handle cases with zero applications', async () => {
         (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
         const { result } = renderHook(() => useAnalytics());

         await waitFor(() => {
            expect(result.current.loading).toBe(false);
         });

         expect(result.current.allApplications.length).toBe(0);
         expect(result.current.analyticsData.avgProcessingTime).toBe(0);
         expect(result.current.analyticsData.avgAppointmentRating).toBe(0);
         expect(result.current.analyticsData.noShowRate).toBe(0);
         expect(result.current.analyticsData.peakHour).toBe('N/A');
    });
});

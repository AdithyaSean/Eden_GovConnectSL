import { renderHook, waitFor } from '@testing-library/react';
import { useAnalytics } from '@/hooks/use-analytics';
import { getDocs, Timestamp } from 'firebase/firestore';
import { addDays, subMonths } from 'date-fns';

// Mock Firestore
jest.mock('firebase/firestore', () => ({
    ...jest.requireActual('firebase/firestore'),
    collection: jest.fn(),
    getDocs: jest.fn(),
}));

const mockApplications = [
    // Completed app
    { id: 'app1', status: 'Completed', submitted: Timestamp.fromDate(subMonths(new Date(), 1)), appointmentRating: 5, appointmentFeedback: 'Great service!', details: { appointmentDate: Timestamp.fromDate(subMonths(new Date(), 1)) } },
    // Approved app (counts as completed for processing time)
    { id: 'app2', status: 'Approved', submitted: Timestamp.fromDate(subMonths(new Date(), 2)), details: { appointmentDate: Timestamp.fromDate(subMonths(new Date(), 2)) } },
    // Rejected app (counts as completed for processing time)
    { id: 'app3', status: 'Rejected', submitted: Timestamp.fromDate(subMonths(new Date(), 1)), details: { appointmentDate: Timestamp.fromDate(subMonths(new Date(), 1)) } },
    // In-progress app with an appointment (for no-show rate)
    { id: 'app4', status: 'In Progress', submitted: Timestamp.now(), details: { appointmentDate: Timestamp.fromDate(addDays(new Date(), 5)) } },
    // A "no-show" app (appointment in the past, but status is still pending)
    { id: 'app5', status: 'Pending', submitted: Timestamp.now(), details: { appointmentDate: Timestamp.fromDate(addDays(new Date(), -5)) } },
    // App with a rating
    { id: 'app6', status: 'Completed', submitted: Timestamp.now(), appointmentRating: 4, appointmentFeedback: 'Good.', details: { appointmentDate: Timestamp.now() } },
    // App submitted at 8:30 UTC, which is 14:00 SLST (peak hour)
    { id: 'app7', status: 'Pending', submitted: Timestamp.fromDate(new Date('2023-10-26T08:30:00Z')) },
    { id: 'app8', status: 'Pending', submitted: Timestamp.fromDate(new Date('2023-10-26T08:45:00Z')) },
];

describe('useAnalytics Hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return initial loading state and default data', () => {
        (getDocs as jest.Mock).mockImplementation(() => new Promise(() => {})); 
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
            expect(result.current.loading).toBe(false)
        });

        expect(result.current.allApplications.length).toBe(mockApplications.length);
        expect(result.current.analyticsData.avgProcessingTime).toBeGreaterThan(0);
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
            expect(result.current.loading).toBe(false)
         });

         expect(result.current.allApplications.length).toBe(0);
         expect(result.current.analyticsData.avgProcessingTime).toBe(0);
         expect(result.current.analyticsData.avgAppointmentRating).toBe(0);
         expect(result.current.analyticsData.noShowRate).toBe(0);
         expect(result.current.analyticsData.peakHour).toBe('N/A');
    });
});

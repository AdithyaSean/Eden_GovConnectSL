import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminAnalyticsPage from '@/app/admin/analytics/page';
import { useAnalytics } from '@/hooks/use-analytics';

// Mock child components
jest.mock('@/components/admin-layout', () => ({
  AdminLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock the hook to provide controlled data
jest.mock('@/hooks/use-analytics');

const mockAnalyticsData = {
    avgProcessingTime: 5,
    avgAppointmentRating: 4.2,
    noShowRate: 12,
    peakHour: "3 PM (SLST)",
    peakHoursData: [{ hour: "15:00", applications: 10 }],
    processingTimeData: [{ month: "Jul", time: 5 }],
    recentFeedback: [{ id: 'fb1', service: 'Passport', user: 'Test User', appointmentRating: 5, appointmentFeedback: 'Excellent!' }],
};

describe('AdminAnalyticsPage', () => {
    beforeEach(() => {
        (useAnalytics as jest.Mock).mockReturnValue({
            analyticsData: mockAnalyticsData,
            allApplications: [],
            loading: false,
        });
    });

    it('renders the main heading', () => {
        render(<AdminAnalyticsPage />);
        expect(screen.getByRole('heading', { name: /system analytics/i })).toBeInTheDocument();
    });

    it('displays the correct stat card values', () => {
        render(<AdminAnalyticsPage />);
        expect(screen.getByText('5 Days')).toBeInTheDocument();
        expect(screen.getByText('4.2')).toBeInTheDocument();
        expect(screen.getByText('12%')).toBeInTheDocument();
        expect(screen.getByText('3 PM (SLST)')).toBeInTheDocument();
    });

    it('renders the recent feedback table with data', () => {
        render(<AdminAnalyticsPage />);
        expect(screen.getByText('Recent Appointment Feedback')).toBeInTheDocument();
        expect(screen.getByText('Passport')).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('Excellent!')).toBeInTheDocument();
    });

    it('shows loading state correctly', () => {
        (useAnalytics as jest.Mock).mockReturnValue({
            analyticsData: { // Provide default structure even when loading
                avgProcessingTime: 0,
                avgAppointmentRating: 0,
                noShowRate: 0,
                peakHour: "N/A",
                peakHoursData: [],
                processingTimeData: [],
                recentFeedback: [],
            },
            allApplications: [],
            loading: true,
        });
        render(<AdminAnalyticsPage />);
        // When loading, the specific stat values shouldn't be present
        expect(screen.queryByText('5 Days')).not.toBeInTheDocument();
        // Check for a placeholder or loading indicator if you have one.
        // For this test, we just confirm the data isn't there.
    });
});


import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminAnalyticsPage from '@/app/admin/analytics/page';
import { useAnalytics } from '@/hooks/use-analytics';

// Mock child components
jest.mock('@/components/admin-layout', () => ({
  AdminLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock the hook to provide controlled data for testing
jest.mock('@/hooks/use-analytics', () => ({
  useAnalytics: jest.fn(),
}));

const useAnalyticsMock = useAnalytics as jest.Mock;

describe('AdminAnalyticsPage', () => {

    it('renders the main heading', () => {
        useAnalyticsMock.mockReturnValue({
            analyticsData: {
                avgProcessingTime: 0, avgAppointmentRating: 0, noShowRate: 0, peakHour: "",
                peakHoursData: [], processingTimeData: [], recentFeedback: [],
            },
            allApplications: [],
            loading: false,
        });
        render(<AdminAnalyticsPage />);
        expect(screen.getByText(/system analytics/i)).toBeInTheDocument();
    });

    it('displays the correct stat card values', () => {
        useAnalyticsMock.mockReturnValue({
            analyticsData: {
                avgProcessingTime: 5,
                avgAppointmentRating: 4.2,
                noShowRate: 12,
                peakHour: '3 PM (SLST)',
                peakHoursData: [],
                processingTimeData: [],
                recentFeedback: [],
            },
            allApplications: [],
            loading: false,
        });
        render(<AdminAnalyticsPage />);
        expect(screen.getByText('5 Days')).toBeInTheDocument();
        expect(screen.getByText('4.2 / 5')).toBeInTheDocument();
        expect(screen.getByText('12%')).toBeInTheDocument();
        expect(screen.getByText('3 PM (SLST)')).toBeInTheDocument();
    });

    it('renders the recent feedback table with data', () => {
        useAnalyticsMock.mockReturnValue({
             analyticsData: {
                avgProcessingTime: 5,
                avgAppointmentRating: 4.2,
                noShowRate: 12,
                peakHour: '3 PM (SLST)',
                peakHoursData: [],
                processingTimeData: [],
                recentFeedback: [
                    { id: 'fb1', service: 'Passport', user: 'Test User', appointmentRating: 5, appointmentFeedback: 'Excellent!' }
                ],
            },
            allApplications: [],
            loading: false,
        });
        render(<AdminAnalyticsPage />);
        expect(screen.getByText('Recent Appointment Feedback')).toBeInTheDocument();
        expect(screen.getByText('Passport')).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('Excellent!')).toBeInTheDocument();
    });

    it('shows loading state correctly', () => {
        useAnalyticsMock.mockReturnValue({
            analyticsData: {
                avgProcessingTime: 0, avgAppointmentRating: 0, noShowRate: 0, peakHour: "",
                peakHoursData: [], processingTimeData: [], recentFeedback: [],
            },
            allApplications: [],
            loading: true,
        });
        render(<AdminAnalyticsPage />);
        expect(screen.queryByText('5 Days')).not.toBeInTheDocument();
    });
});

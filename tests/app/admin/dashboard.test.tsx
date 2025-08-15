import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboardPage from '@/app/admin/dashboard/page';

// Mock child components to isolate the test
jest.mock('@/components/admin-layout', () => ({
  AdminLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/sri-lanka-time', () => ({
  SriLankaTime: () => <div>SL Time</div>,
}));

// Mock firebase
jest.mock('@/lib/firebase', () => ({
    db: {
        collection: jest.fn(),
        getDocs: jest.fn(),
        query: jest.fn(),
        orderBy: jest.fn(),
        limit: jest.fn(),
    }
}));
import { collection, getDocs, Timestamp } from 'firebase/firestore';


describe('AdminDashboardPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        const mockUsers = { size: 15, docs: [] };
        const mockApps = { size: 25, docs: [] };
        const mockPayments = { 
            docs: [
                { data: () => ({ amount: '1500.00' }) },
                { data: () => ({ amount: '2500.00' }) },
            ] 
        };
        const mockRecentApps = {
            docs: [
                { id: 'app1', data: () => ({ user: 'Nimal Silva', service: 'Passport Services', submitted: Timestamp.now(), status: 'Approved' }) },
                { id: 'app2', data: () => ({ user: 'Kamala Perera', service: 'Driving Licence Services', submitted: Timestamp.now(), status: 'Pending' }) },
            ]
        };

        // This is a simplified mock. A more robust mock would inspect the query's path.
        (getDocs as jest.Mock).mockImplementation((q) => {
            // Check a property of the query to differentiate. This is just an example.
            // If the query has a 'limit' property (from the recent apps query), return mockRecentApps.
            if ((q as any)._limit) {
                return Promise.resolve(mockRecentApps);
            }
            // A bit fragile, relies on call order for the Promise.all
            const callOrder = (getDocs as jest.Mock).mock.calls.length;
            if (callOrder === 1) return Promise.resolve(mockUsers);
            if (callOrder === 2) return Promise.resolve(mockApps);
            if (callOrder === 3) return Promise.resolve(mockPayments);

            return Promise.resolve({ docs: [] }); // Default empty response
        });
    });

    it('renders the dashboard title', () => {
        render(<AdminDashboardPage />);
        expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();
    });

    it('displays the correct stats after fetching data', async () => {
        render(<AdminDashboardPage />);
        
        await waitFor(() => {
            expect(screen.getByText('15')).toBeInTheDocument(); // Total Users
            expect(screen.getByText('25')).toBeInTheDocument(); // Total Applications
            expect(screen.getByText('LKR 4,000')).toBeInTheDocument(); // Total Payments
        });
    });

    it('renders the recent applications table with correct data', async () => {
        render(<AdminDashboardPage />);

        await waitFor(() => {
            expect(screen.getByRole('cell', { name: /user name/i })).toBeInTheDocument();
            expect(screen.getByRole('cell', { name: /nimal silva/i })).toBeInTheDocument();
            expect(screen.getByRole('cell', { name: /passport services/i })).toBeInTheDocument();
            expect(screen.getByRole('cell', { name: /kamala perera/i })).toBeInTheDocument();
            expect(screen.getByText('Approved')).toBeInTheDocument();
            expect(screen.getByText('Pending')).toBeInTheDocument();
        });
    });
});

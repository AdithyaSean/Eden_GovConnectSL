
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboardPage from '@/app/admin/dashboard/page';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Mock the entire firebase/firestore module
jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'), // Import and retain default exports
  getDocs: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
}));

// Mock child components to isolate the test
jest.mock('@/components/admin-layout', () => ({
  AdminLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/sri-lanka-time', () => ({
  SriLankaTime: () => <div>SL Time</div>,
}));

describe('AdminDashboardPage', () => {
    beforeEach(() => {
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

        // Correctly mock the implementation of getDocs
        (getDocs as jest.Mock).mockImplementation((q) => {
            const path = (q as any)._query?.path?.segments?.join('/');
            if (path === 'users') {
                 return Promise.resolve(mockUsers);
            }
            if (path === 'applications' && (q as any)._query?.limit) {
                return Promise.resolve(mockRecentApps);
            }
            if (path === 'applications') {
                return Promise.resolve(mockApps);
            }
            if (path === 'payments') {
                return Promise.resolve(mockPayments);
            }
            return Promise.resolve({ docs: [], size: 0 }); // Default empty response
        });
    });

    it('renders the dashboard title', async () => {
        render(<AdminDashboardPage />);
        await waitFor(() => {
          expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();
        })
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
            expect(screen.getByRole('cell', { name: /nimal silva/i })).toBeInTheDocument();
            expect(screen.getByRole('cell', { name: /passport services/i })).toBeInTheDocument();
            expect(screen.getByRole('cell', { name: /kamala perera/i })).toBeInTheDocument();
            expect(screen.getByText('Approved')).toBeInTheDocument();
            expect(screen.getByText('Pending')).toBeInTheDocument();
        });
    });
});

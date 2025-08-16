
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboardPage from '@/app/admin/dashboard/page';
import { Timestamp } from 'firebase/firestore';

// Mock child components to isolate the test
jest.mock('@/components/admin-layout', () => ({
  AdminLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/sri-lanka-time', () => ({
  SriLankaTime: () => <div>SL Time</div>,
}));

// This mock simulates the Firestore database, providing the correct data for each test.
jest.mock('firebase/firestore', () => {
    // Helper to create mock document structures that Firestore expects
    const createMockDocs = (dataArray) => 
        dataArray.map((data, i) => ({
            id: `mock-doc-${i}`,
            data: () => data,
        }));

    return {
        // We need to mock all the functions used by the component to build its queries
        collection: jest.fn((db, path) => ({ path })), // Identify the collection by its path
        query: jest.fn((collectionRef) => collectionRef),
        orderBy: jest.fn((queryRef) => queryRef),
        limit: jest.fn((queryRef) => queryRef),

        // This is the main data-fetching function we need to control
        getDocs: jest.fn(async (queryRef) => {
            const path = queryRef.path;

            // Return specific data based on which collection is being queried
            if (path === 'users') {
                return { size: 15, docs: [] }; // Correct: Total Users count
            }

            if (path === 'applications') {
                return {
                    size: 25, // Correct: Total Applications count
                    docs: createMockDocs([ // Correct: Data for the recent applications table
                        {
                            user: 'Nimal Silva',
                            service: 'Passport Services',
                            status: 'Approved',
                            submitted: Timestamp.now(),
                        },
                        {
                            user: 'Kamala Perera',
                            service: 'Driving Licence Services',
                            status: 'Pending',
                            submitted: Timestamp.now(),
                        },
                    ]),
                };
            }

            if (path === 'payments') {
                // Correct: Data that sums up to the expected total payment amount
                return {
                    docs: createMockDocs([{ amount: '1500.00' }, { amount: '2500.00' }]),
                };
            }

            // A default empty response for any other queries
            return { docs: [], size: 0 };
        }),
    };
});

describe('AdminDashboardPage', () => {
    afterEach(() => {
        jest.clearAllMocks();
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

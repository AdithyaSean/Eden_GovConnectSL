import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboardPage from '@/app/admin/dashboard/page';
import '@testing-library/jest-dom';

// --- START: MOCK FIREBASE/FIRESTORE ---

// Mock data that matches the expectations of your tests
const mockApplications = [
  {
    id: '1',
    user: 'Nimal Silva',
    service: 'Passport Services',
    submitted: { toDate: () => new Date('2023-10-26') },
    status: 'Approved',
  },
  {
    id: '2',
    user: 'Kamala Perera',
    service: 'ID Card Renewal',
    submitted: { toDate: () => new Date('2023-10-25') },
    status: 'Pending',
  },
];

const mockPayments = [
    { amount: '2500.00' },
    { amount: '1500.00' },
];

// Mock the entire 'firebase/firestore' module
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn((db, path) => ({
      path: path // Pass path for getDocs to identify the collection
  })),
  getDocs: jest.fn((query) => {
    const path = query.path;
    if (path === 'users') {
      return Promise.resolve({
        size: 15, // As expected in the test
        docs: [], // No need to mock full docs if only size is needed
      });
    }
    if (path === 'applications') {
      return Promise.resolve({
        size: 25, // As expected in the test
        docs: mockApplications.map(app => ({
          id: app.id,
          data: () => app,
        })),
      });
    }
    if (path === 'payments') {
      return Promise.resolve({
        docs: mockPayments.map(p => ({
            data: () => p
        })),
      });
    }
    return Promise.resolve({ size: 0, docs: [] });
  }),
  query: jest.fn((collectionRef) => collectionRef), // Just return the ref
  orderBy: jest.fn((collectionRef) => collectionRef), // Just return the ref
  limit: jest.fn((collectionRef) => collectionRef), // Just return the ref
  Timestamp: { // Mock Timestamp to avoid the 'now' error
    now: jest.fn(),
    fromDate: (date) => date,
  },
}));

// --- END: MOCK FIREBASE/FIRESTORE ---


describe('AdminDashboardPage', () => {
  it('renders the dashboard title', () => {
    render(<AdminDashboardPage />);
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('displays the correct stats after fetching data', async () => {
    render(<AdminDashboardPage />);

    // Use findByText which automatically waits for the element to appear
    expect(await screen.findByText('15')).toBeInTheDocument(); // Total Users
    expect(await screen.findByText('25')).toBeInTheDocument(); // Total Applications
    expect(await screen.findByText('LKR 4,000.00')).toBeInTheDocument(); // Total Payments (2500 + 1500)
  });

  it('renders the recent applications table with correct data', async () => {
    render(<AdminDashboardPage />);

    // Wait for the table to populate
    expect(await screen.findByRole('cell', { name: /nimal silva/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /passport services/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /kamala perera/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /id card renewal/i })).toBeInTheDocument();
  });
});

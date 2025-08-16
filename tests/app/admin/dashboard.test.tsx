
import { render, screen } from '@testing-library/react';
import AdminDashboardPage from '@/app/admin/dashboard/page';
import '@testing-library/jest-dom';

// --- START: MOCK NEXT/NAVIGATION ---
// Mock the router, pathname, and other navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/admin/dashboard', // Provide a mock pathname
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// --- END: MOCK NEXT/NAVIGATION ---


// --- START: MOCK FIREBASE/FIRESTORE ---

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
      path: path
  })),
  getDocs: jest.fn(async (query) => {
    const path = query.path;
    if (path === 'users') {
      return Promise.resolve({ size: 15 });
    }
    if (path === 'applications') {
      return Promise.resolve({
        size: 25,
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
  query: jest.fn((collectionRef) => collectionRef),
  orderBy: jest.fn((collectionRef) => collectionRef),
  limit: jest.fn((collectionRef) => collectionRef),
  Timestamp: {
    now: jest.fn(),
    fromDate: (date) => date,
  },
}));

// --- END: MOCK FIREBASE/FIRESTORE ---


describe('AdminDashboardPage', () => {
  // Test cases remain the same
  it('renders the dashboard title', async () => {
    render(<AdminDashboardPage />);
    expect(await screen.findByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('displays the correct stats after fetching data', async () => {
    render(<AdminDashboardPage />);
    expect(await screen.findByText('15')).toBeInTheDocument(); // Total Users
    expect(await screen.findByText('25')).toBeInTheDocument(); // Total Applications
    expect(await screen.findByText('LKR 4,000.00')).toBeInTheDocument(); // Total Payments
  });

  it('renders the recent applications table with correct data', async () => {
    render(<AdminDashboardPage />);
    expect(await screen.findByRole('cell', { name: /nimal silva/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /passport services/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /id card renewal/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: /kamala perera/i })).toBeInTheDocument();
  });
});

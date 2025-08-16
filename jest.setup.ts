
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from 'react';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams: () => ({
      get: jest.fn(),
  }),
  usePathname: jest.fn()
}));

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn((callback) => {
      // Simulate a logged-out user by default
      callback(null);
      // Return an unsubscribe function
      return jest.fn();
    }),
    signInWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'test-uid' } })),
    sendEmailVerification: jest.fn(() => Promise.resolve()),
  },
  db: {
      collection: jest.fn(),
      doc: jest.fn(),
      getDoc: jest.fn(),
      getDocs: jest.fn(),
      query: jest.fn(),
      where: jest.fn(),
      addDoc: jest.fn(),
      serverTimestamp: jest.fn(),
      updateDoc: jest.fn(),
      setDoc: jest.fn(),
      limit: jest.fn(),
      orderBy: jest.fn(),
  },
  storage: {},
}));

// Mock the useAuth hook
jest.mock('@/hooks/use-auth', () => ({
    useAuth: () => ({
        user: { 
            id: 'test-user-id',
            uid: 'test-user-uid',
            name: 'Test User', 
            nic: '123456789V', 
            email: 'test@example.com' 
        },
        loading: false,
        refetch: jest.fn(),
    }),
}));

// Mock the useAnalytics hook
jest.mock('@/hooks/use-analytics', () => ({
  useAnalytics: () => ({
    analyticsData: {
      avgProcessingTime: 7,
      avgAppointmentRating: 4.5,
      noShowRate: 15,
      peakHour: "2 PM (SLST)",
      peakHoursData: [],
      processingTimeData: [],
      recentFeedback: [],
    },
    allApplications: [],
    loading: false,
  }),
}));

// Mock lucide-react library
jest.mock('lucide-react', () => {
    // A proxy to catch any icon name and return a simple component
    return new Proxy({}, {
        get: function(target, name) {
            // Return a function that returns a simple div. 
            // This will stand in for any icon component like <Home />, <Star />, etc.
            const Component = (props: any) => {
                // Create a test-friendly name, e.g., "Icon-Home"
                const testId = `icon-${String(name)}`;
                // Use React.createElement to avoid JSX syntax in this file
                return React.createElement('div', { 'data-testid': testId }, String(name));
            };
            Component.displayName = `MockedLucideIcon-${String(name)}`;
            return Component;
        }
    });
});

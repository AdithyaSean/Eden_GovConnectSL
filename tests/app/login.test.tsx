import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/login/page';
import '@testing-library/jest-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { getDocs } from 'firebase/firestore';


// Mock the entire firebase/firestore module
jest.mock('firebase/firestore', () => ({
    ...jest.requireActual('firebase/firestore'), // Import and retain default exports
    getDocs: jest.fn(),
    query: jest.fn(),
    collection: jest.fn(),
    where: jest.fn(),
}));


// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));


describe('LoginPage', () => {
  const mockToast = jest.fn();
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
     // Set up a default mock for getDocs to return an empty array
    (getDocs as jest.Mock).mockResolvedValue({ empty: true, docs: [] });
  });

  it('renders the login form correctly', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /citizen login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/national id number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows an error if fields are empty on submit', async () => {
    render(<LoginPage />);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    await userEvent.click(loginButton);
    
    expect(mockToast).toHaveBeenCalledWith({
      title: 'All Fields Required',
      variant: 'destructive',
    });
  });

  it('handles successful login and redirects verified user to dashboard', async () => {
    const user = userEvent.setup();
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      emailVerified: true,
    };
     const mockUserData = {
      id: 'test-uid',
      data: () => ({
        nic: '123456789V',
        email: 'test@example.com',
        status: 'Active',
      }),
    };
    
    (getDocs as jest.Mock).mockResolvedValue({ empty: false, docs: [mockUserData] });
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });

    render(<LoginPage />);
    
    await user.type(screen.getByLabelText(/national id number/i), '123456789V');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password123');
    });

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('redirects unverified user to two-factor page', async () => {
    const user = userEvent.setup();
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      emailVerified: false,
    };
     const mockUserData = {
      id: 'test-uid',
      data: () => ({
        nic: '123456789V',
        email: 'test@example.com',
        status: 'Active',
      }),
    };
    
    (getDocs as jest.Mock).mockResolvedValue({ empty: false, docs: [mockUserData] });
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });

    render(<LoginPage />);
    
    await user.type(screen.getByLabelText(/national id number/i), '123456789V');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/two-factor?nic=123456789V');
    });
  });


  it('shows error toast for wrong password', async () => {
    const user = userEvent.setup();
    const mockUserData = {
      id: 'test-uid',
      data: () => ({
        nic: '123456789V',
        email: 'test@example.com',
        status: 'Active',
      }),
    };
    (getDocs as jest.Mock).mockResolvedValue({ empty: false, docs: [mockUserData] });
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({ code: 'auth/wrong-password' });
    
    render(<LoginPage />);
    
    await user.type(screen.getByLabelText(/national id number/i), '123456789V');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
            title: "Login Failed",
            description: "The password you entered is incorrect. Please try again.",
            variant: "destructive"
        });
    });
  });

});

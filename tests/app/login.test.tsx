
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDocs } from 'firebase/firestore';

// Mock child components and hooks
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

// Mock firebase
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

const useToastMock = useToast as jest.Mock;
const signInWithEmailAndPasswordMock = signInWithEmailAndPassword as jest.Mock;
const getDocsMock = getDocs as jest.Mock;

describe('LoginPage', () => {
    let toastMock: jest.Mock;

    beforeEach(() => {
        toastMock = jest.fn();
        useToastMock.mockReturnValue({ toast: toastMock });
        signInWithEmailAndPasswordMock.mockClear();
        getDocsMock.mockClear();
    });

    it('renders the login form correctly', () => {
        render(<LoginPage />);
        expect(screen.getByText('Citizen Login')).toBeInTheDocument();
        expect(screen.getByLabelText(/national id number/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('shows a toast message if fields are empty', async () => {
        render(<LoginPage />);
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        await waitFor(() => {
            expect(toastMock).toHaveBeenCalledWith({
                title: "All Fields Required",
                variant: "destructive"
            });
        });
    });

    it('handles successful login and redirects for verified user', async () => {
        getDocsMock.mockResolvedValue({
            empty: false,
            docs: [{ data: () => ({ email: 'test@example.com', status: 'Active' }) }]
        });
        signInWithEmailAndPasswordMock.mockResolvedValue({
            user: { emailVerified: true }
        });

        render(<LoginPage />);
        fireEvent.change(screen.getByLabelText(/national id number/i), { target: { value: '12345V' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(signInWithEmailAndPasswordMock).toHaveBeenCalledWith(undefined, 'test@example.com', 'password123');
            // Check for router push, which is mocked globally in jest.setup.ts
            const { useRouter } = require('next/navigation');
            expect(useRouter().push).toHaveBeenCalledWith('/dashboard');
        });
    });
    
    it('handles incorrect password error', async () => {
        getDocsMock.mockResolvedValue({
            empty: false,
            docs: [{ data: () => ({ email: 'test@example.com', status: 'Active' }) }]
        });
        signInWithEmailAndPasswordMock.mockRejectedValue({ code: 'auth/wrong-password' });

        render(<LoginPage />);
        fireEvent.change(screen.getByLabelText(/national id number/i), { target: { value: '12345V' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(toastMock).toHaveBeenCalledWith({
                title: "Login Failed",
                description: "The password you entered is incorrect. Please try again.",
                variant: "destructive"
            });
        });
    });

     it('handles suspended user error', async () => {
        getDocsMock.mockResolvedValue({
            empty: false,
            docs: [{ data: () => ({ email: 'test@example.com', status: 'Suspended' }) }]
        });

        render(<LoginPage />);
        fireEvent.change(screen.getByLabelText(/national id number/i), { target: { value: '12345V' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(toastMock).toHaveBeenCalledWith({
                 title: "Account Inactive",
                 description: `Your account is currently Suspended. Please contact support.`,
                 variant: "destructive"
            });
        });
    });

});

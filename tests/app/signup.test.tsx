
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from '@/app/signup/page';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getDoc, setDoc } from 'firebase/firestore';

// Mocks
const getDocMock = jest.fn();
const setDocMock = jest.fn();
const createUserWithEmailAndPasswordMock = jest.fn();
const sendEmailVerificationMock = jest.fn();

jest.mock('@/lib/firebase', () => ({
    auth: {},
    db: {},
}));
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    createUserWithEmailAndPassword: createUserWithEmailAndPasswordMock,
    sendEmailVerification: sendEmailVerificationMock,
}));
jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    doc: jest.fn(),
    getDoc: getDocMock,
    setDoc: setDocMock,
    serverTimestamp: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

const useToastMock = useToast as jest.Mock;

describe('Signup Page', () => {
    let toastMock: jest.Mock;

    beforeEach(() => {
        toastMock = jest.fn();
        useToastMock.mockReturnValue({ toast: toastMock });
        createUserWithEmailAndPasswordMock.mockClear();
        sendEmailVerificationMock.mockClear();
        getDocMock.mockClear();
        setDocMock.mockClear();
    });

    it('renders the signup form with all fields', () => {
        render(<SignupPage />);
        expect(screen.getByText(/create citizen account/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/national id number/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /create an account/i})).toBeInTheDocument();
    });

    it('shows a toast if any field is empty on submission', async () => {
        render(<SignupPage />);
        fireEvent.click(screen.getByRole('button', { name: /create an account/i }));
        await waitFor(() => {
            expect(toastMock).toHaveBeenCalledWith({
                title: 'All fields are required.',
                variant: 'destructive',
            });
        });
    });

    it('shows a toast for weak passwords', async () => {
        render(<SignupPage />);
        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText(/national id number/i), { target: { value: '123456789V' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'weak' } });
        fireEvent.click(screen.getByRole('button', { name: /create an account/i }));

        await waitFor(() => {
            expect(toastMock).toHaveBeenCalledWith({
                title: 'Password does not meet requirements',
                description: 'Please ensure your password meets all the criteria listed.',
                variant: 'destructive'
            });
        });
    });

    it('shows a toast for invalid NIC format', async () => {
        render(<SignupPage />);
        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText(/national id number/i), { target: { value: 'invalidnic' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
        fireEvent.click(screen.getByRole('button', { name: /create an account/i }));

        await waitFor(() => {
            expect(toastMock).toHaveBeenCalledWith({
                title: "Invalid NIC Format",
                description: "Please enter a valid 10-digit (e.g., 123456789V) or 12-digit NIC.",
                variant: "destructive"
            });
        });
    });

    it('handles successful signup', async () => {
        getDocMock.mockResolvedValue({ exists: () => false });
        createUserWithEmailAndPasswordMock.mockResolvedValue({
            user: { uid: 'test-uid' }
        });
        sendEmailVerificationMock.mockResolvedValue(undefined);

        render(<SignupPage />);
        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText(/national id number/i), { target: { value: '123456789V' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
        fireEvent.click(screen.getByRole('button', { name: /create an account/i }));
        
        await waitFor(() => {
            expect(createUserWithEmailAndPasswordMock).toHaveBeenCalled();
            expect(setDocMock).toHaveBeenCalledTimes(2); // one for 'citizens', one for 'users'
            expect(sendEmailVerificationMock).toHaveBeenCalled();
            expect(toastMock).toHaveBeenCalledWith({
                title: 'Account Created Successfully!',
                description: 'A verification link has been sent to your email. Please verify before logging in.',
            });
            const { useRouter } = require('next/navigation');
            expect(useRouter().push).toHaveBeenCalledWith('/two-factor?nic=123456789V');
        });
    });

    it('handles signup failure when NIC is already registered', async () => {
        getDocMock.mockResolvedValue({ exists: () => true });

        render(<SignupPage />);
        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText(/national id number/i), { target: { value: '123456789V' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
        fireEvent.click(screen.getByRole('button', { name: /create an account/i }));

        await waitFor(() => {
            expect(toastMock).toHaveBeenCalledWith({
                title: "Signup Failed",
                description: "This National ID Number is already registered.",
                variant: "destructive",
            });
        });
    });

    it('handles signup failure when email is already in use', async () => {
        getDocMock.mockResolvedValue({ exists: () => false });
        createUserWithEmailAndPasswordMock.mockRejectedValue({ code: 'auth/email-already-in-use' });
        
        render(<SignupPage />);
        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText(/national id number/i), { target: { value: '123456789V' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
        fireEvent.click(screen.getByRole('button', { name: /create an account/i }));

        await waitFor(() => {
            expect(toastMock).toHaveBeenCalledWith({
                 title: "Signup Failed", 
                 description: "This email is already registered. Please log in or use a different email.", 
                 variant: "destructive" 
            });
        });
    });
});

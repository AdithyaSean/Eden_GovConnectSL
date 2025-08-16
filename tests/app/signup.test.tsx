
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from '@/app/signup/page';
import '@testing-library/jest-dom';

// Mock child components
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
    useToast: () => ({
        toast: mockToast,
    }),
}));

// *** THE FIX: Declare mocks BEFORE jest.mock call ***
const getDocMock = jest.fn();
const setDocMock = jest.fn();
const createUserWithEmailAndPasswordMock = jest.fn();
const sendEmailVerificationMock = jest.fn();


jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    doc: jest.fn(),
    getDoc: getDocMock,
    setDoc: setDocMock,
    serverTimestamp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: createUserWithEmailAndPasswordMock,
    sendEmailVerification: sendEmailVerificationMock,
}));


describe('Signup Page', () => {
    beforeEach(() => {
        // Clear mocks before each test
        getDocMock.mockClear();
        setDocMock.mockClear();
        createUserWithEmailAndPasswordMock.mockClear();
        sendEmailVerificationMock.mockClear();
        mockToast.mockClear();
    });

    it('renders the signup form correctly', () => {
        render(<SignupPage />);
        expect(screen.getByText(/Create Citizen Account/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/National ID Number/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });
    
    it('shows an error if required fields are not filled', async () => {
        render(<SignupPage />);
        fireEvent.click(screen.getByRole('button', { name: /Create an account/i }));
        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                title: 'All fields are required.',
                variant: 'destructive'
            })
        });
    });
});

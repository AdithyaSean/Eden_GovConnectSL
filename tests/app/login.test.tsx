
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';
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
const getDocsMock = jest.fn();
const signInWithEmailAndPasswordMock = jest.fn();
const sendPasswordResetEmailMock = jest.fn();


jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    getDocs: getDocsMock,
}));


jest.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: signInWithEmailAndPasswordMock,
    sendPasswordResetEmail: sendPasswordResetEmailMock,
}));



describe('Login Page', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        getDocsMock.mockClear();
        signInWithEmailAndPasswordMock.mockClear();
        sendPasswordResetEmailMock.mockClear();
        mockToast.mockClear();
    });

    it('renders the login form', () => {
        render(<LoginPage />);
        expect(screen.getByText(/Citizen Login/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/National ID Number/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });
    
    it('shows toast error if fields are empty', async () => {
        render(<LoginPage/>);
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));
        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                title: 'All Fields Required',
                variant: 'destructive',
            });
        });
    });

});

// ⬇️ REPLACE THE ENTIRE FILE WITH THIS CODE ⬇️

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from '@/app/signup/page';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock useToast
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

// *** THE FIX: Declare mocks BEFORE jest.mock call ***
const createUserWithEmailAndPasswordMock = jest.fn();
const sendEmailVerificationMock = jest.fn();

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: createUserWithEmailAndPasswordMock,
  sendEmailVerification: sendEmailVerificationMock,
}));

jest.mock('firebase/firestore'); // Add other firestore mocks as needed

describe('SignupPage', () => {
  it('should attempt to sign up when form is submitted', async () => {
    // This is a placeholder test. Your actual tests will go here.
    createUserWithEmailAndPasswordMock.mockResolvedValue({ user: { uid: '123' } });
    render(<SignupPage />);
    fireEvent.click(screen.getByRole('button', { name: /Create an account/i }));
    await waitFor(() => {
        // Your assertions
    });
  });
});

// ⬇️ REPLACE THE ENTIRE FILE WITH THIS CODE ⬇️

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';
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
const signInWithEmailAndPasswordMock = jest.fn();
const sendPasswordResetEmailMock = jest.fn();

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: signInWithEmailAndPasswordMock,
  sendPasswordResetEmail: sendPasswordResetEmailMock,
}));

jest.mock('firebase/firestore'); // Add other firestore mocks as needed

describe('LoginPage', () => {
  it('should attempt to log in when form is submitted', async () => {
    // This is a placeholder test. Your actual tests will go here.
    const { getDocs } = require('firebase/firestore');
    // getDocs.mockResolvedValue(...) example
    render(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    await waitFor(() => {
      // Your assertions
    });
  });
});

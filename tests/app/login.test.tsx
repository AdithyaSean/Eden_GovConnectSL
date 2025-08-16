import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock useToast
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock Firebase
const getDocsMock = jest.fn();
const signInWithEmailAndPasswordMock = jest.fn();
const sendPasswordResetEmailMock = jest.fn();

jest.mock('@/lib/firebase', () => ({
  db: jest.fn(),
  auth: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
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
    // Clear mocks before each test
    mockToast.mockClear();
    getDocsMock.mockClear();
    signInWithEmailAndPasswordMock.mockClear();
    sendPasswordResetEmailMock.mockClear();
  });

  it('renders the login form correctly', () => {
    render(<LoginPage />);
    expect(screen.getByText('Citizen Login')).toBeInTheDocument();
    expect(screen.getByLabelText('National ID Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('shows a toast error if fields are submitted empty', async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'All Fields Required',
        variant: 'destructive',
      });
    });
  });

  it('handles successful login for a verified user', async () => {
    // Arrange
    getDocsMock.mockResolvedValue({
      empty: false,
      docs: [{
        data: () => ({
          email: 'test@example.com',
          status: 'Active'
        }),
      }],
    });
    signInWithEmailAndPasswordMock.mockResolvedValue({
      user: { emailVerified: true },
    });

    render(<LoginPage />);

    // Act
    fireEvent.input(screen.getByLabelText('National ID Number'), { target: { value: '123456789V' } });
    fireEvent.input(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Assert
    await waitFor(() => {
      expect(signInWithEmailAndPasswordMock).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password123');
    });
  });

  it('shows an error for an incorrect password', async () => {
    // Arrange
    getDocsMock.mockResolvedValue({
      empty: false,
      docs: [{
        data: () => ({
          email: 'test@example.com',
          status: 'Active'
        }),
      }],
    });
    signInWithEmailAndPasswordMock.mockRejectedValue({ code: 'auth/wrong-password' });

    render(<LoginPage />);

    // Act
    fireEvent.input(screen.getByLabelText('National ID Number'), { target: { value: '123456789V' } });
    fireEvent.input(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Assert
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Login Failed',
        description: 'The password you entered is incorrect. Please try again.',
        variant: 'destructive',
      });
    });
  });

  it('shows an error for a non-existent NIC', async () => {
    // Arrange
    getDocsMock.mockResolvedValue({ empty: true, docs: [] });

    render(<LoginPage />);

    // Act
    fireEvent.input(screen.getByLabelText('National ID Number'), { target: { value: '000000000V' } });
    fireEvent.input(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Assert
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Login Failed',
        description: 'No account found with this NIC.',
        variant: 'destructive',
      });
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from '@/app/signup/page';
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
const getDocMock = jest.fn();
const setDocMock = jest.fn();
const createUserWithEmailAndPasswordMock = jest.fn();
const sendEmailVerificationMock = jest.fn();

jest.mock('@/lib/firebase', () => ({
    db: {},
    auth: {}
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn((db, collection, id) => ({ path: `${collection}/${id}` })),
  getDoc: getDocMock,
  setDoc: setDocMock,
  serverTimestamp: jest.fn(() => 'MOCK_TIMESTAMP'),
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: createUserWithEmailAndPasswordMock,
  sendEmailVerification: sendEmailVerificationMock,
}));

describe('Signup Page', () => {
  beforeEach(() => {
    // Clear mocks before each test
    mockToast.mockClear();
    getDocMock.mockClear();
    setDocMock.mockClear();
    createUserWithEmailAndPasswordMock.mockClear();
    sendEmailVerificationMock.mockClear();
  });

  it('renders the signup form correctly', () => {
    render(<SignupPage />);
    expect(screen.getByText('Create Citizen Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('National ID Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create an account' })).toBeInTheDocument();
  });

  it('shows an error if password is weak', async () => {
    render(<SignupPage />);
    fireEvent.input(screen.getByLabelText('Password'), { target: { value: 'weak' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create an account' }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Password does not meet requirements',
        description: 'Please ensure your password meets all the criteria listed.',
        variant: 'destructive',
      });
    });
  });

  it('shows an error for an invalid NIC format', async () => {
    render(<SignupPage />);
    fireEvent.input(screen.getByLabelText('Password'), { target: { value: 'ValidPass1!' } });
    fireEvent.input(screen.getByLabelText('National ID Number'), { target: { value: 'invalid-nic' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create an account' }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Invalid NIC Format',
      }));
    });
  });

  it('handles successful signup', async () => {
    // Arrange
    getDocMock.mockResolvedValue({ exists: () => false }); // NIC not registered
    createUserWithEmailAndPasswordMock.mockResolvedValue({
      user: {
        uid: 'test-uid',
        metadata: { creationTime: new Date().toISOString() },
      },
    });
    sendEmailVerificationMock.mockResolvedValue(undefined);

    render(<SignupPage />);

    // Act
    fireEvent.input(screen.getByLabelText('Full Name'), { target: { value: 'Test User' } });
    fireEvent.input(screen.getByLabelText('National ID Number'), { target: { value: '199912345V' } });
    fireEvent.input(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create an account' }));

    // Assert
    await waitFor(() => {
      expect(createUserWithEmailAndPasswordMock).toHaveBeenCalled();
      expect(setDocMock).toHaveBeenCalledTimes(2); // Once for citizens, once for users
      expect(sendEmailVerificationMock).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Account Created Successfully!',
        description: 'A verification link has been sent to your email. Please verify before logging in.',
      });
    });
  });

  it('shows an error if NIC is already registered', async () => {
    // Arrange
    getDocMock.mockResolvedValue({ exists: () => true }); // NIC IS registered

    render(<SignupPage />);

    // Act
    fireEvent.input(screen.getByLabelText('Full Name'), { target: { value: 'Test User' } });
    fireEvent.input(screen.getByLabelText('National ID Number'), { target: { value: '199912345V' } });
    fireEvent.input(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create an account' }));

    // Assert
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Signup Failed',
        description: 'This National ID Number is already registered.',
        variant: 'destructive',
      });
    });
  });

});

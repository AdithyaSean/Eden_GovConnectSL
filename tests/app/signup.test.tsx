
import React from 'react';
import { render, screen } from '@testing-library/react';
import SignupPage from '@/app/signup/page';

describe('Signup Page', () => {
    it('renders the signup form with all fields', () => {
        render(<SignupPage />);
        expect(screen.getByText(/create citizen account/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/national id number/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /create an account/i})).toBeInTheDocument();
    });
});

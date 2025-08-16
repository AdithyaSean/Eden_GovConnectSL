
import React from 'react';
import { render, screen } from '@testing-library/react';
import TwoFactorPage from '@/app/two-factor/page';

describe('Two Factor Page', () => {
    it('renders the main heading and instruction text', () => {
        render(<TwoFactorPage />);
        expect(screen.getByText(/check your email/i)).toBeInTheDocument();
        expect(screen.getByText(/We've sent a verification link/)).toBeInTheDocument();
    });

    it('renders the resend button', () => {
        render(<TwoFactorPage />);
        expect(screen.getByRole('button', {name: /resend verification link/i})).toBeInTheDocument();
    });
});

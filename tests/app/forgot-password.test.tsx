
import React from 'react';
import { render, screen } from '@testing-library/react';
import ForgotPasswordPage from '@/app/forgot-password/page';

describe('Forgot Password Page', () => {
    it('renders the main heading and form elements', () => {
        render(<ForgotPasswordPage />);
        // Query by text content as the title is in a div, not a heading role
        expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/nic or email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /send reset link/i})).toBeInTheDocument();
    });
});

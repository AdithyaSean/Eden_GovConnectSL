
import React from 'react';
import { render, screen } from '@testing-library/react';
import ForgotPasswordPage from '@/app/forgot-password/page';

describe('Forgot Password Page', () => {
    it('renders the main heading and form elements', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByRole('heading', {name: /forgot password/i})).toBeInTheDocument();
        expect(screen.getByLabelText(/nic or email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /send reset link/i})).toBeInTheDocument();
    });
});

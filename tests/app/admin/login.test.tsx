
import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminLoginPage from '@/app/admin/login/page';

describe('AdminLoginPage', () => {
    it('renders the login form', () => {
        render(<AdminLoginPage />);
        expect(screen.getByText(/admin & worker login/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });
});

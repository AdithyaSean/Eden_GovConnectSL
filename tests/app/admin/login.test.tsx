
import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminLoginPage from '@/app/admin/login/page';

describe('AdminLoginPage', () => {
    it('renders the login form', () => {
        render(<AdminLoginPage />);
        expect(screen.getByRole('heading', { name: /admin & worker login/i })).toBeInTheDocument();
    });
});

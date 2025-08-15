
import React from 'react';
import { render, screen } from '@testing-library/react';
import ForgotPasswordPage from '@/app/forgot-password/page';

describe('Forgot Password Page', () => {
    it('is a placeholder test', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByRole('heading', {name: /forgot password/i})).toBeInTheDocument();
    });
});

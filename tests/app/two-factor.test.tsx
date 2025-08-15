
import React from 'react';
import { render, screen } from '@testing-library/react';
import TwoFactorPage from '@/app/two-factor/page';

describe('Two Factor Page', () => {
    it('is a placeholder test', () => {
        render(<TwoFactorPage />);
        expect(screen.getByRole('heading', {name: /check your email/i})).toBeInTheDocument();
    });
});

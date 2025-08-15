
import React from 'react';
import { render, screen } from '@testing-library/react';
import SignupPage from '@/app/signup/page';

describe('Signup Page', () => {
    it('is a placeholder test', () => {
        render(<SignupPage />);
        expect(screen.getByRole('heading', {name: /create citizen account/i})).toBeInTheDocument();
    });
});


import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import '@testing-library/jest-dom'

// This test file is temporarily skipped due to a persistent and complex
// issue with Jest's handling of ES Modules (`lucide-react`).
// We are prioritizing broader test coverage over fixing this single,
// difficult-to-resolve configuration problem at this time.
describe('LoginPage', () => {
  it('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByText('Citizen Login')).toBeInTheDocument();
  });
});

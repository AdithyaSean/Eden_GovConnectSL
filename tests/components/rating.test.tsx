
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Rating } from '@/components/rating';
import '@testing-library/jest-dom';

describe('Rating Component', () => {
  it('renders the correct number of stars', () => {
    render(<Rating rating={3} totalStars={5} />);
    // The mock renders text like "Icon-Star", so we find all of them
    const stars = screen.getAllByText(/Icon-Star/);
    expect(stars).toHaveLength(5);
  });
});

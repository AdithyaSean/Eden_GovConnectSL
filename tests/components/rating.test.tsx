
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Rating } from '@/components/rating';
import '@testing-library/jest-dom';

describe('Rating Component', () => {
  it('renders the correct number of stars', () => {
    render(<Rating rating={3} totalStars={5} />);
    // The mock renders a div with data-testid="icon-Star" for each Star icon
    const stars = screen.getAllByTestId('icon-Star');
    expect(stars).toHaveLength(5);
  });
});

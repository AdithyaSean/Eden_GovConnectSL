
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Rating } from '@/components/rating';
import '@testing-library/jest-dom';

describe('Rating Component', () => {
  it('renders the correct number of stars', () => {
    render(<Rating rating={3} totalStars={5} />);
    const stars = screen.getAllByRole('img', { hidden: true });
    expect(stars).toHaveLength(5);
  });

  it('fills the correct number of stars for an integer rating', () => {
    render(<Rating rating={4} totalStars={5} />);
    const fullStars = screen.getAllByRole('img', { hidden: true }).filter(star => star.hasAttribute('fill'));
    expect(fullStars).toHaveLength(4);
  });

  it('renders an empty star correctly', () => {
    render(<Rating rating={3} totalStars={5} />);
    // In this component, "empty" stars are just stars without a fill attribute.
    // They still have the text-yellow-400 class for the outline.
    const allStars = screen.getAllByRole('img', { hidden: true });
    const emptyStars = allStars.filter(star => !star.hasAttribute('fill'));
    expect(emptyStars).toHaveLength(2);
  });

  it('handles a rating of 0 correctly', () => {
    render(<Rating rating={0} />);
    const fullStars = screen.queryAllByRole('img', { hidden: true }).filter(star => star.hasAttribute('fill'));
    expect(fullStars).toHaveLength(0);
  });

  it('handles a rating equal to total stars correctly', () => {
    render(<Rating rating={5} totalStars={5} />);
    const fullStars = screen.getAllByRole('img', { hidden: true }).filter(star => star.hasAttribute('fill'));
    expect(fullStars).toHaveLength(5);
  });
});

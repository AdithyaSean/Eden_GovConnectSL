import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import '@testing-library/jest-dom';

describe('Button Component', () => {
  it('renders a button with the correct text', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('applies the default variant and size classes', () => {
    render(<Button>Default Button</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('bg-primary');
    expect(buttonElement).toHaveClass('text-primary-foreground');
    expect(buttonElement).toHaveClass('h-10');
  });

  it('applies the destructive variant class', () => {
    render(<Button variant="destructive">Delete</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('bg-destructive');
  });

  it('applies the outline variant class', () => {
    render(<Button variant="outline">Cancel</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('border');
    expect(buttonElement).toHaveClass('border-input');
  });

  it('applies the small size class', () => {
    render(<Button size="sm">Small</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('h-9');
  });

  it('is disabled when the disabled prop is passed', () => {
    render(<Button disabled>Disabled</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveClass('disabled:opacity-50');
  });
});

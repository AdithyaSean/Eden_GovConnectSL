import React from 'react';
import { render, screen } from '@testing-library/react';
import { ServiceCard } from '@/components/service-card';
import '@testing-library/jest-dom';
import type { Service } from '@/lib/types';


const mockService: Service = {
    title: "Test Service",
    slug: "test-service",
    description: "A test service.",
    status: "Active",
    statusVariant: "success",
    icon: "Home",
    actions: [],
    content: {
        longDescription: "A longer description for the test service.",
        sections: []
    }
};

describe('ServiceCard Component', () => {
  it('renders the service title', () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByText('Test Service')).toBeInTheDocument();
  });

  it('renders a link to the correct service page', () => {
    render(<ServiceCard service={mockService} />);
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/services/test-service');
  });

  it('renders the correct icon', () => {
    // This test checks for the presence of the SVG element.
    // A more specific test would require a way to identify the icon, e.g., by data-testid.
    render(<ServiceCard service={mockService} />);
    const svgElement = screen.getByRole('link').querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });
});


import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatPage from '@/app/chat/page';

// Mock the dashboard layout as we are only testing the chat page itself
jest.mock('@/components/dashboard-layout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="dashboard-layout">{children}</div>,
}));

// Mock the chat interface component as its internals are complex and tested separately
jest.mock('@/components/chat-interface', () => ({
    ChatInterface: () => <div data-testid="chat-interface">Mocked Chat Interface</div>,
}));

describe('ChatPage', () => {
    it('renders the DashboardLayout containing the ChatInterface', () => {
        render(<ChatPage />);
        // Check if the mocked chat interface is rendered inside the layout
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
        expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
        expect(screen.getByText('Mocked Chat Interface')).toBeInTheDocument();
    });
});

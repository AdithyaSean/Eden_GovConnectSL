
import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatPage from '@/app/chat/page';

// Mock the chat interface component as its internals are complex and tested separately
jest.mock('@/components/chat-interface', () => ({
    ChatInterface: () => <div>Mocked Chat Interface</div>,
}));

describe('ChatPage', () => {
    it('renders the DashboardLayout containing the ChatInterface', () => {
        render(<ChatPage />);
        // Check if the mocked chat interface is rendered
        expect(screen.getByText('Mocked Chat Interface')).toBeInTheDocument();
    });
});

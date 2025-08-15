
import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatPage from '@/app/chat/page';

jest.mock('@/components/chat-interface', () => ({
    ChatInterface: () => <div>Chat Interface</div>
}));

describe('Chat Page', () => {
    it('renders the chat interface', () => {
        render(<ChatPage />);
        expect(screen.getByText('Chat Interface')).toBeInTheDocument();
    });
});

// ⬇️ REPLACE THE ENTIRE FILE WITH THIS CODE ⬇️

import { sendEmail } from '@/lib/actions/send-email';

// *** THE FIX: Declare mocks BEFORE jest.mock call ***
const mockSendMail = jest.fn();
const mockCreateTransport = jest.fn(() => ({
  sendMail: mockSendMail,
}));

jest.mock('nodemailer', () => ({
  createTestAccount: jest.fn().mockResolvedValue({ user: 'test_user', pass: 'test_pass' }),
  createTransport: mockCreateTransport,
  getTestMessageUrl: jest.fn(),
}));

describe('sendEmail action', () => {
  it('should call the transporter to send an email', async () => {
    // This is a placeholder test. Your actual tests will go here.
    mockSendMail.mockResolvedValue({ messageId: 'test-id' });
    await sendEmail({ to: 'test@test.com', subject: 'hi', html: 'body' });
    expect(mockCreateTransport).toHaveBeenCalled();
    expect(mockSendMail).toHaveBeenCalled();
  });
});

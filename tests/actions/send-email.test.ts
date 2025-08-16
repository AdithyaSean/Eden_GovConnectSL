
import { sendEmail } from '@/lib/actions/send-email';
import nodemailer from 'nodemailer';

// Mock nodemailer
const mockSendMail = jest.fn();

jest.mock('nodemailer', () => ({
  createTestAccount: jest.fn().mockResolvedValue({
    user: 'test_user',
    pass: 'test_pass',
  }),
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail,
  })),
  getTestMessageUrl: jest.fn((info) => `http://ethereal.email/preview/${info.messageId}`),
}));

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('sendEmail Server Action', () => {
  
  beforeEach(() => {
    mockSendMail.mockClear();
    (nodemailer.createTransport as jest.Mock).mockClear();
  });

  it('should send an email successfully using a test account', async () => {
    // Mock sendMail to return a successful response
    mockSendMail.mockResolvedValueOnce({ messageId: 'test-message-id' });

    const result = await sendEmail({
      to: 'recipient@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>',
    });

    // Check if createTransport was called and sendMail was called with the right options
    expect(nodemailer.createTransport).toHaveBeenCalled();
    expect(mockSendMail).toHaveBeenCalledWith({
      from: '"GovConnect SL" <noreply@govconnect.lk>',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>',
    });

    // Check the result
    expect(result.success).toBe(true);
    expect(result.messageId).toBe('test-message-id');
    expect(result.previewUrl).toContain('test-message-id');
  });

  it('should handle email sending failure', async () => {
    const error = new Error('Failed to send email');
    mockSendMail.mockRejectedValueOnce(error);

    const result = await sendEmail({
      to: 'recipient@example.com',
      subject: 'Failure Test',
      html: '<p>This should fail</p>',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Error sending email');
  });

   it('should use environment variables for Gmail if available', async () => {
    process.env.EMAIL_USER = 'test@gmail.com';
    process.env.EMAIL_PASS = 'testpassword';

    mockSendMail.mockResolvedValueOnce({ messageId: 'gmail-test-id' });
    
    const result = await sendEmail({
      to: 'recipient@example.com',
      subject: 'Gmail Test',
      html: '<p>Test Gmail</p>',
    });

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'test@gmail.com',
        pass: 'testpassword',
      },
    });
    expect(result.success).toBe(true);

    // Clean up env variables
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;
  });

});

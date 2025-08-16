
import { sendEmail } from '@/lib/actions/send-email';
import nodemailer from 'nodemailer';

// Mock nodemailer
const mockSendMail = jest.fn();
const mockCreateTransport = jest.fn(() => ({ sendMail: mockSendMail }));

jest.mock('nodemailer', () => ({
  createTestAccount: jest.fn().mockResolvedValue({
    user: 'test_user',
    pass: 'test_pass',
  }),
  createTransport: mockCreateTransport,
  getTestMessageUrl: jest.fn((info) => `http://ethereal.email/preview/${info.messageId}`),
}));

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('sendEmail Server Action', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // Resets module registry to ensure env changes are picked up
    process.env = { ...originalEnv }; // Reset env to original state
    mockSendMail.mockClear();
    mockCreateTransport.mockClear();
  });

  afterEach(() => {
    process.env = originalEnv; // Restore original env vars
  });

  it('should send an email successfully using a test account when env vars are missing', async () => {
    // Ensure env variables are not set for this test
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;
    
    // Mock sendMail to return a successful response
    mockSendMail.mockResolvedValueOnce({ messageId: 'test-message-id' });

    const result = await sendEmail({
      to: 'recipient@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>',
    });

    // Check if createTransport was called with Ethereal config
    expect(mockCreateTransport).toHaveBeenCalledWith(expect.objectContaining({
        host: 'smtp.ethereal.email'
    }));
    expect(mockSendMail).toHaveBeenCalledWith({
      from: '"GovConnect SL" <noreply@govconnect.lk>',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>',
    });

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
    // Arrange: Set the environment variables for this test
    process.env.EMAIL_USER = 'test@gmail.com';
    process.env.EMAIL_PASS = 'testpassword';
    
    mockSendMail.mockResolvedValueOnce({ messageId: 'gmail-test-id' });
    
    // Act
    await sendEmail({
      to: 'recipient@example.com',
      subject: 'Gmail Test',
      html: '<p>Test Gmail</p>',
    });

    // Assert
    expect(mockCreateTransport).toHaveBeenCalledWith({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'test@gmail.com',
        pass: 'testpassword',
      },
    });
  });
});

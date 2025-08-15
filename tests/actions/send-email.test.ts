import { sendEmail } from '@/lib/actions/send-email';
import nodemailer from 'nodemailer';

// Mock the entire nodemailer library
jest.mock('nodemailer');

const mockSendMail = jest.fn();

describe('sendEmail Server Action', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup the mock implementation for createTransport and sendMail
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: mockSendMail,
    });
    
    // Mock the test account generation for the fallback case
    (nodemailer.createTestAccount as jest.Mock).mockResolvedValue({
        user: 'testuser@ethereal.email',
        pass: 'testpass',
        smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
        web: 'https://ethereal.email/'
    });

    // Mock getTestMessageUrl to prevent errors
    (nodemailer.getTestMessageUrl as jest.Mock).mockReturnValue('http://ethereal.preview/url');

  });

  it('should send an email successfully using Gmail credentials', async () => {
    // Set up environment variables for this test case
    process.env.EMAIL_USER = 'test@gmail.com';
    process.env.EMAIL_PASS = 'testpassword';
    
    mockSendMail.mockResolvedValueOnce({ messageId: '123' });

    const result = await sendEmail({
      to: 'recipient@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>',
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBe('123');
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'test@gmail.com',
          pass: 'testpassword',
        },
    });
    expect(mockSendMail).toHaveBeenCalledWith({
      from: '"GovConnect SL" <test@gmail.com>',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>',
    });

    // Clean up env vars
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;
  });

  it('should fall back to Ethereal and send an email successfully if credentials are not set', async () => {
    // Ensure env vars are not set
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;
    
    mockSendMail.mockResolvedValueOnce({ messageId: '456' });

    const result = await sendEmail({
      to: 'recipient@example.com',
      subject: 'Ethereal Test',
      html: '<p>Ethereal HTML</p>',
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBe('456');
    expect(nodemailer.createTestAccount).toHaveBeenCalled();
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, 
        auth: {
          user: 'testuser@ethereal.email', 
          pass: 'testpass',
        },
    });
  });

  it('should return an error if sending fails', async () => {
    process.env.EMAIL_USER = 'test@gmail.com';
    process.env.EMAIL_PASS = 'testpassword';
    
    const testError = new Error('Failed to send');
    mockSendMail.mockRejectedValueOnce(testError);

    const result = await sendEmail({
      to: 'recipient@example.com',
      subject: 'Failure Test',
      html: '<p>This should not send</p>',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Error sending email');

    // Clean up env vars
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;
  });

});

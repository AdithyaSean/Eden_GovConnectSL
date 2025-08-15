'use server';

import nodemailer from 'nodemailer';
import { config } from 'dotenv';

// Explicitly load environment variables from .env file
config();

// This is a basic setup for sending emails.
// In a real production app, you would use environment variables for credentials and a robust email service.
// For this prototype, we use Ethereal to generate a test account and preview emails.

// Singleton transporter instance
let transporter;

async function getTransporter() {
  if (transporter) {
    return transporter;
  }

  // Ensure environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email credentials (EMAIL_USER, EMAIL_PASS) are not set in your .env file.');
    // In development, you might want to fall back to Ethereal or throw an error.
    // For this example, we'll try to create a test account if credentials are missing.
    try {
        let testAccount = await nodemailer.createTestAccount();
        console.log('Falling back to Ethereal test account:', testAccount.user);

        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
          },
        });
        return transporter;
    } catch (error) {
        console.error('Could not create email test account', error);
        return null;
    }
  }

  // Use Gmail transporter
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use the App Password here
    },
  });

  return transporter;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const mailer = await getTransporter();
  if (!mailer) {
    console.error('Email transporter is not available. Email not sent.');
    return { success: false, error: 'Email transporter not configured.' };
  }

  const mailOptions = {
    from: `"GovConnect SL" <${process.env.EMAIL_USER || 'noreply@govconnect.lk'}>`,
    to,
    subject,
    html,
  };

  try {
    let info = await mailer.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    // If using Ethereal, log the preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Preview URL: %s', previewUrl);
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email: ', error);
    return { success: false, error: 'Failed to send email.' };
  }
}

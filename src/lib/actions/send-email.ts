'use server';

import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

// Singleton transporter instance
let transporter;

async function getTransporter() {
  if (transporter) {
    return transporter;
  }

  // Use Ethereal for testing
  try {
      let testAccount = await nodemailer.createTestAccount();
      console.log('Using Ethereal test account:', testAccount.user);

      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, 
        auth: {
          user: testAccount.user, 
          pass: testAccount.pass,
        },
      });
      return transporter;
  } catch (error) {
      console.error('Could not create email test account', error);
      return null;
  }
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
    from: `"GovConnect SL" <noreply@govconnect.lk>`,
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
    
    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error('Error sending email: ', error);
    return { success: false, error: `Error sending email: ${error}` };
  }
}

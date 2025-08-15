'use server';

import nodemailer from 'nodemailer';

// This is a basic setup for sending emails.
// In a real production app, you would use environment variables for credentials and a robust email service.
// For this prototype, we use Ethereal to generate a test account and preview emails.

// Singleton transporter instance
let transporter;

async function getTransporter() {
  if (transporter) {
    return transporter;
  }

  try {
    // Generate a test account on Ethereal
    let testAccount = await nodemailer.createTestAccount();
    console.log('Ethereal test account created:', testAccount.user);

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
    // In a real app, you might want to throw an error or handle this case more robustly.
    return { success: false, error: 'Email transporter not configured.' };
  }

  const mailOptions = {
    from: '"GovConnect SL" <noreply@govconnect.lk>',
    to,
    subject,
    html,
  };

  try {
    let info = await mailer.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    // You can get the preview URL from this command
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email: ', error);
    return { success: false, error: 'Failed to send email.' };
  }
}

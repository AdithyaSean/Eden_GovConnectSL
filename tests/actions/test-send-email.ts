import { config } from 'dotenv';
// Load environment variables from a .env file into process.env
config({ path: '.env' }); 

import { sendEmail } from '../../src/lib/actions/send-email';

async function runTest() {
  console.log("Running email sending test...");

  if (!process.env.EMAIL_USER) {
      console.error("\n❌ Test FAILED. EMAIL_USER environment variable is not set.");
      console.log("   Please create a .env file in the root directory and add your email credentials.");
      return;
  }

  const result = await sendEmail({
    to: "test.recipient@example.com",
    subject: `GovConnect SL Email Test from ${process.env.EMAIL_USER}`,
    html: `
      <h1>Test Email</h1>
      <p>This is a test email sent from the test script using your configured Gmail account.</p>
      <p>If you see this, the nodemailer configuration and sendEmail action are working correctly.</p>
    `,
  });

  if (result.success) {
    console.log("\n✅ Test PASSED. Email sent successfully.");
    console.log("   Message ID:", result.messageId);
    console.log("   Check the inbox of 'test.recipient@example.com' (or your own email if you changed it).");
  } else {
    console.error("\n❌ Test FAILED.", result.error);
  }
}

runTest();

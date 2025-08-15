import { config } from 'dotenv';
// Load environment variables from a .env file into process.env
config({ path: '.env' }); 

import { sendEmail } from '../../src/lib/actions/send-email';

async function runTest() {
  console.log("Running email sending test...");

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("\n❌ Test FAILED. EMAIL_USER and/or EMAIL_PASS environment variables are not set.");
      console.log("   Please ensure your .env file is correctly set up in the root directory.");
      return;
  }

  const result = await sendEmail({
    to: "adithaysean@gmail.com",
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
    console.log("   Check the inbox of 'adithaysean@gmail.com'.");
  } else {
    console.error("\n❌ Test FAILED.", result.error);
  }
}

runTest();

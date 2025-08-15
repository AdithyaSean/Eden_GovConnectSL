import { config } from 'dotenv';
// Load environment variables from a .env file into process.env
config({ path: '.env' }); 

import { sendEmail } from '../../src/lib/actions/send-email';

async function runTest() {
  console.log("Running email sending test...");

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("\n⚠️  EMAIL_USER and/or EMAIL_PASS not set in .env file. Falling back to Ethereal test account.");
  }

  const result = await sendEmail({
    to: "test-recipient@example.com",
    subject: `GovConnect SL Email Test`,
    html: `
      <h1>Test Email</h1>
      <p>This is a test email sent from the test script.</p>
      <p>If you see this, the nodemailer configuration and sendEmail action are working correctly.</p>
    `,
  });

  if (result.success) {
    console.log("\n✅ Test PASSED. Email sent successfully.");
    if (result.previewUrl) {
        console.log("   Preview URL:", result.previewUrl);
    } else {
        console.log("   Check the inbox of 'adithaysean@gmail.com'.");
    }
  } else {
    console.error("\n❌ Test FAILED.", result.error);
  }
}

runTest();

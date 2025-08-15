
import { sendEmail } from '../../src/lib/actions/send-email';

async function runTest() {
  console.log("Running email sending test...");

  const result = await sendEmail({
    to: "test.recipient@example.com",
    subject: "GovConnect SL Email Test",
    html: `
      <h1>Test Email</h1>
      <p>This is a test email sent from the test script.</p>
      <p>If you see this, the nodemailer configuration and sendEmail action are working correctly.</p>
    `,
  });

  if (result.success) {
    console.log("\n✅ Test PASSED. Email sent successfully.");
    console.log("   Message ID:", result.messageId);
    console.log("   Check the server console output from the running application for the Ethereal preview link.");
  } else {
    console.error("\n❌ Test FAILED.", result.error);
  }
}

runTest();

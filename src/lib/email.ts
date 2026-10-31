/**
 * Email Verification Service for Digital Taqwa
 * Supports Resend API with automatic fallback to development simulation mode.
 */

interface SendVerificationOptions {
  toEmail: string;
  name?: string;
  verificationToken: string;
}

export async function sendVerificationEmail({
  toEmail,
  name,
  verificationToken,
}: SendVerificationOptions): Promise<{ success: boolean; devUrl?: string; error?: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verificationUrl = `${baseUrl}/verify?token=${verificationToken}`;
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || "Digital Taqwa <onboarding@digitaltaqwa.com>";

  const displayName = name ? name.trim() : "Brother/Sister";

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Verify your Digital Taqwa Early Access</title>
  <style>
    body {
      background-color: #090A09;
      color: #F7F5EF;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 40px 20px;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background-color: #111310;
      border: 1px solid rgba(214, 181, 109, 0.25);
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    .logo {
      font-size: 20px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #D6B56D;
      font-weight: 700;
      text-align: center;
      margin-bottom: 30px;
    }
    h1 {
      font-size: 24px;
      color: #F7F5EF;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.3;
      text-align: center;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      color: #A5A69E;
      margin-bottom: 24px;
    }
    .cta-container {
      text-align: center;
      margin: 35px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #D6B56D 0%, #E8D6AC 100%);
      color: #090A09;
      font-weight: 700;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 15px;
      letter-spacing: 0.02em;
    }
    .footnote {
      font-size: 13px;
      color: #6E7067;
      text-align: center;
      border-top: 1px solid rgba(214, 181, 109, 0.1);
      padding-top: 24px;
      margin-top: 35px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Digital Taqwa</div>
    <h1>Verify Your Early Access</h1>
    <p>Assalamu Alaikum ${displayName},</p>
    <p>
      Thank you for joining the <strong>Digital Taqwa</strong> early access waitlist. 
      Your valuable feedback helps us build an intentional companion designed to foster consistency in your Deen and reduce digital distractions.
    </p>
    <p>Please confirm your email address to ensure your spot is reserved in our upcoming private beta cohort.</p>
    
    <div class="cta-container">
      <a href="${verificationUrl}" class="btn" target="_blank">Confirm Waitlist Spot</a>
    </div>

    <p style="font-size: 13px; color: #6E7067;">
      If the button above does not work, copy and paste this link into your browser:<br/>
      <a href="${verificationUrl}" style="color: #D6B56D; word-break: break-all;">${verificationUrl}</a>
    </p>

    <div class="footnote">
      <p>Digital Taqwa — Reconnect With Allah. One Day at a Time.<br/>
      If you did not request this, you can safely disregard this email.</p>
    </div>
  </div>
</body>
</html>
`;

  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: toEmail,
          subject: "Confirm your Digital Taqwa early access reservation",
          html: emailHtml,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Resend API failed:", errorText);
        return { success: false, error: errorText, devUrl: verificationUrl };
      }

      return { success: true };
    } catch (err: any) {
      console.error("Failed to send verification email via Resend:", err);
      return { success: false, error: err.message, devUrl: verificationUrl };
    }
  }

  // Development mode fallback
  console.log("--------------------------------------------------");
  console.log("📧 [DEV EMAIL MODE] Email verification link generated:");
  console.log(`To: ${toEmail}`);
  console.log(`Verification URL: ${verificationUrl}`);
  console.log("--------------------------------------------------");

  return {
    success: true,
    devUrl: verificationUrl,
  };
}


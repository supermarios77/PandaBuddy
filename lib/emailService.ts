import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, body: string) {
  try {
    const data = await resend.emails.send({
      from: 'Panda Buddy <onboarding@resend.dev>',
      to: "pandabuddy277@gmail.com",
      subject: subject,
      html: body,
    });

    console.log('Email sent successfully:', data);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendParentalConsentEmail(parentEmail: string, userId: string) {
  const subject = 'Parental Consent Required for Panda Buddy';
  const consentLink = `${process.env.NEXT_PUBLIC_APP_URL}/parental-consent?userId=${userId}`;
  
  const body = `
    <html>
      <body>
        <h1>Parental Consent Required for Panda Buddy</h1>
        <p>Dear Parent,</p>
        <p>Your child has signed up for Panda Buddy, an educational platform designed to make learning fun and engaging. As your child is under 13, we require your consent for them to use our service.</p>
        <p>Please click the button below to review and provide your consent:</p>
        <a href="${consentLink}" style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Review and Provide Consent</a>
        <p>If you approve, your child will be able to access age-appropriate content and features on Panda Buddy. You can manage your child's account settings, including voice chat permissions, at any time.</p>
        <p>If you do not wish to provide consent, no further action is required, and your child's account will be limited to a safe "play area" with restricted features.</p>
        <p>Thank you for helping us create a safe and enriching environment for young learners.</p>
        <p>Best regards,<br>The Panda Buddy Team</p>
      </body>
    </html>
  `;

  try {
    await sendEmail(parentEmail, subject, body);
    console.log('Parental consent email sent successfully');
  } catch (error) {
    console.error('Error sending parental consent email:', error);
    throw error;
  }
}
import nodemailer from 'nodemailer';

async function getTransporter() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  const account = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: { user: account.user, pass: account.pass },
  });
  return transporter;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  if (process.env.NODE_ENV === 'test') return;

  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM ?? 'noreply@welltrack.app',
    to,
    subject: 'Reset your WellTrack password',
    text: `Click the link to reset your password (expires in 1 hour):\n\n${resetUrl}`,
    html: `<p>Click the link to reset your password (expires in 1 hour):</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });

  if (!process.env.SMTP_HOST) {
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  }
}

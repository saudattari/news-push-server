// api/sendEmail.js
import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: 'Missing RESEND_API_KEY in env' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const response = await resend.emails.send({
      from: 'Your Name <mohammadsaudattari@gmail.com>',
      to,
      subject,
      html: `<p>${message}</p>`,
    });

    return res.status(200).json({ success: true, data: response });
  } catch (err) {
    console.error('Email send failed:', err);
    return res.status(500).json({ error: err.message || 'Failed to send email' });
  }
}

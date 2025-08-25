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
    // 🔑 Directly using your key (not recommended for production)
    const resend = new Resend("re_jVPmNc73_AM5kSG1RDqND9iWhV3ATCLLj");

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

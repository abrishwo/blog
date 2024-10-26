import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body;

    // Nodemailer transport setup
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,      // e.g., "smtp.starsandtoques.com"
      port: parseInt(process.env.SMTP_PORT) || 587, // Use `parseInt` to make sure the port is a number
      secure: process.env.SMTP_PORT == 465, // Set to true if using port 465
      auth: {
        user: process.env.EMAIL_USER,    // e.g., "contact@starsandtoques.com"
        pass: process.env.EMAIL_PASS,    // Password or App-Specific Password
      },
      tls: {
        rejectUnauthorized: false, // Optional, set to true in production for enhanced security
      },
    });

    // Email content
    const mailOptions = {
      from: `"${name}" <${email}>`, // Displays user's email and name in the "From" field
      to: process.env.RECEIVER_EMAIL, // Your receiving email
      subject: `New Message from ${name}: ${subject}`, // Customized subject line
      html: `
        <h3>Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `, // Uses HTML formatting for better readability
    };

    try {
      // Send the email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

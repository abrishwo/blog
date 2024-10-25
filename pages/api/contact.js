import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  /*


  {
  host: "smtp.starsandtoques.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "contact@starsandtoques.com",
    pass: "jn7jnAPss4f63QBp6D",
  },
}

*/


  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body;
    // const {body, hdrs} = req.body;

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      // service: 'gmail', // You can use other services like Yahoo, Outlook, etc.
      host: 'smtp.enatsoft.com',
      port: 465, // SMTP port (587 for Gmail)
      secure: true, // true for port 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Your email address (from environment variable)
        pass: process.env.EMAIL_PASS, // Your email password (or app-specific password)
      },
    });

    // Email content
    const mailOptions = {
      from: `"${name}" ${email}`, // Sender's email (user's email from form)
      to: process.env.RECEIVER_EMAIL, // Your email address (receiver)
      subject: `New Message: ${subject}`,
    //   text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `${message}`
    };

    try {
      // Send email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending email', error);
      res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

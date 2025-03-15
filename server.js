const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

// Route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/send-email', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  // Configure transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or any other email service
    auth: {
      user: 'ericdiasblu@gmail.com', // your email
      pass: 'your-app-password' // Use app password if using Gmail
    }
  });
  
  // Setup email data
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'ericdiasblu@gmail.com', // where you want to receive emails
    subject: `Portfolio Contact: ${subject}`,
    html: `
      <h3>New message from your portfolio website</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
    `
  };
  
  try {
    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
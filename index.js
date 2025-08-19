// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { injectSpeedInsights } = require('@vercel/speed-insights');
const emailService = require('./services/emailService');

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Speed Insights
injectSpeedInsights();

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio Contact API is running!',
    version: '1.0.0',
    endpoints: {
      contact: 'POST /api/contact',
      sendEmail: 'POST /api/send-email',
      health: 'GET /',
      config: 'GET /api/config'
    }
  });
});

// Configuration check endpoint
app.get('/api/config', (req, res) => {
  const configStatus = emailService.getConfigurationStatus();
  res.json({
    success: true,
    configuration: configStatus,
    message: configStatus.isConfigured 
      ? 'Email service is properly configured' 
      : 'Email service is not configured. Please check your .env file.'
  });
});

// Portfolio Contact Form API endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, and message are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Create email content
    const subject = `Portfolio Contact: ${name}`;
    const html = `
      <h2>New Contact Message from Portfolio</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Sent from your portfolio contact form</small></p>
    `;
    const text = `
New Contact Message from Portfolio

Name: ${name}
Email: ${email}
Message: ${message}

Sent from your portfolio contact form
    `;

    // Get your email from environment or Firebase config
    const yourEmail = process.env.YOUR_EMAIL || 
                     process.env.GMAIL_USER || 
                     (process.env.FIREBASE_CONFIG && JSON.parse(process.env.FIREBASE_CONFIG).functions?.gmail?.your_email);
    
    // Send email to your email address
    const result = await emailService.sendEmail({
      to: yourEmail,
      subject: subject,
      text: text,
      html: html,
      from: process.env.GMAIL_USER
    });

    res.json({
      success: true,
      message: 'Message sent successfully! I\'ll get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again later.'
    });
  }
});

// Email API endpoint (for general use)
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, text, html, from } = req.body;

    // Validation
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, and either text or html are required'
      });
    }

    // Send email
    const result = await emailService.sendEmail({
      to,
      subject,
      text,
      html,
      from: from || process.env.DEFAULT_FROM_EMAIL
    });

    res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Email service running on port ${PORT}`);
    console.log(`📧 Send emails to: http://localhost:${PORT}/api/send-email`);
  });
}

// Export for Vercel
module.exports = app;

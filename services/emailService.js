const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Get credentials from environment or Firebase config
    const gmailUser = process.env.GMAIL_USER || 
                     (process.env.FIREBASE_CONFIG && JSON.parse(process.env.FIREBASE_CONFIG).functions?.gmail?.user);
    const gmailPassword = process.env.GMAIL_APP_PASSWORD || 
                         (process.env.FIREBASE_CONFIG && JSON.parse(process.env.FIREBASE_CONFIG).functions?.gmail?.password);
    
    // Check if environment variables are set
    if (!gmailUser || !gmailPassword) {
      console.error('❌ Gmail credentials not found. Please set GMAIL_USER and GMAIL_APP_PASSWORD in your .env file or Firebase config.');
      console.error('📧 To set up Gmail App Password:');
      console.error('   1. Go to your Google Account settings');
      console.error('   2. Enable 2-factor authentication');
      console.error('   3. Generate an App Password for this application');
      console.error('   4. Add to your .env file: GMAIL_APP_PASSWORD=your-app-password');
      return;
    }

    // Create transporter using Gmail SMTP
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword // Use App Password, not regular password
      },
      secure: true,
      port: 465
    });

    // Verify transporter configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email transporter verification failed:', error);
      } else {
        console.log('✅ Email server is ready to send real messages');
      }
    });
  }

  async sendEmail({ to, subject, text, html, from }) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized. Please check your Gmail credentials in the .env file. Make sure GMAIL_USER and GMAIL_APP_PASSWORD are set correctly.');
      }

      // Email options
      const mailOptions = {
        from: from || process.env.DEFAULT_FROM_EMAIL || process.env.GMAIL_USER,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject: subject,
        text: text,
        html: html
      };

      // Send email
      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('📧 Real email sent successfully:', {
        messageId: result.messageId,
        to: to,
        subject: subject
      });

      return result;

    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw error;
    }
  }

  // Method to send HTML email with template
  async sendTemplateEmail({ to, subject, template, data, from }) {
    try {
      let html = template;
      
      // Simple template replacement
      if (data) {
        Object.keys(data).forEach(key => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          html = html.replace(regex, data[key]);
        });
      }

      return await this.sendEmail({
        to,
        subject,
        html,
        from
      });

    } catch (error) {
      console.error('❌ Template email sending failed:', error);
      throw error;
    }
  }

  // Method to send bulk emails
  async sendBulkEmails(emails) {
    try {
      const results = [];
      
      for (const email of emails) {
        try {
          const result = await this.sendEmail(email);
          results.push({ success: true, email: email.to, messageId: result.messageId });
        } catch (error) {
          results.push({ success: false, email: email.to, error: error.message });
        }
      }

      return results;

    } catch (error) {
      console.error('❌ Bulk email sending failed:', error);
      throw error;
    }
  }

  // Method to check if email service is properly configured
  isConfigured() {
    return this.transporter !== null;
  }

  // Method to get configuration status
  getConfigurationStatus() {
    return {
      isConfigured: this.isConfigured(),
      hasGmailUser: !!process.env.GMAIL_USER,
      hasGmailPassword: !!process.env.GMAIL_APP_PASSWORD,
      transporter: this.transporter ? 'Initialized' : 'Not initialized'
    };
  }
}

module.exports = new EmailService();

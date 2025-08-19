# 📧 Portfolio Contact Form API

Simple API service for your portfolio contact form. When visitors fill out your contact form, you'll receive an email with their message.

## 🚀 Quick Setup

### 1. Set up Gmail App Password
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Enable 2-Factor Authentication
3. Go to Security → App passwords
4. Generate a new app password for "Mail"
5. Copy the 16-character password

### 2. Configure Environment
Edit your `.env` file:
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-digit-app-password
YOUR_EMAIL=your-email@gmail.com
```

### 3. Start the Server
```bash
npm run dev
```

### 4. Test the Contact Form
Visit: `http://localhost:3000/contact-test.html`

## 📡 API Usage

### Contact Form Endpoint
```http
POST /api/contact
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "message": "Hi! I'd like to discuss a project with you."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully! I'll get back to you soon."
}
```

## 🔧 Frontend Integration

### JavaScript Example
```javascript
async function sendContactForm(name, email, message) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Message sent successfully!');
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    alert('Failed to send message');
  }
}
```

### React Example
```jsx
const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      setStatus(result.success ? 'success' : 'error');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <textarea
        placeholder="Message"
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
        required
      />
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
      
      {status === 'success' && <p>Message sent successfully!</p>}
      {status === 'error' && <p>Failed to send message</p>}
    </form>
  );
};
```

## 🚀 Deploy to Firebase (Free)

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Deploy: `npm run deploy`
4. Your API will be live at: `https://your-region-your-project.cloudfunctions.net/emailService`

## 📧 Email Format

When someone submits the contact form, you'll receive an email like this:

**Subject:** Portfolio Contact: John Doe

**Body:**
```
New Contact Message from Portfolio

Name: John Doe
Email: john@example.com
Message: Hi! I'd like to discuss a project with you.

Sent from your portfolio contact form
```

## 🔍 Troubleshooting

- **"Email transporter not initialized"**: Check your `.env` file and Gmail credentials
- **"Invalid login"**: Make sure you're using an App Password, not your regular Gmail password
- **CORS errors**: The API includes CORS headers for web applications

## 📝 Notes

- Gmail free tier allows 500 emails per day
- Messages are sent from your Gmail account to your email
- The API includes input validation and error handling
- CORS is enabled for web applications

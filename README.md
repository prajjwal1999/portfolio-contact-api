# 📧 Free Email Service API

A production-ready Node.js email service API that can send emails for free using Gmail SMTP and deploy on Firebase Functions.

## 🚀 Features

- ✅ Send emails using Gmail SMTP
- ✅ Support for text and HTML emails
- ✅ Template email support
- ✅ Bulk email sending
- ✅ Free deployment on Firebase Functions
- ✅ CORS enabled for web applications
- ✅ Comprehensive error handling
- ✅ Health check endpoint
- ✅ Production-ready API design

## 📋 Prerequisites

1. **Gmail Account**: You need a Gmail account
2. **App Password**: Generate an App Password for your Gmail account
3. **Firebase Account**: For free deployment
4. **Node.js**: Version 18 or higher

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo>
cd email-service
npm install
```

### 2. Gmail App Password Setup

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → App passwords
4. Generate a new app password for "Mail"
5. Copy the generated password

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Edit `.env` with your Gmail credentials:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-digit-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com
NODE_ENV=development
PORT=3000
```

### 4. Test Locally

```bash
npm run dev
```

Test the API at `http://localhost:3000/api/send-email`

## 📡 API Documentation

### Base URL
- **Local**: `http://localhost:3000`
- **Firebase**: `https://your-region-your-project.cloudfunctions.net/emailService`

### Endpoints

#### 1. Health Check
```http
GET /
```

**Response:**
```json
{
  "message": "Email Service API is running!",
  "version": "1.0.0",
  "endpoints": {
    "sendEmail": "POST /api/send-email",
    "health": "GET /"
  }
}
```

#### 2. Send Email
```http
POST /api/send-email
Content-Type: application/json
```

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Test Email",
  "text": "This is a plain text email",
  "html": "<h1>This is an HTML email</h1>",
  "from": "sender@example.com" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<message-id>"
}
```

### Example Usage

#### Using cURL
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Hello from API",
    "text": "This is a test email from our API"
  }'
```

#### Using JavaScript/Fetch
```javascript
const response = await fetch('http://localhost:3000/api/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'recipient@example.com',
    subject: 'Test Email',
    text: 'Hello from the API!',
    html: '<h1>Hello from the API!</h1>'
  })
});

const result = await response.json();
console.log(result);
```

#### Using Axios
```javascript
const axios = require('axios');

const response = await axios.post('http://localhost:3000/api/send-email', {
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'Hello from the API!'
});

console.log(response.data);
```

#### Using Python/Requests
```python
import requests

response = requests.post('http://localhost:3000/api/send-email', json={
    'to': 'recipient@example.com',
    'subject': 'Test Email',
    'text': 'Hello from the API!'
})

print(response.json())
```

## 🚀 Deploy to Firebase Functions (Free)

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase Project
```bash
firebase init functions
```
- Select your project or create a new one
- Choose JavaScript
- Say NO to ESLint
- Say YES to installing dependencies

### 4. Update Project ID
Edit `.firebaserc` and replace `your-firebase-project-id` with your actual Firebase project ID.

### 5. Set Environment Variables in Firebase
```bash
firebase functions:config:set gmail.user="your-email@gmail.com"
firebase functions:config:set gmail.password="your-app-password"
firebase functions:config:set gmail.default_from="your-email@gmail.com"
```

### 6. Deploy
```bash
npm run deploy
```

### 7. Your API is Live!
Your email service will be available at:
```
https://your-region-your-project.cloudfunctions.net/emailService
```

## 🔧 Advanced Features

### Template Emails
```javascript
const emailService = require('./services/emailService');

await emailService.sendTemplateEmail({
  to: 'user@example.com',
  subject: 'Welcome!',
  template: '<h1>Welcome {{name}}!</h1><p>Your account is ready.</p>',
  data: { name: 'John Doe' }
});
```

### Bulk Emails
```javascript
const emails = [
  { to: 'user1@example.com', subject: 'Newsletter', text: 'Content 1' },
  { to: 'user2@example.com', subject: 'Newsletter', text: 'Content 2' }
];

const results = await emailService.sendBulkEmails(emails);
```

## 🆓 Firebase Functions Free Tier

- **2 million invocations per month**
- **400,000 GB-seconds of compute time**
- **200,000 CPU-seconds of compute time**
- **5GB of outbound networking per month**

This is more than enough for most email service needs!

## 🔒 Security Notes

1. **Never commit your `.env` file**
2. **Use App Passwords, not regular Gmail passwords**
3. **Set up proper CORS for production**
4. **Consider rate limiting for production use**

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid login" error**: Make sure you're using an App Password, not your regular Gmail password
2. **"Less secure app access" error**: Enable 2-Factor Authentication and use App Passwords
3. **CORS errors**: The API includes CORS headers, but you may need to configure your frontend

### Gmail Limits
- **Daily sending limit**: 500 emails per day (Gmail free tier)
- **Rate limit**: 100 emails per hour
- **Message size**: 25MB

## 📝 License

MIT License - feel free to use this project for your own applications!

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

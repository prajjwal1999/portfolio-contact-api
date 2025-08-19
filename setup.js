#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('📧 Email Service Setup\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found. Creating from template...');
  const envExamplePath = path.join(__dirname, 'env.example');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created from template');
  } else {
    console.log('❌ env.example not found. Please create a .env file manually.');
    process.exit(1);
  }
}

// Read current .env file
let envContent = fs.readFileSync(envPath, 'utf8');

// Check if credentials are still placeholder values
const hasPlaceholderCredentials = envContent.includes('your-email@gmail.com') || 
                                 envContent.includes('your-app-password');

if (hasPlaceholderCredentials) {
  console.log('⚠️  Gmail credentials are not configured yet.\n');
  console.log('📋 To set up Gmail App Password:');
  console.log('   1. Go to your Google Account settings (https://myaccount.google.com/)');
  console.log('   2. Enable 2-factor authentication if not already enabled');
  console.log('   3. Go to Security → App passwords');
  console.log('   4. Generate a new app password for "Mail"');
  console.log('   5. Copy the generated 16-character password\n');
  
  console.log('🔧 Would you like to configure your Gmail credentials now? (y/n)');
  
  rl.question('', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      configureCredentials();
    } else {
      console.log('\n📝 You can manually edit the .env file with your Gmail credentials.');
      console.log('   Run this script again when you\'re ready to configure.');
      rl.close();
    }
  });
} else {
  console.log('✅ Gmail credentials appear to be configured.');
  console.log('🚀 You can now start the email service with: npm run dev');
  rl.close();
}

function configureCredentials() {
  console.log('\n📧 Enter your Gmail address:');
  rl.question('', (email) => {
    if (!email.includes('@gmail.com')) {
      console.log('❌ Please enter a valid Gmail address.');
      rl.close();
      return;
    }
    
    console.log('🔑 Enter your Gmail App Password (16 characters):');
    rl.question('', (password) => {
      if (password.length !== 16) {
        console.log('❌ App Password should be 16 characters long.');
        rl.close();
        return;
      }
      
      // Update .env file
      envContent = envContent.replace(/GMAIL_USER=.*/, `GMAIL_USER=${email}`);
      envContent = envContent.replace(/GMAIL_APP_PASSWORD=.*/, `GMAIL_APP_PASSWORD=${password}`);
      envContent = envContent.replace(/DEFAULT_FROM_EMAIL=.*/, `DEFAULT_FROM_EMAIL=${email}`);
      
      fs.writeFileSync(envPath, envContent);
      
      console.log('\n✅ Gmail credentials configured successfully!');
      console.log('🚀 You can now start the email service with: npm run dev');
      console.log('🔍 Test the configuration with: curl http://localhost:3000/api/config');
      
      rl.close();
    });
  });
}

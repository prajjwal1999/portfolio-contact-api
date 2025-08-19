#!/bin/bash

echo "🧪 Testing Portfolio Contact API"
echo "=================================="

# Test 1: Health check
echo -e "\n1️⃣ Testing health endpoint..."
curl -s http://localhost:3000/ | jq .

# Test 2: Configuration check
echo -e "\n2️⃣ Testing configuration..."
curl -s http://localhost:3000/api/config | jq .

# Test 3: Valid contact form
echo -e "\n3️⃣ Testing valid contact form..."
curl -s -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message from curl"
  }' | jq .

# Test 4: Missing fields
echo -e "\n4️⃣ Testing missing fields..."
curl -s -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com"
  }' | jq .

# Test 5: Invalid email
echo -e "\n5️⃣ Testing invalid email..."
curl -s -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "message": "This should fail"
  }' | jq .

echo -e "\n✅ All tests completed!"

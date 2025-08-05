#!/bin/bash

echo "🧪 Munus Deployment Test Script"
echo "==============================="

# Get Railway domain from user
echo "Enter your Railway domain (e.g., https://your-app.railway.app):"
read RAILWAY_DOMAIN

if [ -z "$RAILWAY_DOMAIN" ]; then
    echo "❌ No domain provided!"
    exit 1
fi

echo ""
echo "🔍 Testing backend deployment..."
echo "================================"

# Test health endpoint
echo "1. Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "$RAILWAY_DOMAIN/health")
if [[ $HEALTH_RESPONSE == *"healthy"* ]]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    echo "Response: $HEALTH_RESPONSE"
fi

# Test API health endpoint
echo ""
echo "2. Testing API health endpoint..."
API_HEALTH_RESPONSE=$(curl -s "$RAILWAY_DOMAIN/api/v1/health/healthz")
if [[ $API_HEALTH_RESPONSE == *"ok"* ]]; then
    echo "✅ API health check passed"
else
    echo "❌ API health check failed"
    echo "Response: $API_HEALTH_RESPONSE"
fi

# Test registration endpoint
echo ""
echo "3. Testing registration endpoint..."
REG_RESPONSE=$(curl -s -X POST "$RAILWAY_DOMAIN/api/v1/auth/register/" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@deployment.com","password":"test123","name":"Test User","role":"jobseeker"}' 2>/dev/null)

if [[ $REG_RESPONSE == *"access_token"* ]]; then
    echo "✅ Registration endpoint working"
    echo "   User created successfully"
elif [[ $REG_RESPONSE == *"already registered"* ]]; then
    echo "✅ Registration endpoint working"
    echo "   User already exists (expected)"
else
    echo "❌ Registration endpoint failed"
    echo "Response: $REG_RESPONSE"
fi

# Test login endpoint
echo ""
echo "4. Testing login endpoint..."
LOGIN_RESPONSE=$(curl -s -X POST "$RAILWAY_DOMAIN/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@deployment.com","password":"test123"}' 2>/dev/null)

if [[ $LOGIN_RESPONSE == *"access_token"* ]]; then
    echo "✅ Login endpoint working"
    echo "   Authentication successful"
else
    echo "❌ Login endpoint failed"
    echo "Response: $LOGIN_RESPONSE"
fi

echo ""
echo "🎯 DEPLOYMENT TEST RESULTS:"
echo "==========================="
echo "Backend Domain: $RAILWAY_DOMAIN"
echo ""
echo "📋 Next Steps:"
echo "1. Update Vercel environment variable:"
echo "   VITE_API_BASE_URL=$RAILWAY_DOMAIN"
echo ""
echo "2. Test your frontend at https://gomunus.com"
echo "3. Try registering a new account"
echo "4. Try logging in with existing account"
echo ""
echo "🎉 If all tests passed, your backend is ready!" 
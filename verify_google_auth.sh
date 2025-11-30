#!/bin/bash

# Google OAuth Configuration Verification Script
# This script checks if all required configurations are in place

echo "🔍 Verifying Google OAuth Configuration..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if files exist
echo "📁 Checking configuration files..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} Frontend .env file exists"
else
    echo -e "${RED}✗${NC} Frontend .env file NOT FOUND"
    exit 1
fi

if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} Backend .env file exists"
else
    echo -e "${RED}✗${NC} Backend .env file NOT FOUND"
    exit 1
fi

echo ""
echo "🔑 Checking Frontend Environment Variables..."

# Check frontend Google Client ID
if grep -q "VITE_GOOGLE_CLIENT_ID=" .env; then
    CLIENT_ID=$(grep "VITE_GOOGLE_CLIENT_ID=" .env | cut -d '=' -f 2)
    if [ -z "$CLIENT_ID" ]; then
        echo -e "${RED}✗${NC} VITE_GOOGLE_CLIENT_ID is empty"
    else
        echo -e "${GREEN}✓${NC} VITE_GOOGLE_CLIENT_ID is set"
        echo "   Value: ${CLIENT_ID:0:20}..."
    fi
else
    echo -e "${RED}✗${NC} VITE_GOOGLE_CLIENT_ID not found in .env"
fi

# Check frontend redirect URI
if grep -q "VITE_GOOGLE_REDIRECT_URI=" .env; then
    REDIRECT_URI=$(grep "VITE_GOOGLE_REDIRECT_URI=" .env | cut -d '=' -f 2)
    echo -e "${GREEN}✓${NC} VITE_GOOGLE_REDIRECT_URI is set"
    echo "   Value: $REDIRECT_URI"
else
    echo -e "${RED}✗${NC} VITE_GOOGLE_REDIRECT_URI not found in .env"
fi

# Check API base URL
if grep -q "VITE_API_BASE_URL=" .env; then
    API_URL=$(grep "VITE_API_BASE_URL=" .env | cut -d '=' -f 2)
    echo -e "${GREEN}✓${NC} VITE_API_BASE_URL is set"
    echo "   Value: $API_URL"
else
    echo -e "${YELLOW}⚠${NC} VITE_API_BASE_URL not found in .env"
fi

echo ""
echo "🔒 Checking Backend Environment Variables..."

# Check backend Google Client ID
if grep -q "GOOGLE_CLIENT_ID=" backend/.env; then
    BACKEND_CLIENT_ID=$(grep "GOOGLE_CLIENT_ID=" backend/.env | cut -d '=' -f 2)
    if [ -z "$BACKEND_CLIENT_ID" ]; then
        echo -e "${RED}✗${NC} GOOGLE_CLIENT_ID is empty"
    else
        echo -e "${GREEN}✓${NC} GOOGLE_CLIENT_ID is set"
        echo "   Value: ${BACKEND_CLIENT_ID:0:20}..."
    fi
else
    echo -e "${RED}✗${NC} GOOGLE_CLIENT_ID not found in backend/.env"
fi

# Check backend Google Client Secret
if grep -q "GOOGLE_CLIENT_SECRET=" backend/.env; then
    BACKEND_SECRET=$(grep "GOOGLE_CLIENT_SECRET=" backend/.env | cut -d '=' -f 2)
    if [ -z "$BACKEND_SECRET" ]; then
        echo -e "${RED}✗${NC} GOOGLE_CLIENT_SECRET is empty"
    else
        echo -e "${GREEN}✓${NC} GOOGLE_CLIENT_SECRET is set"
        echo "   Value: ${BACKEND_SECRET:0:10}..."
    fi
else
    echo -e "${RED}✗${NC} GOOGLE_CLIENT_SECRET not found in backend/.env"
fi

# Check backend redirect URI
if grep -q "GOOGLE_REDIRECT_URI=" backend/.env; then
    BACKEND_REDIRECT=$(grep "GOOGLE_REDIRECT_URI=" backend/.env | cut -d '=' -f 2)
    echo -e "${GREEN}✓${NC} GOOGLE_REDIRECT_URI is set"
    echo "   Value: $BACKEND_REDIRECT"
else
    echo -e "${RED}✗${NC} GOOGLE_REDIRECT_URI not found in backend/.env"
fi

echo ""
echo "📄 Checking HTML Google Library..."

if [ -f "index.html" ]; then
    if grep -q "accounts.google.com/gsi/client" index.html; then
        echo -e "${GREEN}✓${NC} Google OAuth library is loaded in index.html"
    else
        echo -e "${RED}✗${NC} Google OAuth library NOT found in index.html"
        echo "   Add: <script src=\"https://accounts.google.com/gsi/client\" async defer></script>"
    fi
else
    echo -e "${RED}✗${NC} index.html not found"
fi

echo ""
echo "📦 Checking required dependencies..."

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules directory exists"
else
    echo -e "${YELLOW}⚠${NC} node_modules not found - Run: npm install"
fi

# Check if Python dependencies are installed
if [ -f "backend/requirements.txt" ]; then
    echo -e "${GREEN}✓${NC} Backend requirements.txt exists"
else
    echo -e "${YELLOW}⚠${NC} Backend requirements.txt not found"
fi

echo ""
echo "🔍 Checking key source files..."

# Check if AuthModal exists
if [ -f "src/components/auth/AuthModal.tsx" ]; then
    echo -e "${GREEN}✓${NC} AuthModal.tsx exists"
else
    echo -e "${RED}✗${NC} AuthModal.tsx NOT found"
fi

# Check if GoogleOAuthCallback exists
if [ -f "src/components/auth/GoogleOAuthCallback.tsx" ]; then
    echo -e "${GREEN}✓${NC} GoogleOAuthCallback.tsx exists"
else
    echo -e "${RED}✗${NC} GoogleOAuthCallback.tsx NOT found"
fi

# Check if backend auth endpoint exists
if [ -f "backend/app/api/v1/endpoints/auth.py" ]; then
    echo -e "${GREEN}✓${NC} Backend auth.py exists"
    
    # Check if google/callback endpoint is defined
    if grep -q "google/callback" backend/app/api/v1/endpoints/auth.py; then
        echo -e "${GREEN}✓${NC} Google OAuth callback endpoint is defined"
    else
        echo -e "${RED}✗${NC} Google OAuth callback endpoint NOT found"
    fi
else
    echo -e "${RED}✗${NC} Backend auth.py NOT found"
fi

echo ""
echo "📊 Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Count checks
TOTAL_CHECKS=15
PASSED_CHECKS=0

# Recount passed checks (simplified)
[ -f ".env" ] && ((PASSED_CHECKS++))
[ -f "backend/.env" ] && ((PASSED_CHECKS++))
grep -q "VITE_GOOGLE_CLIENT_ID=" .env 2>/dev/null && ((PASSED_CHECKS++))
grep -q "VITE_GOOGLE_REDIRECT_URI=" .env 2>/dev/null && ((PASSED_CHECKS++))
grep -q "GOOGLE_CLIENT_ID=" backend/.env 2>/dev/null && ((PASSED_CHECKS++))
grep -q "GOOGLE_CLIENT_SECRET=" backend/.env 2>/dev/null && ((PASSED_CHECKS++))
grep -q "GOOGLE_REDIRECT_URI=" backend/.env 2>/dev/null && ((PASSED_CHECKS++))
grep -q "accounts.google.com/gsi/client" index.html 2>/dev/null && ((PASSED_CHECKS++))
[ -d "node_modules" ] && ((PASSED_CHECKS++))
[ -f "backend/requirements.txt" ] && ((PASSED_CHECKS++))
[ -f "src/components/auth/AuthModal.tsx" ] && ((PASSED_CHECKS++))
[ -f "src/components/auth/GoogleOAuthCallback.tsx" ] && ((PASSED_CHECKS++))
[ -f "backend/app/api/v1/endpoints/auth.py" ] && ((PASSED_CHECKS++))
grep -q "google/callback" backend/app/api/v1/endpoints/auth.py 2>/dev/null && ((PASSED_CHECKS++))

echo "Passed: $PASSED_CHECKS/$TOTAL_CHECKS checks"

if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
    echo -e "${GREEN}✓ All checks passed! Google OAuth is ready to use.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start backend: cd backend && python start_backend.py"
    echo "2. Start frontend: npm run dev"
    echo "3. Test sign-in at: http://localhost:5173"
    exit 0
elif [ $PASSED_CHECKS -ge 12 ]; then
    echo -e "${YELLOW}⚠ Most checks passed. Review warnings above.${NC}"
    exit 0
else
    echo -e "${RED}✗ Configuration incomplete. Fix errors above.${NC}"
    exit 1
fi


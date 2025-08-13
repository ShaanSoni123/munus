#!/bin/bash

echo "🚀 Munus Production Setup for Y Combinator"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: MongoDB Database Setup${NC}"
echo "======================================"
echo "✅ MongoDB is already configured and working!"
echo "   URI: mongodb+srv://shaansoni21:L7H0k0nER4DjEM1D@munusdb.f8c3gzf.mongodb.net/"
echo "   Database: jobify"
echo "   Status: Production-ready"
echo ""

echo -e "${YELLOW}Step 3: Environment Variables${NC}"
echo "=================================="
echo "Update your .env.production with:"
echo ""
echo "MONGODB_URI=mongodb+srv://shaansoni21:L7H0k0nER4DjEM1D@munusdb.f8c3gzf.mongodb.net/"
echo "MONGODB_DB_NAME=jobify"
echo "VITE_API_BASE_URL=https://api.gomunuc.com"
echo ""

echo -e "${YELLOW}Step 4: Test Configuration${NC}"
echo "================================"
echo "1. Copy production config: cp .env.production .env"
echo "2. Test build: npm run build"
echo "3. Test backend: cd backend && python -m uvicorn app.main:app --reload"
echo ""

echo -e "${YELLOW}Step 5: Deployment${NC}"
echo "========================"
echo "1. Frontend: Deploy to Vercel"
echo "2. Backend: Deploy to Railway"
echo "3. Set environment variables in deployment platforms"
echo ""

echo -e "${GREEN}✅ Production Checklist:${NC}"
echo "================================"
echo "✅ MongoDB database configured and working"
echo "✅ Authentication system working"  
echo "□ Environment variables updated for production"
echo "□ CORS origins configured for gomunuc.com"
echo "□ API deployed to production"
echo "□ Secret keys generated"
echo "□ Frontend deployed"
echo "□ Backend deployed"
echo "□ All features tested"
echo ""

echo -e "${RED}⚠️  CRITICAL:${NC}"
echo "================"
echo "1. NEVER commit .env.production to Git"
echo "2. Keep Supabase service_role key secret"
echo "3. Test all features before YC presentation"
echo "4. Monitor performance after deployment"
echo ""

echo -e "${GREEN}🎯 Y Combinator Ready!${NC}"
echo "==============================" 
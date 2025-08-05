#!/bin/bash

echo "🚀 Munus Production Setup for Y Combinator"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Supabase Project Setup${NC}"
echo "======================================"
echo "1. Go to https://supabase.com"
echo "2. Sign up/Login"
echo "3. Create new project: 'munus-production'"
echo "4. Wait for project to be ready"
echo "5. Go to Settings > API"
echo "6. Copy these values:"
echo "   - Project URL"
echo "   - anon/public key"
echo "   - service_role key (keep secret!)"
echo ""

echo -e "${YELLOW}Step 2: Database Setup${NC}"
echo "============================="
echo "1. Go to SQL Editor in Supabase"
echo "2. Run the migration from supabase/migrations/"
echo "3. Test database connection"
echo ""

echo -e "${YELLOW}Step 3: Environment Variables${NC}"
echo "=================================="
echo "Update your .env.production with:"
echo ""
echo "VITE_SUPABASE_URL=https://your-project-id.supabase.co"
echo "VITE_SUPABASE_ANON_KEY=your-anon-key-here"
echo "DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"
echo "ASYNC_DATABASE_URL=postgresql+asyncpg://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"
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
echo "□ Supabase project created"
echo "□ Database credentials obtained"
echo "□ Environment variables updated"
echo "□ CORS origins configured"
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
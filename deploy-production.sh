#!/bin/bash

echo "🚀 Munus Production Deployment Script for Y Combinator"
echo "=================================================="

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ .env.production file not found!"
    echo "Please run: cp .env .env.production"
    exit 1
fi

echo "✅ Production environment file found"

# Generate secure secret key
echo "🔐 Generating secure secret key..."
SECRET_KEY=$(openssl rand -hex 32)
echo "Generated Secret Key: $SECRET_KEY"
echo "⚠️  IMPORTANT: Update this in your .env.production file!"

echo ""
echo "📋 NEXT STEPS:"
echo "=============="
echo ""
echo "1. 🔧 SUPABASE SETUP (REQUIRED):"
echo "   - Go to https://supabase.com"
echo "   - Create new project: 'munus-production'"
echo "   - Get your project URL and anon key"
echo "   - Update .env.production with Supabase credentials"
echo ""
echo "2. 🔑 SECURITY (REQUIRED):"
echo "   - Replace SECRET_KEY in .env.production with: $SECRET_KEY"
echo "   - Update CORS origins for gomunuc.com"
echo "   - Set VITE_API_BASE_URL=https://api.gomunuc.com"
echo ""
echo "3. 🚀 DEPLOYMENT:"
echo "   - Frontend: Deploy to Vercel"
echo "   - Backend: Deploy to Railway"
echo "   - Set environment variables in deployment platforms"
echo ""
echo "4. ✅ TESTING:"
echo "   - Test user registration"
echo "   - Test login functionality"
echo "   - Test all features in production"
echo ""
echo "📖 See PRODUCTION_SETUP.md for detailed instructions"
echo ""
echo "🎯 Y COMBINATOR READY CHECKLIST:"
echo "================================"
echo "□ Supabase database configured"
echo "□ Secret keys updated"
echo "□ CORS origins set for gomunuc.com"
echo "□ API base URL configured"
echo "□ Frontend deployed to Vercel"
echo "□ Backend deployed to Railway"
echo "□ All features tested in production"
echo "□ SSL certificates configured"
echo "□ Domain DNS configured"
echo ""
echo "⚠️  DO NOT DEPLOY UNTIL ALL ITEMS ARE COMPLETED!" 
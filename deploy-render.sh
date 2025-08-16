#!/bin/bash

# 🚀 Render Deployment Script for Munus
# This script helps you deploy to Render step by step

echo "🚀 Munus Render Deployment Script"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml not found. Make sure you're in the project root directory."
    exit 1
fi

echo "✅ Found render.yaml configuration"
echo ""

echo "📋 Deployment Steps:"
echo "===================="
echo ""
echo "1. 🌐 Go to Render Dashboard: https://dashboard.render.com/"
echo "2. 🔗 Click 'New +' and select 'Web Service'"
echo "3. 📚 Connect your GitHub repository"
echo "4. ⚙️  Configure Backend Service:"
echo "   - Name: munus-backend"
echo "   - Environment: Python 3"
echo "   - Branch: main"
echo "   - Root Directory: backend"
echo "   - Build Command: pip install -r requirements-production.txt"
echo "   - Start Command: python start_production.py"
echo ""
echo "5. 🔑 Set Environment Variables (copy from backend/.env.production):"
echo "   - MONGODB_URI=mongodb+srv://shaansoni21:L7H0k0nER4DjEM1D@munusdb.f8c3gzf.mongodb.net/?retryWrites=true&w=majority&appName=Munusdb"
echo "   - MONGODB_DB_NAME=jobify"
echo "   - SECRET_KEY=your-super-secret-jwt-key-change-this-in-production"
echo "   - ALGORITHM=HS256"
echo "   - ACCESS_TOKEN_EXPIRE_MINUTES=10080"
echo "   - ENVIRONMENT=production"
echo "   - DEBUG=False"
echo "   - BACKEND_CORS_ORIGINS=[\"https://munus-frontend.onrender.com\",\"https://gomunus.com\",\"https://www.gomunus.com\"]"
echo ""
echo "6. 🚀 Click 'Create Web Service' and wait for deployment"
echo "7. 🌐 Backend will be deployed to Render"
echo "8. 📱 Frontend is already deployed on Vercel"
echo ""

echo "🔍 Current Configuration Files:"
echo "==============================="
echo "✅ backend/start_production.py - Backend startup script"
echo "✅ backend/requirements-production.txt - Production dependencies"
echo "✅ backend/.env.production - Production environment template"
echo ""

echo "📝 Next Steps:"
echo "==============="
echo "1. Follow the deployment steps above"
echo "2. Copy environment variables from backend/.env.production"
echo "3. Update CORS origins with your actual domain"
echo "4. Test the deployment using the verification steps in RENDER_DEPLOYMENT_GUIDE.md"
echo ""

echo "🎯 Your URLs will be:"
echo "====================="
echo "Backend API: https://munus-backend.onrender.com"
echo "Frontend: https://gomunus.com (Vercel)"
echo "API Docs: https://munus-backend.onrender.com/docs"
echo ""

echo "📚 For detailed instructions, see: RENDER_DEPLOYMENT_GUIDE.md"
echo ""

echo "🚀 Ready to deploy! Good luck!"

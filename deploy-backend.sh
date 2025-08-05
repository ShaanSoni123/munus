#!/bin/bash

echo "🚀 Munus Backend Deployment Script"
echo "=================================="

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found!"
    exit 1
fi

echo "✅ Backend directory found"

# Check if requirements.txt exists
if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ requirements.txt not found in backend directory!"
    exit 1
fi

echo "✅ requirements.txt found"

# Check if main.py exists
if [ ! -f "backend/app/main.py" ]; then
    echo "❌ main.py not found in backend/app/ directory!"
    exit 1
fi

echo "✅ main.py found"

# Create Procfile if it doesn't exist
if [ ! -f "backend/Procfile" ]; then
    echo "web: uvicorn app.main:app --host 0.0.0.0 --port \$PORT" > backend/Procfile
    echo "✅ Created Procfile"
else
    echo "✅ Procfile already exists"
fi

echo ""
echo "📋 DEPLOYMENT CHECKLIST:"
echo "========================"
echo ""
echo "1. 🗄️  MONGODB SETUP:"
echo "   - Follow MONGODB_SETUP_GUIDE.md"
echo "   - Create MongoDB Atlas account"
echo "   - Get your connection string"
echo ""
echo "2. 🚂 RAILWAY DEPLOYMENT:"
echo "   - Go to https://railway.app"
echo "   - Sign in with GitHub"
echo "   - Create new project"
echo "   - Select 'Deploy from GitHub repo'"
echo "   - Choose your munus repository"
echo "   - Select 'backend' folder as source"
echo "   - Click 'Deploy'"
echo ""
echo "3. ⚙️  ENVIRONMENT VARIABLES:"
echo "   In Railway dashboard, add these variables:"
echo ""
echo "   MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/munus"
echo "   MONGODB_DB_NAME=munus"
echo "   SECRET_KEY=4cfef7455812abbcf29d89cafa76112b75c64dfbe50e8ee6df54a8586ff1db8a"
echo "   ALGORITHM=HS256"
echo "   ACCESS_TOKEN_EXPIRE_MINUTES=30"
echo "   REFRESH_TOKEN_EXPIRE_DAYS=7"
echo "   BACKEND_CORS_ORIGINS=[\"https://www.gomunus.com\",\"https://gomunus.com\"]"
echo "   ENVIRONMENT=production"
echo "   DEBUG=false"
echo "   API_V1_STR=/api/v1"
echo "   PROJECT_NAME=Munus API"
echo "   VERSION=1.0.0"
echo ""
echo "4. 🔗 GET RAILWAY DOMAIN:"
echo "   - Copy your Railway domain (e.g., https://your-app.railway.app)"
echo ""
echo "5. 🔧 UPDATE FRONTEND:"
echo "   - Go to Vercel dashboard"
echo "   - Add environment variable:"
echo "     VITE_API_BASE_URL=https://your-railway-domain.railway.app"
echo ""
echo "6. ✅ TEST:"
echo "   - Visit your Railway domain + /health"
echo "   - Test registration/login on gomunus.com"
echo ""
echo "📖 See BACKEND_DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "🎯 Ready to deploy? Follow the steps above!" 
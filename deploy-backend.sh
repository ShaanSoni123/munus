#!/bin/bash

echo "🚀 Munus Backend Deployment Script"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Backend files found"

# Check if render.yaml exists
if [ ! -f "backend/render.yaml" ]; then
    echo "❌ Error: render.yaml not found. Please ensure the deployment files are created."
    exit 1
fi

echo "✅ Render configuration found"

echo ""
echo "📋 Next Steps:"
echo "1. Go to https://render.com and sign up/login"
echo "2. Create a new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Set Root Directory to: backend"
echo "5. Set Environment Variables:"
echo "   - MONGODB_URI: Your MongoDB connection string"
echo "   - SECRET_KEY: A secure random string"
echo "6. Deploy and wait for completion"
echo "7. Copy the generated URL"
echo "8. Update VITE_API_BASE_URL in Vercel with the new URL"
echo "9. Redeploy your frontend"
echo ""
echo "📖 For detailed instructions, see: BACKEND_DEPLOYMENT_GUIDE.md"
echo ""
echo "🔗 Quick Links:"
echo "- Render Dashboard: https://dashboard.render.com"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- MongoDB Atlas: https://cloud.mongodb.com"
echo ""

# Generate a secure SECRET_KEY
echo "🔑 Here's a secure SECRET_KEY you can use:"
python3 -c "import secrets; print(secrets.token_hex(32))"

echo ""
echo "🎯 Your backend will be available at: https://munus-backend-xxxx.onrender.com"
echo "   (replace 'xxxx' with your actual service ID)" 
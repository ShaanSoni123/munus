# 🚀 Render Deployment Guide for Munus

## Backend Deployment on Render

### 1. Prerequisites
- GitHub repository with your code
- Render account (free tier available)
- MongoDB Atlas database (already configured)

### 2. Backend Deployment Steps

#### Step 1: Connect Repository
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Select the repository containing your Munus code

#### Step 2: Configure Build Settings
- **Name**: `munus-backend`
- **Environment**: `Python 3`
- **Branch**: `main` (or your main branch)
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python start_production.py`

#### Step 3: Environment Variables
Add these environment variables in Render:

```bash
# Required - MongoDB
MONGODB_URI=mongodb+srv://shaansoni21:L7H0k0nER4DjEM1D@munusdb.f8c3gzf.mongodb.net/?retryWrites=true&w=majority&appName=Munusdb
MONGODB_DB_NAME=jobify

# Required - Security
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Required - Environment
ENVIRONMENT=production
DEBUG=False

# Required - CORS (Update with your frontend URLs)
BACKEND_CORS_ORIGINS=["https://munus-frontend.onrender.com","https://gomunus.com","https://www.gomunus.com"]

# Optional - API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=Munus API
VERSION=1.0.0
```

#### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete (5-10 minutes)
3. Your backend will be available at: `https://munus-backend.onrender.com`

### 3. Frontend Deployment on Render (Static Site)

#### Step 1: Build Configuration
Create a `render.yaml` in your project root:

```yaml
services:
  - type: web
    name: munus-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_API_BASE_URL
        value: https://munus-backend.onrender.com
```

#### Step 2: Deploy Frontend
1. Go to Render Dashboard
2. Click "New +" and select "Static Site"
3. Connect the same repository
4. Configure:
   - **Name**: `munus-frontend`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

#### Step 3: Environment Variables
```bash
VITE_API_BASE_URL=https://munus-backend.onrender.com
```

## 4. Verification Steps

### Backend Health Check
```bash
curl https://munus-backend.onrender.com/health
```
Expected response:
```json
{
  "status": "healthy",
  "timestamp": 1754989903.872001,
  "services": {
    "mongodb": {
      "status": "healthy",
      "database": "mongodb"
    }
  }
}
```

### Test Authentication
```bash
curl -X POST "https://munus-backend.onrender.com/api/v1/auth/register/" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "name": "Test User",
    "role": "jobseeker"
  }'
```

### Frontend Access
Visit your frontend URL and test:
1. Account registration
2. Login
3. Resume builder
4. Job browsing

## 5. Important Notes

### Free Tier Limitations
- **Render Free Tier**: 
  - Services spin down after 15 minutes of inactivity
  - Cold start takes 30-60 seconds
  - 750 hours/month limit

### Production Optimizations
1. **Backend**: Consider upgrading to paid plan for always-on service
2. **MongoDB**: Ensure Atlas cluster is in same region as Render service
3. **CORS**: Update CORS origins with your actual domain
4. **Environment Variables**: Change all default passwords and secrets

### Monitoring
- Use Render logs to monitor application performance
- Set up error tracking (Sentry, LogRocket)
- Monitor MongoDB Atlas metrics

## 6. Custom Domain (Optional)

### Backend Domain
1. In Render dashboard, go to your backend service
2. Click "Settings" → "Custom Domains"
3. Add your domain (e.g., `api.gomunus.com`)
4. Update DNS records as instructed

### Frontend Domain
1. In Render dashboard, go to your frontend service
2. Click "Settings" → "Custom Domains"
3. Add your domain (e.g., `gomunus.com`)
4. Update DNS records and environment variables

## 7. Troubleshooting

### Common Issues

#### Backend Won't Start
- Check environment variables are set correctly
- Verify MongoDB URI is accessible
- Check build logs for Python dependency issues

#### Frontend Can't Connect to Backend
- Verify VITE_API_BASE_URL is correct
- Check CORS configuration in backend
- Ensure backend service is running

#### MongoDB Connection Issues
- Verify MongoDB Atlas allows connections from 0.0.0.0/0
- Check MongoDB URI format
- Ensure database name is correct

### Debug Commands
```bash
# Check backend logs
curl https://munus-backend.onrender.com/api/v1/health/healthz

# Test MongoDB connection
curl https://munus-backend.onrender.com/api/v1/jobs/

# Test authentication
curl -X POST https://munus-backend.onrender.com/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"debug@test.com","password":"test123","name":"Debug","role":"jobseeker"}'
```

## 8. Success! 🎉

Your Munus platform should now be:
- ✅ Backend running on Render
- ✅ Frontend deployed as static site
- ✅ MongoDB Atlas connected
- ✅ Authentication working
- ✅ All features functional

### Production URLs
- **Backend API**: `https://munus-backend.onrender.com`
- **Frontend**: `https://munus-frontend.onrender.com`
- **API Docs**: `https://munus-backend.onrender.com/docs`

---

## Support

If you encounter issues:
1. Check Render service logs
2. Verify environment variables
3. Test endpoints manually with curl
4. Check MongoDB Atlas connection
5. Review CORS configuration

Good luck with your deployment! 🚀

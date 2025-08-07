# Backend Deployment Guide for Munus

## Problem
Your frontend is deployed on Vercel at `gomunus.com`, but the backend server is not running, causing login and account creation to fail.

## Solution: Deploy Backend to Render

### Step 1: Prepare Your Backend for Deployment

1. **Ensure your backend directory is ready:**
   ```bash
   cd backend
   ```

2. **The following files have been created/updated:**
   - `render.yaml` - Render deployment configuration
   - `start_production.py` - Production startup script
   - `requirements.txt` - Python dependencies (already exists)

### Step 2: Deploy to Render

1. **Go to [Render.com](https://render.com) and sign up/login**

2. **Create a new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your backend

3. **Configure the service:**
   - **Name:** `munus-backend`
   - **Root Directory:** `backend` (if your backend is in a subdirectory)
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python start_production.py`

4. **Set Environment Variables:**
   Click "Environment" tab and add these variables:
   
   **Required Variables:**
   - `MONGODB_URI`: Your MongoDB connection string
   - `SECRET_KEY`: A secure random string for JWT tokens
   
   **Optional Variables (will use defaults if not set):**
   - `MONGODB_DB_NAME`: `munus`
   - `ALGORITHM`: `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `30`
   - `REFRESH_TOKEN_EXPIRE_DAYS`: `7`
   - `ENVIRONMENT`: `production`
   - `DEBUG`: `false`

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for the build to complete (usually 5-10 minutes)

### Step 3: Get Your Backend URL

After deployment, Render will give you a URL like:
`https://munus-backend-xxxx.onrender.com`

### Step 4: Update Frontend Environment Variables

1. **Go to your Vercel dashboard**
2. **Navigate to your project settings**
3. **Go to Environment Variables**
4. **Add/Update:**
   - `VITE_API_BASE_URL`: `https://munus-backend-xxxx.onrender.com` (replace with your actual Render URL)

### Step 5: Redeploy Frontend

1. **Trigger a new deployment in Vercel:**
   - Go to your project dashboard
   - Click "Deployments"
   - Click "Redeploy" on the latest deployment

### Step 6: Test Your Application

1. **Visit your domain:** `https://www.gomunus.com`
2. **Test login/registration functionality**
3. **Check browser console for any errors**

## Alternative: Quick Fix with Environment Variables

If you want to quickly test without redeploying, you can temporarily update the API configuration:

1. **Edit `src/services/api.ts`:**
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-render-backend-url.onrender.com';
   ```

2. **Redeploy to Vercel**

## MongoDB Setup

Make sure your MongoDB database is accessible from Render:

1. **If using MongoDB Atlas:**
   - Ensure your IP whitelist includes `0.0.0.0/0` (allows all IPs)
   - Or add Render's IP ranges

2. **If using local MongoDB:**
   - Consider migrating to MongoDB Atlas for production

## Troubleshooting

### Common Issues:

1. **Build fails on Render:**
   - Check the build logs in Render dashboard
   - Ensure all dependencies are in `requirements.txt`

2. **MongoDB connection fails:**
   - Verify your `MONGODB_URI` is correct
   - Check MongoDB network access settings

3. **CORS errors:**
   - The backend is configured to allow your domain
   - Check browser console for CORS errors

4. **Environment variables not working:**
   - Ensure variables are set in Render dashboard
   - Redeploy after adding variables

### Check Backend Health:

Visit: `https://your-backend-url.onrender.com/health`

Should return:
```json
{
  "status": "healthy",
  "timestamp": 1234567890,
  "services": {
    "mongodb": {"status": "healthy", "database": "mongodb"}
  }
}
```

## Next Steps

After successful deployment:

1. **Set up monitoring** in Render dashboard
2. **Configure custom domain** for backend (optional)
3. **Set up automatic deployments** from GitHub
4. **Monitor logs** for any issues

## Support

If you encounter issues:
1. Check Render deployment logs
2. Check Vercel deployment logs
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly 
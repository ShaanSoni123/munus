# 🚀 Quick Fix for Authentication

## **The Problem:**
Vercel deployment failed because of serverless function issues. Let's fix this quickly!

## **Solution: Deploy Backend Separately**

### **Option 1: Deploy to Render.com (Recommended - Free)**

1. **Go to [Render.com](https://render.com)**
2. **Sign up with GitHub**
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repo**
5. **Configure:**
   - **Name:** `munus-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

6. **Add Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://your-connection-string
   MONGODB_DB_NAME=munus
   SECRET_KEY=4cfef7455812abbcf29d89cafa76112b75c64dfbe50e8ee6df54a8586ff1db8a
   ```

7. **Deploy!**

### **Option 2: Deploy to Railway.com (Alternative)**

1. **Go to [Railway.app](https://railway.app)**
2. **Connect GitHub repo**
3. **Select `backend` folder**
4. **Add environment variables**
5. **Deploy**

## **After Backend Deployment:**

1. **Get your backend URL** (e.g., `https://munus-backend.onrender.com`)

2. **Update Vercel environment variable:**
   - Go to Vercel dashboard
   - Add: `VITE_API_BASE_URL=https://your-backend-url.com`

3. **Redeploy frontend:**
   ```bash
   git add .
   git commit -m "Updated API base URL"
   git push
   ```

## **Test the Fix:**

Once deployed, test these endpoints:
- `https://your-backend-url.com/health`
- `https://your-backend-url.com/api/v1/auth/login`
- `https://your-backend-url.com/api/v1/auth/register`

---

## 🎯 **This will fix your authentication!**

The frontend will connect to your separately deployed backend, and login/registration will work perfectly! 
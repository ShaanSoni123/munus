# 🚀 Backend Deployment Guide for Railway

## **Step 1: Deploy Backend to Railway**

1. **Go to [Railway.app](https://railway.app)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your munus repository**
6. **Select the `backend` folder as the source**
7. **Click "Deploy"**

## **Step 2: Set Environment Variables in Railway**

In your Railway project dashboard, go to **Variables** tab and add these:

```bash
# Database Configuration
MONGODB_URI=mongodb+srv://your-mongodb-connection-string
MONGODB_DB_NAME=munus

# Security
SECRET_KEY=4cfef7455812abbcf29d89cafa76112b75c64dfbe50e8ee6df54a8586ff1db8a
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS (Important!)
BACKEND_CORS_ORIGINS=["https://www.gomunus.com","https://gomunus.com","https://api.gomunus.com"]

# Environment
ENVIRONMENT=production
DEBUG=false

# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=Munus API
VERSION=1.0.0

# Email (Optional)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_FROM_NAME=Munus
```

## **Step 3: Get Your Railway Domain**

1. **Go to your Railway project**
2. **Click on your deployed service**
3. **Copy the generated domain (e.g., `https://your-app-name.railway.app`)**

## **Step 4: Update Frontend API URL**

1. **Go to your Vercel dashboard**
2. **Select your munus project**
3. **Go to Settings → Environment Variables**
4. **Add/Update:**
   ```
   VITE_API_BASE_URL=https://your-railway-domain.railway.app
   ```

## **Step 5: Test the Connection**

1. **Visit your Railway domain + `/health`**
   ```
   https://your-railway-domain.railway.app/health
   ```
2. **You should see:**
   ```json
   {
     "status": "healthy",
     "timestamp": 1234567890.123,
     "services": {
       "mongodb": {"status": "healthy", "database": "mongodb"}
     }
   }
   ```

## **Step 6: Test Authentication**

1. **Go to your deployed frontend: `https://gomunus.com`**
2. **Try to register a new account**
3. **Try to login with existing account**

## **Alternative: Quick Fix for Testing**

If you want to test locally first:

1. **Update your local `.env` file:**
   ```bash
   VITE_API_BASE_URL=http://localhost:8000
   ```

2. **Start your local backend:**
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Start your local frontend:**
   ```bash
   npm run dev
   ```

## **MongoDB Setup (Required)**

You need a cloud MongoDB instance. Options:

1. **MongoDB Atlas (Free tier available)**
2. **Railway MongoDB plugin**
3. **Any cloud MongoDB provider**

Get your connection string and update `MONGODB_URI` in Railway environment variables.

---

## **🚨 Common Issues & Solutions**

### **Issue: CORS Errors**
- Make sure `BACKEND_CORS_ORIGINS` includes your frontend domain
- Check that the domain format is correct

### **Issue: Database Connection Failed**
- Verify your MongoDB connection string
- Make sure your MongoDB instance is accessible from Railway

### **Issue: Environment Variables Not Loading**
- Check that all variables are set in Railway dashboard
- Redeploy after adding new variables

### **Issue: Frontend Can't Connect to Backend**
- Verify the `VITE_API_BASE_URL` is correct
- Check that your Railway domain is accessible
- Test the health endpoint manually

---

**After completing these steps, your login and account creation should work! 🎉** 
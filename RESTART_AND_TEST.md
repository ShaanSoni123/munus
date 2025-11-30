# 🚀 Restart Backend and Test Google Auth

## ✅ Configuration Updated

Your `.env` files have been updated with:
- ✅ New Google Client ID: `215762303204-locq97u0tjb8s6dst055abg42rdcei4e`
- ✅ New Google Client Secret: `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`
- ✅ Correct redirect URI: `http://localhost:5174/google-callback`
- ✅ **LOCAL API URL**: `http://localhost:8000` (FIXED!)

---

## 🔄 Step 1: Restart Backend

**Stop the current backend** (in the terminal where it's running):
- Press `Ctrl + C`

**Start it again:**
```bash
cd backend
python start_backend.py
```

Wait until you see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     MongoDB connection established
```

---

## 🔄 Step 2: Restart Frontend

**Stop the current frontend** (in the terminal where it's running):
- Press `Ctrl + C`

**Start it again:**
```bash
npm run dev
```

Wait until you see:
```
VITE ready in XXX ms
Local: http://localhost:5174/
```

---

## 🧪 Step 3: Test Google Sign-In

1. **Open browser**: `http://localhost:5174`

2. **Click "Sign In"** button

3. **Select user type**: Choose "Job Seeker" or "Employer"

4. **Click "Sign in with Google"** or "Continue with Google"

5. **Select your Google account** from the picker

6. **You should be redirected to your dashboard!**
   - Employer → Employer Dashboard
   - Job Seeker → Job Seeker Dashboard

---

## ✅ Success Indicators

When working:
- ✅ Google account picker appears
- ✅ After selecting account, see "Completing Google Sign-in..." loading message
- ✅ Automatically redirected to dashboard
- ✅ User name appears in dashboard
- ✅ No errors in browser console (F12)

---

## 🐛 If Still Having Issues

### Check Backend Logs
Look for any errors in the terminal where backend is running

### Check Browser Console
1. Press F12 to open developer tools
2. Go to "Console" tab
3. Look for errors (red text)
4. Share any error messages

### Verify Backend is Accessible
Open in browser: `http://localhost:8000/docs`
- You should see the FastAPI API documentation
- Look for "/auth/google/callback" endpoint

### Test Backend Directly
```bash
curl -X POST http://localhost:8000/api/v1/auth/google/callback \
  -H "Content-Type: application/json" \
  -d '{"code":"test","user_type":"jobseeker"}'
```

Should return: Error about invalid code (this is expected - it means the endpoint works!)

---

## 🔑 Google Console Configuration

Make sure these are added in [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

**Authorized JavaScript origins:**
- `http://localhost:5174`
- `http://localhost:5173`
- `http://localhost:3000`

**Authorized redirect URIs:**
- `http://localhost:5174/google-callback`
- `http://localhost:5173/google-callback`
- `http://localhost:3000/google-callback`

---

## 📝 What Was Fixed

1. ✅ Updated Google Client ID and Secret with your new credentials
2. ✅ Changed API URL from `https://api.gomunus.com` to `http://localhost:8000`
3. ✅ Updated redirect URI to match port 5174
4. ✅ Backend environment configured correctly
5. ✅ CORS already allows localhost:5174

**Now just restart both servers and test!** 🚀


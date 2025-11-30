# 🔗 Google OAuth Redirect URI Setup Guide

## 📍 Redirect URI Configuration

Based on your setup, here are the **exact redirect URIs** you need to add to your Google Cloud Console:

### For Local Development:
```
http://localhost:5173/google-callback
```

**OR** if you're using a different port (check your terminal output):
```
http://localhost:3000/google-callback
http://localhost:5174/google-callback
```

### For Production (Netlify):
Based on your deployment, use one of these:

**If your domain is `gomunus.com`:**
```
https://gomunus.com/google-callback
https://www.gomunus.com/google-callback
```

**If you're using a Netlify URL:**
```
https://your-app-name.netlify.app/google-callback
```

**To find your exact Netlify URL:**
1. Go to your Netlify dashboard
2. Select your site
3. Look at the "Site details" or "Domain settings"
4. Use that domain with `/google-callback` appended

---

## 🔧 How to Add Redirect URI to Google Console

### Step 1: Open Google Cloud Console
1. Go to: https://console.cloud.google.com/apis/credentials
2. Sign in with your Google account

### Step 2: Find Your OAuth Client
1. Look for your OAuth 2.0 Client ID (it should start with a long number)
2. Click on it to edit

### Step 3: Add Redirect URIs
1. Scroll down to **"Authorized redirect URIs"** section
2. Click **"+ ADD URI"**
3. Add each redirect URI (one per line):
   - For development: `http://localhost:5173/google-callback`
   - For production: `https://your-domain.com/google-callback`
4. Click **"SAVE"**

### Step 4: Verify
Make sure you've added:
- ✅ `http://localhost:5173/google-callback` (or your dev port)
- ✅ `https://your-production-domain.com/google-callback`

---

## 🔍 How to Find Your Current Redirect URI

The app automatically uses `window.location.origin` which means:

**In Development:**
- If running on `http://localhost:5173` → redirect URI is `http://localhost:5173/google-callback`
- If running on `http://localhost:3000` → redirect URI is `http://localhost:3000/google-callback`

**In Production:**
- If deployed on `https://gomunus.com` → redirect URI is `https://gomunus.com/google-callback`
- If deployed on `https://your-app.vercel.app` → redirect URI is `https://your-app.vercel.app/google-callback`

---

## 🚨 Common Errors and Fixes

### Error: "redirect_uri_mismatch"
**Cause:** The redirect URI in Google Console doesn't match what your app is sending.

**Fix:**
1. Check what redirect URI your app is using (look at browser console or network tab)
2. Make sure that EXACT URI is in Google Console
3. Include the protocol (`http://` or `https://`)
4. Include the full path (`/google-callback`)
5. No trailing slash

### Error: "Not Found" after Google sign-in
**Cause:** The route `/google-callback` doesn't exist or isn't accessible.

**Fix:**
1. Make sure your frontend router includes the route
2. Check that `public/_redirects` file has the redirect rule for React Router
3. Verify the route is accessible: try visiting `https://your-domain.com/google-callback` directly
4. For Netlify: Make sure `_redirects` file is in the `public` folder and will be copied to the build output

---

## ✅ Quick Checklist

Before testing Google sign-in:

- [ ] Backend `.env` has `GOOGLE_REDIRECT_URI` set to your frontend URL + `/google-callback`
- [ ] Frontend `.env` has `VITE_GOOGLE_CLIENT_ID` set
- [ ] Google Console has the redirect URI added
- [ ] Route `/google-callback` exists in your router
- [ ] Backend is running and accessible
- [ ] Frontend is running and accessible

---

## 📝 Example Configuration

### Backend `.env`:
```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:5173/google-callback
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`:
```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here
VITE_API_BASE_URL=http://localhost:8000
```

### Google Console Redirect URIs:
```
http://localhost:5173/google-callback
https://gomunus.com/google-callback
https://www.gomunus.com/google-callback
```

---

## 🎯 Testing Your Setup

1. **Test the redirect URI directly:**
   - Open: `http://localhost:5173/google-callback` (or your URL)
   - Should show "Completing Google Sign-in..." or an error page (not 404)

2. **Test Google Sign-in:**
   - Click "Get Started"
   - Click "Continue with Google"
   - Select your account
   - Should redirect to role selection page

3. **Check browser console:**
   - Press F12
   - Look for any errors
   - Check Network tab for failed requests

---

## 🆘 Still Having Issues?

1. **Double-check the exact redirect URI:**
   - Open browser console (F12)
   - Go to Network tab
   - Try Google sign-in
   - Look for the redirect request
   - Check what URI is being sent

2. **Verify Google Console:**
   - Make sure the URI matches EXACTLY (case-sensitive)
   - Include the full path `/google-callback`
   - No extra slashes or spaces

3. **Check backend logs:**
   - Look for any errors when handling the callback
   - Verify MongoDB connection
   - Check if user is being created/updated

---

**Need help?** Share:
- Your frontend URL (localhost or production)
- Any error messages from browser console
- Backend logs showing errors


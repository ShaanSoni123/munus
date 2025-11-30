# 🔗 Redirect URI for Google Console

## 📍 Add This Exact URI to Google Cloud Console

### For Local Development:
```
http://localhost:5173/google-callback
```

**OR** if your dev server runs on a different port, check your terminal and use:
- `http://localhost:3000/google-callback`
- `http://localhost:5174/google-callback`
- `http://localhost:8080/google-callback`

### For Production (Netlify):
```
https://gomunus.com/google-callback
https://www.gomunus.com/google-callback
```

**OR** if you're using a Netlify subdomain:
```
https://your-app-name.netlify.app/google-callback
https://your-app-name.netlify.app/google-callback
```

---

## 🚀 Quick Steps to Add to Google Console:

1. **Go to:** https://console.cloud.google.com/apis/credentials
2. **Click** on your OAuth 2.0 Client ID
3. **Scroll** to "Authorized redirect URIs"
4. **Click** "+ ADD URI"
5. **Paste** the redirect URI (one of the above)
6. **Click** "SAVE"

---

## ✅ How to Find Your Exact Redirect URI:

The app uses `window.location.origin` automatically, so:

**Check your browser's address bar:**
- If you see `http://localhost:5173` → Use `http://localhost:5173/google-callback`
- If you see `https://gomunus.com` → Use `https://gomunus.com/google-callback`
- If you see `https://your-app.vercel.app` → Use `https://your-app.vercel.app/google-callback`

**Then add `/google-callback` to the end!**

---

## 🔧 Backend Configuration:

Make sure your `backend/.env` has:
```env
GOOGLE_REDIRECT_URI=http://localhost:5173/google-callback
```

(For production, change `http://localhost:5173` to your Netlify URL)

## 📦 Netlify Configuration:

Your project now includes:
- ✅ `netlify.toml` - Netlify build and redirect configuration
- ✅ `public/_redirects` - SPA redirect rules for React Router

These ensure that `/google-callback` and `/role-selection` routes work correctly on Netlify.

---

## ⚠️ Important Notes:

- ✅ Include the protocol (`http://` or `https://`)
- ✅ Include the full path (`/google-callback`)
- ✅ No trailing slash
- ✅ Case-sensitive (lowercase is fine)
- ✅ Must match EXACTLY what your app sends

---

**After adding the URI, wait 1-2 minutes for Google to update, then try signing in again!**


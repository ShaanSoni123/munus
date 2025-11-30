# 🚀 Netlify Deployment Guide for Munus

## ✅ Configuration Files

Your project is now configured for Netlify deployment:

### 1. `netlify.toml`
- Build command: `npm run build`
- Publish directory: `dist`
- Redirect rules for React Router (SPA)
- Security headers

### 2. `public/_redirects`
- SPA fallback redirects
- Specific routes for OAuth callback and role selection

---

## 🔗 Google OAuth Redirect URI for Netlify

### Find Your Netlify URL:
1. Go to your Netlify dashboard
2. Select your site
3. Check the site URL in "Site details"

### Add to Google Console:
**If using Netlify subdomain:**
```
https://your-app-name.netlify.app/google-callback
```

**If using custom domain (gomunus.com):**
```
https://gomunus.com/google-callback
https://www.gomunus.com/google-callback
```

---

## 🔧 Environment Variables in Netlify

### Frontend Environment Variables:
Go to: **Site settings → Build & deploy → Environment variables**

Add these:
```
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_API_BASE_URL=https://your-backend-url.com
```

### Backend Environment Variables:
Update your backend `.env` with:
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-netlify-url.netlify.app/google-callback
FRONTEND_URL=https://your-netlify-url.netlify.app
```

---

## 📝 Build Settings

Netlify will automatically detect:
- **Build command**: `npm run build` (from netlify.toml)
- **Publish directory**: `dist` (from netlify.toml)
- **Node version**: From `package.json` engines field

---

## 🧪 Testing After Deployment

1. **Test the redirect URI:**
   - Visit: `https://your-netlify-url.netlify.app/google-callback`
   - Should load the app (not show 404)

2. **Test Google Sign-in:**
   - Click "Get Started"
   - Click "Continue with Google"
   - Should redirect to role selection after authentication

3. **Check browser console:**
   - Press F12
   - Look for any errors
   - Check Network tab for failed requests

---

## ⚠️ Important Notes

1. **Redirect URI must match exactly:**
   - Include `https://`
   - Include `/google-callback`
   - No trailing slash
   - Case-sensitive

2. **After adding redirect URI in Google Console:**
   - Wait 1-2 minutes for changes to propagate
   - Clear browser cache if needed

3. **Netlify Build:**
   - Make sure `netlify.toml` is in the root directory
   - Ensure `public/_redirects` is in the `public` folder
   - Both files will be included in the build

---

## 🔍 Troubleshooting

### Issue: "Not Found" after Google sign-in
**Fix:**
1. Verify `netlify.toml` is in root directory
2. Check that `public/_redirects` exists
3. Redeploy on Netlify
4. Test the redirect URI directly in browser

### Issue: "redirect_uri_mismatch"
**Fix:**
1. Get exact URL from Netlify dashboard
2. Add that exact URL + `/google-callback` to Google Console
3. Wait 1-2 minutes and try again

### Issue: Routes not working
**Fix:**
1. Check Netlify build logs for errors
2. Verify `netlify.toml` syntax is correct
3. Ensure `public/_redirects` is being copied to build output

---

## 📚 Additional Resources

- [Netlify Redirects Documentation](https://docs.netlify.com/routing/redirects/)
- [Netlify Headers Documentation](https://docs.netlify.com/routing/headers/)
- [React Router on Netlify](https://docs.netlify.com/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps)

---

**Your site is ready for Netlify! 🎉**




# 🚨 IMPORTANT: Manual Steps Required

## The Issue

I've updated all your configuration files with the new Google OAuth credentials:
- ✅ Client ID: `215762303204-locq97u0tjb8s6dst055abg42rdcei4e`
- ✅ Client Secret: `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`
- ✅ API URL: Changed to `http://localhost:8000`
- ✅ Redirect URI: `http://localhost:5174/google-callback`

**BUT** - The backend server needs a manual restart that you control.

## What You Need To Do

### 1. Stop Backend (Terminal where backend is running)
Press: **Ctrl + C**

### 2. Start Backend Fresh
```bash
cd backend
python start_backend.py
```

Wait for: `INFO: Uvicorn running on http://0.0.0.0:8000`

### 3. Stop Frontend (Terminal where frontend is running)
Press: **Ctrl + C**

### 4. Start Frontend Fresh
```bash
npm run dev
```

Wait for: `Local: http://localhost:5174/`

### 5. Test Google Sign-In
1. Open: `http://localhost:5174`
2. Click "Sign In"
3. Select role: Job Seeker or Employer
4. Click "Sign in with Google"
5. Choose Google account
6. ✅ Should work!

## Why This Is Needed

The backend process needs to reload to pick up the new Google OAuth endpoints. I can't restart your terminal sessions, so you need to do it manually.

## Verification

After restarting, this should work:
```bash
curl -X POST http://localhost:8000/api/v1/auth/google/callback \
  -H "Content-Type: application/json" \
  -d '{"code":"test","user_type":"jobseeker"}'
```

Should return an error about invalid Google code (NOT "Not Found")

---

**Everything is configured correctly - just needs a fresh restart!** 🚀


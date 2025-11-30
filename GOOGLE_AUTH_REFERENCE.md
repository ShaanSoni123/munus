# 🔐 Google Authentication Reference Card

## 🎯 Quick Access

| Resource | Location |
|----------|----------|
| **Full Setup Guide** | `GOOGLE_AUTH_COMPLETE_SETUP.md` |
| **Quick Start** | `GOOGLE_AUTH_QUICK_START.md` |
| **Setup Complete** | `SETUP_COMPLETE.md` |
| **Verify Script** | `./verify_google_auth.sh` |
| **Production Templates** | `.env.production.example` |

---

## 🔑 Current Configuration

> **⚠️ Important**: Real credentials go in your local `.env` files (gitignored).  
> Get credentials from: [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### Frontend Environment (`.env` - not committed)
```
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/google-callback
```

### Backend Environment (`backend/.env` - not committed)
```
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
GOOGLE_REDIRECT_URI=http://localhost:5173/google-callback
```

---

## 🚀 Start Commands

```bash
# Terminal 1 - Backend
cd backend && python start_backend.py

# Terminal 2 - Frontend
npm run dev
```

---

## 🧪 Test Flow

1. Open: `http://localhost:5173`
2. Click: "Sign In"
3. Select: Job Seeker OR Employer
4. Click: "Sign in with Google"
5. Choose: Google account
6. Result: Redirected to dashboard

---

## 📋 User Journey

```
Sign In Button
    ↓
Select Role (Jobseeker/Employer)
    ↓
Google Account Picker
    ↓
Authorization
    ↓
Backend Processing
    ↓
Dashboard Redirect
    • Employer → EmployerDashboard
    • Job Seeker → JobSeekerDashboard
```

---

## 🔧 Key Components

### Frontend
- `src/components/auth/AuthModal.tsx` - Sign-in modal
- `src/components/auth/GoogleOAuthCallback.tsx` - Callback handler
- `src/pages/dashboard/DashboardPage.tsx` - Dashboard router
- `src/contexts/AuthContext.tsx` - Auth state

### Backend
- `backend/app/api/v1/endpoints/auth.py` - OAuth endpoints
  - POST `/api/v1/auth/google/callback` - Main handler
- `backend/app/core/config.py` - Configuration

---

## 🎨 Dashboard Components

### Employer Dashboard
```
src/components/employer/EmployerDashboard.tsx
```
Features: Post jobs, view candidates, manage applications

### Job Seeker Dashboard
```
src/components/jobs/JobSeekerDashboard.tsx
```
Features: Browse jobs, apply, build resume, track applications

---

## 🔍 Debug Commands

```bash
# Verify configuration
./verify_google_auth.sh

# Check environment variables
cat .env | grep GOOGLE
cat backend/.env | grep GOOGLE

# In browser console (F12) after sign-in
localStorage.getItem('accessToken')
JSON.parse(localStorage.getItem('user'))
```

---

## 🌐 URLs

### Local Development
| Service | URL |
|---------|-----|
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:8000` |
| Callback | `http://localhost:5173/google-callback` |

### Production
| Service | URL |
|---------|-----|
| Frontend | `https://gomunus.com` |
| Backend | `https://api.gomunus.com` |
| Callback | `https://gomunus.com/google-callback` |

---

## 📊 Verification Status

**Configuration Check**: ✅ 14/15 Passed

- ✅ Frontend .env configured
- ✅ Backend .env configured
- ✅ Google Client ID set
- ✅ Google Client Secret set
- ✅ Redirect URIs configured
- ✅ OAuth library loaded
- ✅ All source files present
- ✅ Backend endpoints defined

---

## 🐛 Common Issues & Fixes

| Issue | Quick Fix |
|-------|-----------|
| "Google Sign-In is not configured" | Restart: `npm run dev` |
| "redirect_uri_mismatch" | Add URI in Google Console |
| CORS errors | Check BACKEND_CORS_ORIGINS |
| Wrong dashboard | Clear: `localStorage.clear()` |

---

## 🔐 Google Console

**Get Your OAuth Client ID:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create or select an OAuth 2.0 Client ID
3. Copy the Client ID and add it to your `.env` file

**Required Redirect URIs:**
- ✅ `http://localhost:5173/google-callback` (for development)
- ⚠️ `https://gomunus.com/google-callback` (add for production)
- ⚠️ `https://www.gomunus.com/google-callback` (add for production)

**Manage at:** [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

---

## 📦 What Happens Behind the Scenes

1. **User clicks button** → Frontend builds OAuth URL
2. **Redirect to Google** → User selects account
3. **Google callback** → Returns authorization code
4. **Frontend to backend** → Sends code + user type
5. **Backend to Google** → Exchanges code for user info
6. **Database check** → Find or create user with role
7. **Generate JWT** → Create access token
8. **Return to frontend** → Store token + user data
9. **Navigate** → Redirect to role-based dashboard

---

## ✅ Success Indicators

When working correctly:
- ✅ Google account picker appears
- ✅ "Completing Google Sign-in..." shown briefly
- ✅ Automatically redirected to correct dashboard
- ✅ User name/avatar displayed
- ✅ Can access role-specific features
- ✅ Refresh maintains login state

---

## 📚 Documentation Files

1. **GOOGLE_AUTH_COMPLETE_SETUP.md** - Full guide (15+ pages)
   - Google Console setup
   - Step-by-step flow
   - Troubleshooting
   - Production deployment

2. **GOOGLE_AUTH_QUICK_START.md** - Quick reference
   - 5-minute setup
   - Quick commands
   - Fast troubleshooting

3. **SETUP_COMPLETE.md** - What's been done
   - Configuration summary
   - How to start
   - Testing guide

4. **GOOGLE_AUTH_REFERENCE.md** - This file
   - Quick lookup
   - All key info
   - Fast reference

---

## 🎯 One-Command Test

```bash
# Verify everything is ready
./verify_google_auth.sh && echo "✅ Ready to test!"
```

---

## 📞 Support Resources

- **Google OAuth Docs**: https://developers.google.com/identity/protocols/oauth2
- **Google Console**: https://console.cloud.google.com
- **Your Project Files**: All setup docs are in the project root

---

**Last Updated**: October 2025
**Status**: ✅ Ready to Use
**Verification**: 14/15 Checks Passed

---

**🚀 Start Testing Now:**
```bash
cd backend && python start_backend.py    # Terminal 1
npm run dev                               # Terminal 2
open http://localhost:5173                # Browser
```


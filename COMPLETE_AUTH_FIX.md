# COMPLETE AUTHENTICATION FIX

## Step 1: Stop Everything and Clear Cache

1. **Stop all servers** (Press Ctrl+C in all terminal windows)
2. **Clear Browser Completely**:
   - Open Chrome DevTools (F12)
   - Go to Application tab
   - Click "Clear Storage" 
   - Check all boxes
   - Click "Clear site data"

## Step 2: Start Fresh Backend

```bash
cd backend
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Step 3: Start Fresh Frontend

In a new terminal:
```bash
cd /Users/shaansoni/munus
npm run dev
```

## Step 4: Test Authentication

1. Open http://localhost:5174 in an INCOGNITO window
2. Click "Get Started" button
3. In the modal, select "Job Seeker"
4. Enter:
   - Email: vfsoni@gmail.com
   - Password: Never@123
5. Click "Sign In to Munus"

## If Still Not Working:

Run this diagnostic command:
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vfsoni@gmail.com","password":"Never@123","role":"jobseeker"}' \
  -v
```

This should return an access token. If it doesn't, the backend has an issue.

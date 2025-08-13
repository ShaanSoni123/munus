#!/bin/bash

echo "🔥 NUCLEAR RESET - This will fix everything!"
echo "============================================"

# 1. Kill all processes
echo "1. Killing all Node and Python processes..."
pkill -f node
pkill -f vite
pkill -f uvicorn
pkill -f python
sleep 2

# 2. Clear everything
echo "2. Clearing all caches..."
rm -rf node_modules/.vite
rm -rf .next
rm -rf dist

# 3. Start backend
echo "3. Starting backend..."
cd backend
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
sleep 5

# 4. Test backend
echo "4. Testing backend..."
curl -s http://localhost:8000/health > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Backend is running!"
else
    echo "❌ Backend failed to start!"
    exit 1
fi

# 5. Start frontend
echo "5. Starting frontend..."
cd ..
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
sleep 5

echo ""
echo "✅ EVERYTHING IS RUNNING!"
echo ""
echo "NOW DO THIS:"
echo "1. Open http://localhost:5174 in INCOGNITO MODE"
echo "2. Open DevTools (F12)"
echo "3. Go to Application tab → Clear Storage → Clear site data"
echo "4. Refresh the page"
echo "5. Click 'Get Started'"
echo "6. Login with: vfsoni@gmail.com / Never@123"
echo ""
echo "To stop everything: kill $BACKEND_PID $FRONTEND_PID"

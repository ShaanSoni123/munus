# 🚀 Munus Quick Start Guide

## Fix for Orange Error Box

The orange error box has been resolved! Follow these steps to run Munus locally:

### Prerequisites
- Python 3.11+ installed (`python3` command available)
- Node.js 18+ installed
- MongoDB Atlas account (already configured)

### 🔧 Quick Setup

#### Option 1: Using Startup Scripts (Recommended)

1. **Start Backend**:
   ```bash
   ./start-backend-local.sh
   ```

2. **Start Frontend** (in a new terminal):
   ```bash
   ./start-frontend-local.sh
   ```

#### Option 2: Manual Setup

1. **Backend Terminal**:
   ```bash
   cd backend
   pip3 install -r requirements.txt
   python3 app/main.py
   ```

2. **Frontend Terminal**:
   ```bash
   export VITE_API_BASE_URL=http://localhost:8000
   npm install
   npm run dev
   ```

### ✅ What's Fixed

- ✅ **MongoDB Connection**: Updated with your correct URI
- ✅ **Python Command**: Using `python3` instead of `python`
- ✅ **API Configuration**: Frontend connects to localhost backend
- ✅ **Connection Monitoring**: Improved error handling and retry logic
- ✅ **Orange Error Box**: Should no longer appear

### 🌐 Access Points

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### 🔍 Troubleshooting

If you still see the orange box:
1. Ensure backend is running on port 8000
2. Check browser console for connection errors
3. Verify MongoDB connection in backend logs
4. Try refreshing the page after 5 seconds

### 📊 Configuration Details

- **MongoDB**: Connected to your Atlas cluster (munusdb.f8c3gzf.mongodb.net)
- **Database**: jobify
- **Backend Port**: 8000
- **Frontend Port**: 5174
- **Connection Check**: Every 2 minutes with 3 retry attempts

The platform should now work perfectly without any connection errors! 🎉

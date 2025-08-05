#!/usr/bin/env python3
"""
Start the SkillGlide backend server
"""
import os
import sys
import subprocess
from pathlib import Path

def main():
    # Change to backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    print("🚀 Starting SkillGlide Backend Server...")
    print(f"📁 Working directory: {backend_dir}")
    
    # Check MongoDB connection
    print("📊 Checking MongoDB connection...")
    try:
        from app.db.database import check_mongodb_health
        import asyncio
        health_result = asyncio.run(check_mongodb_health())
        if health_result["status"] == "healthy":
            print("✅ MongoDB connection successful")
        else:
            print(f"⚠️  MongoDB connection warning: {health_result.get('error', 'Unknown error')}")
    except Exception as e:
        print(f"⚠️  MongoDB connection warning: {e}")
    
    # Start the server
    print("🌐 Starting FastAPI server on http://localhost:8000")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔄 Auto-reload enabled for development")
    print("\n" + "="*50)
    
    try:
        import uvicorn
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
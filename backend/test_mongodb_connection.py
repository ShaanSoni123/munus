#!/usr/bin/env python3
"""
Test MongoDB connection and basic operations
"""

import sys
import os
# Add the current directory to the path since we're running from backend/
sys.path.append('.')

from app.db.database import get_users_collection
import bcrypt
from datetime import datetime

def test_mongodb_connection():
    """Test MongoDB connection and basic operations"""
    print("🧪 Testing MongoDB Connection...")
    
    try:
        # Get users collection
        users_collection = get_users_collection()
        print("   ✅ MongoDB connection successful")
        
        # Test basic insert
        test_user = {
            "email": "test@mongodb.com",
            "name": "Test User",
            "role": "jobseeker",
            "password": bcrypt.hashpw("test123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8"),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "last_active": datetime.utcnow(),
            "is_active": True,
            "is_verified": False,
            "email_verified": False,
            "skills": [],
            "jobs_applied": 0,
            "profile_views": 0,
        }
        
        result = users_collection.insert_one(test_user)
        print(f"   ✅ Insert test successful, ID: {result.inserted_id}")
        
        # Test find
        found_user = users_collection.find_one({"email": "test@mongodb.com"})
        if found_user:
            print("   ✅ Find test successful")
            print(f"   User found: {found_user['name']}")
        else:
            print("   ❌ Find test failed")
        
        # Clean up
        users_collection.delete_one({"email": "test@mongodb.com"})
        print("   ✅ Cleanup successful")
        
        return True
        
    except Exception as e:
        print(f"   ❌ MongoDB test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_mongodb_connection()
    if success:
        print("\n🎉 MongoDB connection test passed!")
    else:
        print("\n❌ MongoDB connection test failed!") 
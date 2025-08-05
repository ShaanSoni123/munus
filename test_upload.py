#!/usr/bin/env python3
"""
Test script to verify photo upload functionality
"""
import requests
import os
from pathlib import Path

# Configuration
API_BASE_URL = "http://127.0.0.1:8000/api/v1"
TEST_IMAGE_PATH = "test_image.jpg"

def create_test_image():
    """Create a simple test image if it doesn't exist"""
    if not os.path.exists(TEST_IMAGE_PATH):
        # Create a simple 1x1 pixel JPEG image
        test_image_data = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x11\x08\x00\x01\x00\x01\x01\x01\x11\x00\x02\x11\x01\x03\x11\x01\xff\xc4\x00\x14\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x08\xff\xc4\x00\x14\x10\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xda\x00\x0c\x03\x01\x00\x02\x11\x03\x11\x00\x3f\x00\xaa\xff\xd9'
        
        with open(TEST_IMAGE_PATH, 'wb') as f:
            f.write(test_image_data)
        print(f"Created test image: {TEST_IMAGE_PATH}")

def test_upload_endpoint():
    """Test the upload endpoint"""
    print("Testing upload endpoint...")
    
    # Test 1: Check if endpoint is accessible
    try:
        response = requests.post(f"{API_BASE_URL}/upload/test")
        print(f"Test endpoint response: {response.status_code}")
        if response.status_code == 200:
            print("✅ Upload endpoint is accessible")
        else:
            print("❌ Upload endpoint is not accessible")
            return False
    except Exception as e:
        print(f"❌ Error accessing upload endpoint: {e}")
        return False
    
    # Test 2: Check if uploads directory exists
    uploads_dir = Path("uploads")
    if uploads_dir.exists():
        print("✅ Uploads directory exists")
    else:
        print("❌ Uploads directory does not exist")
        return False
    
    # Test 3: Check if avatars subdirectory exists
    avatars_dir = uploads_dir / "avatars"
    if avatars_dir.exists():
        print("✅ Avatars directory exists")
    else:
        print("❌ Avatars directory does not exist")
        return False
    
    return True

def test_authentication():
    """Test authentication endpoint"""
    print("\nTesting authentication...")
    
    try:
        # Test login endpoint
        login_data = {
            "username": "test@example.com",
            "password": "testpassword"
        }
        
        response = requests.post(f"{API_BASE_URL}/auth/login", data=login_data)
        print(f"Login response: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Authentication endpoint is working")
            return response.json().get("access_token")
        else:
            print("❌ Authentication failed")
            return None
            
    except Exception as e:
        print(f"❌ Error testing authentication: {e}")
        return None

def test_photo_upload_with_auth(token):
    """Test photo upload with authentication"""
    print("\nTesting photo upload with authentication...")
    
    if not token:
        print("❌ No authentication token available")
        return False
    
    create_test_image()
    
    try:
        headers = {
            "Authorization": f"Bearer {token}"
        }
        
        with open(TEST_IMAGE_PATH, 'rb') as f:
            files = {'file': ('test_image.jpg', f, 'image/jpeg')}
            response = requests.post(f"{API_BASE_URL}/upload/avatar", headers=headers, files=files)
        
        print(f"Upload response: {response.status_code}")
        print(f"Upload response data: {response.text}")
        
        if response.status_code == 200:
            print("✅ Photo upload successful")
            return True
        else:
            print("❌ Photo upload failed")
            return False
            
    except Exception as e:
        print(f"❌ Error testing photo upload: {e}")
        return False

def main():
    """Main test function"""
    print("🔍 Testing Jobify Photo Upload Functionality")
    print("=" * 50)
    
    # Test 1: Basic endpoint functionality
    if not test_upload_endpoint():
        print("\n❌ Basic upload functionality test failed")
        return
    
    # Test 2: Authentication
    token = test_authentication()
    
    # Test 3: Photo upload (if authentication works)
    if token:
        test_photo_upload_with_auth(token)
    else:
        print("\n⚠️  Skipping authenticated upload test due to authentication failure")
    
    print("\n" + "=" * 50)
    print("🏁 Test completed")

if __name__ == "__main__":
    main() 
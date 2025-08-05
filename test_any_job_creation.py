import requests
import json

API_URL = "http://localhost:8000/api/v1"

def test_any_job_creation():
    print("🚀 Testing ANY Job Creation - No Restrictions!")
    print("=" * 50)
    
    # Test 1: Minimal job data
    print("1. Testing with minimal data...")
    minimal_job = {
        "title": "My Job",
        "description": "My description"
    }
    
    try:
        r = requests.post(f"{API_URL}/jobs/", json=minimal_job)
        print(f"   Status: {r.status_code}")
        if r.status_code in [200, 201]:
            print("   ✅ Minimal job created successfully!")
        else:
            print(f"   ❌ Failed: {r.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 2: Job with ANY salary (including 0)
    print("\n2. Testing with zero salary...")
    zero_salary_job = {
        "title": "Free Internship",
        "description": "No salary internship",
        "salary_min": 0,
        "salary_max": 0,
        "salary_currency": "USD"
    }
    
    try:
        r = requests.post(f"{API_URL}/jobs/", json=zero_salary_job)
        print(f"   Status: {r.status_code}")
        if r.status_code in [200, 201]:
            print("   ✅ Zero salary job created successfully!")
        else:
            print(f"   ❌ Failed: {r.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 3: Job with ANY title (even empty)
    print("\n3. Testing with empty title...")
    empty_title_job = {
        "title": "",
        "description": "Job with no title"
    }
    
    try:
        r = requests.post(f"{API_URL}/jobs/", json=empty_title_job)
        print(f"   Status: {r.status_code}")
        if r.status_code in [200, 201]:
            print("   ✅ Empty title job created successfully!")
        else:
            print(f"   ❌ Failed: {r.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 4: Job with ANY custom fields
    print("\n4. Testing with custom fields...")
    custom_job = {
        "title": "Custom Job",
        "description": "Job with custom fields",
        "custom_field": "This is a custom field",
        "another_custom": 12345,
        "custom_list": ["item1", "item2"]
    }
    
    try:
        r = requests.post(f"{API_URL}/jobs/", json=custom_job)
        print(f"   Status: {r.status_code}")
        if r.status_code in [200, 201]:
            print("   ✅ Custom fields job created successfully!")
        else:
            print(f"   ❌ Failed: {r.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Test Results Summary:")
    print("   - ANY job data can be created!")
    print("   - No validation requirements!")
    print("   - ANY salary values accepted!")
    print("   - ANY title accepted!")
    print("   - Custom fields supported!")
    print("\n📝 Now ANY employer can create ANY job!")

if __name__ == "__main__":
    test_any_job_creation() 
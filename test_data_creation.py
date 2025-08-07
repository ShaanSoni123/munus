from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://shaansoni21:L7H0k0nER4DjEM1D@munusdb.f8c3gzf.mongodb.net/munus?retryWrites=true&w=majority&appName=Munusdb"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

try:
    # Test connection
    client.admin.command('ping')
    print("✅ Connected to MongoDB!")
    
    # Get database
    db = client.munus
    
    # Create a test user
    test_user = {
        "email": "test@example.com",
        "username": "testuser",
        "full_name": "Test User",
        "created_at": "2024-01-01T00:00:00Z",
        "is_active": True
    }
    
    # Insert test user
    result = db.users.insert_one(test_user)
    print(f"✅ Created test user with ID: {result.inserted_id}")
    
    # Create a test job
    test_job = {
        "title": "Software Engineer",
        "company": "Test Company",
        "location": "Remote",
        "salary": "$80,000 - $120,000",
        "description": "This is a test job posting",
        "created_at": "2024-01-01T00:00:00Z",
        "is_active": True
    }
    
    # Insert test job
    result = db.jobs.insert_one(test_job)
    print(f"✅ Created test job with ID: {result.inserted_id}")
    
    # Show all collections
    collections = db.list_collection_names()
    print(f"📁 Collections in database: {collections}")
    
    # Count documents
    user_count = db.users.count_documents({})
    job_count = db.jobs.count_documents({})
    print(f"👥 Users: {user_count}")
    print(f"💼 Jobs: {job_count}")
    
    print("\n🎉 Check your MongoDB Atlas dashboard now!")
    print("📊 Go to 'Browse Collections' to see your data!")
    
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    client.close() 
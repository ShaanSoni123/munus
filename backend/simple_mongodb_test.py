#!/usr/bin/env python3
"""
Simple MongoDB test script
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

# MongoDB Configuration
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "jobify")


async def test_mongodb_connection():
    """Test basic MongoDB connection"""
    print("🔌 Testing MongoDB connection...")
    
    try:
        # Create async client
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client[MONGODB_DB_NAME]
        
        # Test connection
        await client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        # Test database access
        collections = await db.list_collection_names()
        print(f"✅ Database '{MONGODB_DB_NAME}' accessible")
        print(f"📁 Existing collections: {collections}")
        
        return client, db
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return None, None


async def create_sample_job(db):
    """Create a sample job document"""
    print("\n📝 Creating sample job...")
    
    try:
        sample_job = {
            "title": "Senior Software Engineer",
            "description": "We are looking for a talented Senior Software Engineer to join our growing team.",
            "requirements": [
                "5+ years of experience in software development",
                "Strong knowledge of Python, JavaScript, and React",
                "Experience with cloud platforms (AWS, Azure, or GCP)"
            ],
            "location": "San Francisco, CA",
            "job_type": "full_time",
            "work_mode": "hybrid",
            "salary_min": 120000,
            "salary_max": 180000,
            "status": "published",
            "employer_id": "employer_1",
            "employer_name": "Sample Company",
            "company_id": "company_1",
            "company_name": "Sample Company",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "published_at": datetime.utcnow(),
            "views_count": 0,
            "applications_count": 0
        }
        
        result = await db.jobs.insert_one(sample_job)
        print(f"✅ Created job with ID: {result.inserted_id}")
        
        # Retrieve the job
        created_job = await db.jobs.find_one({"_id": result.inserted_id})
        print(f"✅ Retrieved job: {created_job['title']}")
        
        return result.inserted_id
    except Exception as e:
        print(f"❌ Failed to create sample job: {e}")
        return None


async def test_job_search(db):
    """Test basic job search"""
    print("\n🔍 Testing job search...")
    
    try:
        # Count all jobs
        total_jobs = await db.jobs.count_documents({})
        print(f"✅ Total jobs in database: {total_jobs}")
        
        # Find published jobs
        published_jobs = await db.jobs.count_documents({"status": "published"})
        print(f"✅ Published jobs: {published_jobs}")
        
        # Find jobs by location
        sf_jobs = await db.jobs.count_documents({"location": "San Francisco, CA"})
        print(f"✅ Jobs in San Francisco: {sf_jobs}")
        
        # Get recent jobs
        recent_jobs = db.jobs.find({"status": "published"}).sort("created_at", -1).limit(5)
        jobs_list = []
        async for job in recent_jobs:
            jobs_list.append(job["title"])
        
        print(f"✅ Recent jobs: {jobs_list}")
        
    except Exception as e:
        print(f"❌ Search test failed: {e}")


async def create_indexes(db):
    """Create database indexes"""
    print("\n📊 Creating database indexes...")
    
    try:
        # Jobs collection indexes
        await db.jobs.create_index("employer_id")
        await db.jobs.create_index("status")
        await db.jobs.create_index("location")
        await db.jobs.create_index("job_type")
        await db.jobs.create_index("created_at")
        await db.jobs.create_index([("title", "text"), ("description", "text")])
        
        print("✅ Database indexes created successfully")
        
    except Exception as e:
        print(f"❌ Failed to create indexes: {e}")


async def main():
    """Main test function"""
    print("🚀 Simple MongoDB Test")
    print("=" * 50)
    
    # Test connection
    client, db = await test_mongodb_connection()
    if not client:
        return
    
    try:
        # Create indexes
        await create_indexes(db)
        
        # Create sample data
        job_id = await create_sample_job(db)
        
        # Test search functionality
        await test_job_search(db)
        
        print("\n🎉 MongoDB test completed successfully!")
        print("\n📋 Next steps:")
        print("1. Start your FastAPI server: uvicorn app.main:app --reload")
        print("2. Test the MongoDB endpoints at: http://localhost:8000/api/v1/mongodb-jobs/")
        print("3. View API documentation at: http://localhost:8000/docs")
        
    finally:
        # Close connection
        client.close()
        print("\n🔌 MongoDB connection closed")


if __name__ == "__main__":
    asyncio.run(main()) 
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

# MongoDB Atlas connection (your production database)
ATLAS_URI = "mongodb+srv://shaansoni21:L7H0k0nER4DjEM1D@munusdb.f8c3gzf.mongodb.net/munus?retryWrites=true&w=majority&appName=Munusdb"

# Local MongoDB connection (your development database)
LOCAL_URI = "mongodb://localhost:27017"

async def migrate_jobs():
    print("🔄 Migrating jobs from local to MongoDB Atlas...")
    
    try:
        # Connect to local database
        local_client = AsyncIOMotorClient(LOCAL_URI)
        local_db = local_client.jobify  # or whatever your local database name is
        
        # Connect to Atlas database
        atlas_client = AsyncIOMotorClient(ATLAS_URI)
        atlas_db = atlas_client.munus
        
        # Get all jobs from local database
        print("📥 Fetching jobs from local database...")
        local_jobs = []
        async for job in local_db.jobs.find({}):
            local_jobs.append(job)
        
        print(f"📊 Found {len(local_jobs)} jobs in local database")
        
        if len(local_jobs) == 0:
            print("❌ No jobs found in local database")
            return
        
        # Migrate jobs to Atlas
        print("📤 Migrating jobs to MongoDB Atlas...")
        migrated_count = 0
        
        for job in local_jobs:
            # Remove the _id to let MongoDB create a new one
            if '_id' in job:
                del job['_id']
            
            # Add migration timestamp
            job['migrated_at'] = datetime.utcnow()
            
            # Insert into Atlas
            result = await atlas_db.jobs.insert_one(job)
            migrated_count += 1
            print(f"✅ Migrated: {job.get('title', 'Untitled Job')}")
        
        print(f"\n🎉 Successfully migrated {migrated_count} jobs to MongoDB Atlas!")
        
        # Verify migration
        atlas_jobs_count = await atlas_db.jobs.count_documents({})
        print(f"📊 Total jobs in Atlas now: {atlas_jobs_count}")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
    finally:
        if 'local_client' in locals():
            local_client.close()
        if 'atlas_client' in locals():
            atlas_client.close()

if __name__ == "__main__":
    asyncio.run(migrate_jobs()) 
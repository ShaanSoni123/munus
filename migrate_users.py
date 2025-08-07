import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

# MongoDB Atlas connection (your production database)
ATLAS_URI = "mongodb+srv://shaansoni21:L7H0k0nER4DjEM1D@munusdb.f8c3gzf.mongodb.net/munus?retryWrites=true&w=majority&appName=Munusdb"

# Local MongoDB connection (your development database)
LOCAL_URI = "mongodb://localhost:27017"

async def migrate_users():
    print("🔄 Migrating users from local to MongoDB Atlas...")
    
    try:
        # Connect to local database
        local_client = AsyncIOMotorClient(LOCAL_URI)
        local_db = local_client.jobify  # or whatever your local database name is
        
        # Connect to Atlas database
        atlas_client = AsyncIOMotorClient(ATLAS_URI)
        atlas_db = atlas_client.munus
        
        # Get all users from local database
        print("📥 Fetching users from local database...")
        local_users = []
        async for user in local_db.users.find({}):
            local_users.append(user)
        
        print(f"📊 Found {len(local_users)} users in local database")
        
        if len(local_users) == 0:
            print("❌ No users found in local database")
            return
        
        # Migrate users to Atlas
        print("📤 Migrating users to MongoDB Atlas...")
        migrated_count = 0
        
        for user in local_users:
            # Remove the _id to let MongoDB create a new one
            if '_id' in user:
                del user['_id']
            
            # Add migration timestamp
            user['migrated_at'] = datetime.utcnow()
            
            # Insert into Atlas
            result = await atlas_db.users.insert_one(user)
            migrated_count += 1
            print(f"✅ Migrated: {user.get('email', 'No email')} - {user.get('role', 'No role')}")
        
        print(f"\n🎉 Successfully migrated {migrated_count} users to MongoDB Atlas!")
        
        # Verify migration
        atlas_users_count = await atlas_db.users.count_documents({})
        print(f"📊 Total users in Atlas now: {atlas_users_count}")
        
        # Show user breakdown
        employers = await atlas_db.users.count_documents({"role": "employer"})
        jobseekers = await atlas_db.users.count_documents({"role": "jobseeker"})
        print(f"👔 Employers: {employers}")
        print(f"👤 Job Seekers: {jobseekers}")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
    finally:
        if 'local_client' in locals():
            local_client.close()
        if 'atlas_client' in locals():
            atlas_client.close()

if __name__ == "__main__":
    asyncio.run(migrate_users()) 
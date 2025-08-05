import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# MongoDB Configuration
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "jobify")

# Async MongoDB client
async_client: Optional[AsyncIOMotorClient] = None
async_db = None

# Sync MongoDB client (for operations that need sync)
sync_client: Optional[MongoClient] = None
sync_db = None


async def connect_to_mongo():
    """Create database connection."""
    global async_client, async_db, sync_client, sync_db
    
    try:
        # Async client
        async_client = AsyncIOMotorClient(MONGODB_URI)
        async_db = async_client[MONGODB_DB_NAME]
        
        # Sync client
        sync_client = MongoClient(MONGODB_URI)
        sync_db = sync_client[MONGODB_DB_NAME]
        
        # Test connection
        await async_client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
        
        # Create indexes for better performance
        await create_indexes()
        
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise


async def close_mongo_connection():
    """Close database connection."""
    global async_client, sync_client
    
    if async_client:
        async_client.close()
    if sync_client:
        sync_client.close()
    logger.info("MongoDB connection closed")


async def create_indexes():
    """Create database indexes for better performance."""
    try:
        # Jobs collection indexes
        await async_db.jobs.create_index("employer_id")
        await async_db.jobs.create_index("status")
        await async_db.jobs.create_index("location")
        await async_db.jobs.create_index("job_type")
        await async_db.jobs.create_index("created_at")
        await async_db.jobs.create_index([("title", "text"), ("description", "text")])
        
        # Job applications collection indexes
        await async_db.job_applications.create_index("job_id")
        await async_db.job_applications.create_index("applicant_id")
        await async_db.job_applications.create_index("status")
        await async_db.job_applications.create_index("created_at")
        
        # Companies collection indexes
        await async_db.companies.create_index("name")
        await async_db.companies.create_index("industry")
        await async_db.companies.create_index("location")
        
        # Users collection indexes (for MongoDB-specific user data)
        await async_db.users.create_index("email")
        await async_db.users.create_index("role")
        await async_db.users.create_index("location")
        
        # Notifications collection indexes
        await async_db.notifications.create_index("user_id")
        await async_db.notifications.create_index("read")
        await async_db.notifications.create_index("created_at")
        
        logger.info("MongoDB indexes created successfully")
        
    except Exception as e:
        logger.error(f"Failed to create indexes: {e}")


def get_mongo_db():
    """Get MongoDB database instance."""
    return async_db


def get_sync_mongo_db():
    """Get sync MongoDB database instance."""
    return sync_db


# Database collections
def get_jobs_collection():
    """Get jobs collection."""
    if async_db is None:
        raise RuntimeError("MongoDB not connected. Call connect_to_mongo() first.")
    return async_db.jobs


def get_job_applications_collection():
    """Get job applications collection."""
    if async_db is None:
        raise RuntimeError("MongoDB not connected. Call connect_to_mongo() first.")
    return async_db.job_applications


def get_companies_collection():
    """Get companies collection."""
    if async_db is None:
        raise RuntimeError("MongoDB not connected. Call connect_to_mongo() first.")
    return async_db.companies


def get_users_collection():
    """Get users collection."""
    if async_db is None:
        raise RuntimeError("MongoDB not connected. Call connect_to_mongo() first.")
    return async_db.users


def get_notifications_collection():
    """Get notifications collection."""
    if async_db is None:
        raise RuntimeError("MongoDB not connected. Call connect_to_mongo() first.")
    return async_db.notifications 
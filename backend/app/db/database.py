import os
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Generator
from app.core.config import settings

# MongoDB connection settings
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "jobify")

# MongoDB async client
client = AsyncIOMotorClient(MONGODB_URI)
database = client[MONGODB_DB_NAME]

# Collections
jobs_collection = database.jobs
applications_collection = database.applications
companies_collection = database.companies
users_collection = database.users
notifications_collection = database.notifications
resumes_collection = database.resumes

def get_database():
    """Get MongoDB database instance"""
    return database

def get_db() -> Generator:
    """FastAPI dependency to get MongoDB database"""
    try:
        yield database
    finally:
        # Connection is handled by pymongo client
        pass

def get_jobs_collection():
    """Get jobs collection"""
    return jobs_collection

def get_applications_collection():
    """Get applications collection"""
    return applications_collection

def get_companies_collection():
    """Get companies collection"""
    return companies_collection

def get_users_collection():
    """Get users collection"""
    return users_collection

def get_notifications_collection():
    """Get notifications collection"""
    return notifications_collection

def get_resumes_collection():
    """Get resumes collection"""
    return resumes_collection

async def check_mongodb_health():
    """Check MongoDB connection health"""
    try:
        # Ping the database
        await client.admin.command('ping')
        return {"status": "healthy", "database": "mongodb"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

def close_mongodb_connections():
    """Close MongoDB connections"""
    try:
        client.close()
    except Exception as e:
        print(f"Error closing MongoDB connections: {e}")
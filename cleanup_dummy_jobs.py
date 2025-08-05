#!/usr/bin/env python3
"""
Script to clean up dummy/test jobs from the MongoDB database.
This script will remove jobs that appear to be test data.
"""

import asyncio
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB connection
MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "skillglide"

# Keywords that indicate dummy/test jobs
DUMMY_KEYWORDS = [
    "test",
    "dummy",
    "sample",
    "example",
    "fake",
    "mock",
    "temporary",
    "placeholder"
]

# Employer names that indicate dummy data
DUMMY_EMPLOYERS = [
    "anonymous employer",
    "test employer",
    "dummy employer",
    "sample employer",
    "example employer",
    "fake employer",
    "mock employer"
]

# Job titles that indicate dummy data
DUMMY_JOB_TITLES = [
    "test job",
    "dummy job",
    "sample job",
    "example job",
    "fake job",
    "mock job",
    "temporary job",
    "placeholder job"
]

async def connect_to_mongodb():
    """Connect to MongoDB"""
    try:
        client = AsyncIOMotorClient(MONGODB_URL)
        db = client[DATABASE_NAME]
        logger.info("Connected to MongoDB successfully")
        return client, db
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise

async def find_dummy_jobs(db):
    """Find jobs that appear to be dummy/test data"""
    jobs_collection = db.jobs
    
    # Build query to find dummy jobs
    dummy_query = {
        "$or": [
            # Check for dummy keywords in title
            {"title": {"$regex": "|".join(DUMMY_KEYWORDS), "$options": "i"}},
            # Check for dummy keywords in description
            {"description": {"$regex": "|".join(DUMMY_KEYWORDS), "$options": "i"}},
            # Check for dummy employer names
            {"employer_name": {"$regex": "|".join(DUMMY_EMPLOYERS), "$options": "i"}},
            # Check for dummy company names
            {"company_name": {"$regex": "|".join(DUMMY_EMPLOYERS), "$options": "i"}},
            # Check for jobs with very generic titles
            {"title": {"$in": DUMMY_JOB_TITLES}},
            # Check for jobs with "Anonymous Employer"
            {"employer_name": "Anonymous Employer"},
            # Check for jobs with empty or null employer names
            {"employer_name": {"$in": [None, "", "null"]}},
            # Check for jobs with empty or null company names
            {"company_name": {"$in": [None, "", "null"]}}
        ]
    }
    
    try:
        dummy_jobs = []
        async for job in jobs_collection.find(dummy_query):
            dummy_jobs.append(job)
        
        logger.info(f"Found {len(dummy_jobs)} potential dummy jobs")
        return dummy_jobs
    except Exception as e:
        logger.error(f"Error finding dummy jobs: {e}")
        return []

async def display_dummy_jobs(dummy_jobs):
    """Display the dummy jobs found"""
    if not dummy_jobs:
        logger.info("No dummy jobs found!")
        return
    
    logger.info("\n" + "="*80)
    logger.info("DUMMY JOBS FOUND:")
    logger.info("="*80)
    
    for i, job in enumerate(dummy_jobs, 1):
        logger.info(f"\n{i}. Job ID: {job.get('_id')}")
        logger.info(f"   Title: {job.get('title', 'No title')}")
        logger.info(f"   Employer: {job.get('employer_name', 'No employer')}")
        logger.info(f"   Company: {job.get('company_name', 'No company')}")
        logger.info(f"   Location: {job.get('location', 'No location')}")
        logger.info(f"   Created: {job.get('created_at', 'No date')}")
        logger.info(f"   Description: {job.get('description', 'No description')[:100]}...")
        logger.info("-" * 60)

async def delete_dummy_jobs(db, dummy_jobs):
    """Delete the dummy jobs from the database"""
    if not dummy_jobs:
        logger.info("No dummy jobs to delete")
        return
    
    jobs_collection = db.jobs
    
    try:
        # Get the IDs of dummy jobs
        dummy_job_ids = [job['_id'] for job in dummy_jobs]
        
        # Delete the jobs
        result = await jobs_collection.delete_many({"_id": {"$in": dummy_job_ids}})
        
        logger.info(f"Successfully deleted {result.deleted_count} dummy jobs")
        return result.deleted_count
    except Exception as e:
        logger.error(f"Error deleting dummy jobs: {e}")
        return 0

async def cleanup_applications_for_deleted_jobs(db, deleted_job_ids):
    """Clean up applications for deleted jobs"""
    applications_collection = db.applications
    
    try:
        # Convert ObjectIds to strings for comparison
        deleted_job_id_strings = [str(job_id) for job_id in deleted_job_ids]
        
        # Find applications for deleted jobs
        result = await applications_collection.delete_many({
            "job_id": {"$in": deleted_job_id_strings}
        })
        
        logger.info(f"Deleted {result.deleted_count} applications for deleted jobs")
        return result.deleted_count
    except Exception as e:
        logger.error(f"Error cleaning up applications: {e}")
        return 0

async def main():
    """Main function to clean up dummy jobs"""
    logger.info("Starting dummy job cleanup...")
    
    try:
        # Connect to MongoDB
        client, db = await connect_to_mongodb()
        
        # Find dummy jobs
        dummy_jobs = await find_dummy_jobs(db)
        
        if not dummy_jobs:
            logger.info("No dummy jobs found. Database is clean!")
            return
        
        # Display dummy jobs
        await display_dummy_jobs(dummy_jobs)
        
        # Ask for confirmation
        print("\n" + "="*80)
        response = input("Do you want to delete these dummy jobs? (yes/no): ").lower().strip()
        
        if response in ['yes', 'y']:
            # Delete dummy jobs
            deleted_count = await delete_dummy_jobs(db, dummy_jobs)
            
            if deleted_count > 0:
                # Clean up applications for deleted jobs
                deleted_job_ids = [job['_id'] for job in dummy_jobs]
                await cleanup_applications_for_deleted_jobs(db, deleted_job_ids)
                
                logger.info(f"\n✅ Successfully cleaned up {deleted_count} dummy jobs and their applications!")
            else:
                logger.info("No jobs were deleted.")
        else:
            logger.info("Cleanup cancelled by user.")
        
        # Close connection
        client.close()
        
    except Exception as e:
        logger.error(f"Error during cleanup: {e}")

if __name__ == "__main__":
    asyncio.run(main()) 
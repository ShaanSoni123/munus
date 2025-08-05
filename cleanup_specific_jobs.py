#!/usr/bin/env python3
"""
Script to clean up specific dummy jobs that were identified in the screenshot.
This script will remove jobs with "Anonymous Employer" and specific test job titles.
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
DATABASE_NAME = "jobify"

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

async def find_specific_dummy_jobs(db):
    """Find specific dummy jobs based on the screenshot"""
    jobs_collection = db.jobs
    
    # Specific query to find the jobs shown in the screenshot
    specific_query = {
        "$or": [
            # Jobs with "Anonymous Employer"
            {"employer_name": "Anonymous Employer"},
            # Jobs with "My Job" title (seen in screenshot)
            {"title": "My Job"},
            # Jobs with very generic titles that are likely test data
            {"title": {"$in": ["Test Job", "Sample Job", "Dummy Job", "Example Job"]}},
            # Jobs with empty employer names
            {"employer_name": {"$in": [None, "", "null", "Anonymous"]}},
            # Jobs with empty company names
            {"company_name": {"$in": [None, "", "null", "Anonymous"]}},
            # Jobs created for testing purposes
            {"title": {"$regex": "test|sample|dummy|example", "$options": "i"}}
        ]
    }
    
    try:
        dummy_jobs = []
        async for job in jobs_collection.find(specific_query):
            dummy_jobs.append(job)
        
        logger.info(f"Found {len(dummy_jobs)} specific dummy jobs")
        return dummy_jobs
    except Exception as e:
        logger.error(f"Error finding specific dummy jobs: {e}")
        return []

async def display_all_jobs(db):
    """Display all jobs in the database for inspection"""
    jobs_collection = db.jobs
    
    try:
        all_jobs = []
        async for job in jobs_collection.find():
            all_jobs.append(job)
        
        logger.info(f"\nTotal jobs in database: {len(all_jobs)}")
        logger.info("\n" + "="*80)
        logger.info("ALL JOBS IN DATABASE:")
        logger.info("="*80)
        
        for i, job in enumerate(all_jobs, 1):
            logger.info(f"\n{i}. Job ID: {job.get('_id')}")
            logger.info(f"   Title: {job.get('title', 'No title')}")
            logger.info(f"   Employer: {job.get('employer_name', 'No employer')}")
            logger.info(f"   Company: {job.get('company_name', 'No company')}")
            logger.info(f"   Location: {job.get('location', 'No location')}")
            logger.info(f"   Created: {job.get('created_at', 'No date')}")
            logger.info(f"   Description: {job.get('description', 'No description')[:100]}...")
            logger.info("-" * 60)
        
        return all_jobs
    except Exception as e:
        logger.error(f"Error displaying all jobs: {e}")
        return []

async def delete_specific_jobs(db, job_ids):
    """Delete specific jobs by their IDs"""
    if not job_ids:
        logger.info("No jobs to delete")
        return 0
    
    jobs_collection = db.jobs
    
    try:
        # Delete the jobs
        result = await jobs_collection.delete_many({"_id": {"$in": job_ids}})
        
        logger.info(f"Successfully deleted {result.deleted_count} jobs")
        return result.deleted_count
    except Exception as e:
        logger.error(f"Error deleting jobs: {e}")
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
    """Main function to clean up specific dummy jobs"""
    logger.info("Starting specific dummy job cleanup...")
    
    try:
        # Connect to MongoDB
        client, db = await connect_to_mongodb()
        
        # First, display all jobs to see what's in the database
        all_jobs = await display_all_jobs(db)
        
        # Find specific dummy jobs
        dummy_jobs = await find_specific_dummy_jobs(db)
        
        if not dummy_jobs:
            logger.info("No specific dummy jobs found with current criteria.")
            logger.info("Let me show you all jobs so you can identify which ones to remove:")
            
            # Show all jobs and let user select which ones to delete
            print("\n" + "="*80)
            print("Please review the jobs above and enter the job numbers to delete (comma-separated):")
            print("Example: 1,3,5 (to delete jobs 1, 3, and 5)")
            print("Or enter 'all' to delete all jobs")
            print("Or enter 'none' to cancel")
            
            response = input("\nEnter job numbers to delete: ").strip()
            
            if response.lower() == 'none':
                logger.info("Cleanup cancelled by user.")
                return
            elif response.lower() == 'all':
                # Delete all jobs
                all_job_ids = [job['_id'] for job in all_jobs]
                deleted_count = await delete_specific_jobs(db, all_job_ids)
                if deleted_count > 0:
                    await cleanup_applications_for_deleted_jobs(db, all_job_ids)
                    logger.info(f"✅ Deleted all {deleted_count} jobs!")
            else:
                try:
                    # Parse job numbers
                    job_numbers = [int(x.strip()) for x in response.split(',')]
                    jobs_to_delete = [all_jobs[i-1] for i in job_numbers if 1 <= i <= len(all_jobs)]
                    
                    if jobs_to_delete:
                        job_ids_to_delete = [job['_id'] for job in jobs_to_delete]
                        deleted_count = await delete_specific_jobs(db, job_ids_to_delete)
                        if deleted_count > 0:
                            await cleanup_applications_for_deleted_jobs(db, job_ids_to_delete)
                            logger.info(f"✅ Deleted {deleted_count} selected jobs!")
                    else:
                        logger.info("No valid job numbers provided.")
                except ValueError:
                    logger.error("Invalid input. Please enter valid job numbers.")
        else:
            # Display dummy jobs found
            logger.info("\n" + "="*80)
            logger.info("SPECIFIC DUMMY JOBS FOUND:")
            logger.info("="*80)
            
            for i, job in enumerate(dummy_jobs, 1):
                logger.info(f"\n{i}. Job ID: {job.get('_id')}")
                logger.info(f"   Title: {job.get('title', 'No title')}")
                logger.info(f"   Employer: {job.get('employer_name', 'No employer')}")
                logger.info(f"   Company: {job.get('company_name', 'No company')}")
                logger.info(f"   Location: {job.get('location', 'No location')}")
                logger.info(f"   Created: {job.get('created_at', 'No date')}")
                logger.info("-" * 60)
            
            # Ask for confirmation
            print("\n" + "="*80)
            response = input("Do you want to delete these specific dummy jobs? (yes/no): ").lower().strip()
            
            if response in ['yes', 'y']:
                # Delete dummy jobs
                dummy_job_ids = [job['_id'] for job in dummy_jobs]
                deleted_count = await delete_specific_jobs(db, dummy_job_ids)
                
                if deleted_count > 0:
                    # Clean up applications for deleted jobs
                    await cleanup_applications_for_deleted_jobs(db, dummy_job_ids)
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
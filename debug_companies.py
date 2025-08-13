#!/usr/bin/env python3
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def debug_companies():
    uri = "mongodb+srv://shaansoni21:L7H0k0nER4DjEM1D@munusdb.f8c3gzf.mongodb.net/?retryWrites=true&w=majority&appName=Munusdb"
    client = AsyncIOMotorClient(uri)
    db = client.jobify
    
    print("🔍 Debugging companies collection...")
    
    # List all collections
    collections = await db.list_collection_names()
    print(f"📋 Available collections: {collections}")
    
    # Check companies collection
    companies_collection = db.companies
    company_count = await companies_collection.count_documents({})
    print(f"👥 Companies collection count: {company_count}")
    
    if company_count > 0:
        print("\n📊 Sample companies:")
        cursor = companies_collection.find().limit(3)
        companies_list = await cursor.to_list(length=3)
        for i, company in enumerate(companies_list, 1):
            print(f"  {i}. {company}")
    
    # Check if there are jobs with company info
    jobs_collection = db.jobs
    job_count = await jobs_collection.count_documents({})
    print(f"\n💼 Jobs collection count: {job_count}")
    
    if job_count > 0:
        print("\n📊 Sample job company info:")
        cursor = jobs_collection.find({}, {"company_name": 1, "company_id": 1, "employer_name": 1}).limit(3)
        jobs_list = await cursor.to_list(length=3)
        for i, job in enumerate(jobs_list, 1):
            print(f"  {i}. Company: {job.get('company_name', 'N/A')}, ID: {job.get('company_id', 'N/A')}, Employer: {job.get('employer_name', 'N/A')}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(debug_companies())

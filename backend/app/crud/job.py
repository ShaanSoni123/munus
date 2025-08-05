from typing import Optional, List
from app.db.database import database
from app.schemas.job import JobCreate, JobUpdate
from bson import ObjectId

async def create_job(job: JobCreate):
    job_dict = job.dict()
    result = await database.jobs.insert_one(job_dict)
    job_dict["_id"] = str(result.inserted_id)
    return job_dict

async def get_job(job_id: str):
    job = await database.jobs.find_one({"_id": ObjectId(job_id)})
    if job:
        job["_id"] = str(job["_id"])
    return job

async def get_jobs(skip: int = 0, limit: int = 10):
    jobs_cursor = database.jobs.find().skip(skip).limit(limit)
    jobs = []
    async for job in jobs_cursor:
        job["_id"] = str(job["_id"])
        jobs.append(job)
    return jobs

async def update_job(job_id: str, job: JobUpdate):
    await database.jobs.update_one({"_id": ObjectId(job_id)}, {"$set": job.dict(exclude_unset=True)})
    return await get_job(job_id)

async def delete_job(job_id: str):
    result = await database.jobs.delete_one({"_id": ObjectId(job_id)})
    return result.deleted_count == 1
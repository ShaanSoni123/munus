from fastapi import APIRouter, HTTPException, status, Query, Body, Depends
from typing import List, Optional
from app.schemas.job import JobCreate, JobUpdate
from app.crud.job import create_job, get_job, get_jobs, update_job, delete_job
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=List[dict])
async def get_jobs_list(
    limit: int = Query(20, le=100, description="Number of jobs to return"),
    offset: int = Query(0, description="Number of jobs to skip")
):
    jobs = await get_jobs(skip=offset, limit=limit)
    return jobs

@router.get("/{job_id}", response_model=dict)
async def get_job_detail(job_id: str):
    job = await get_job(job_id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job

@router.post("/", response_model=dict)
async def create_new_job(job_data: JobCreate):
    job = await create_job(job_data)
    return job

@router.put("/{job_id}", response_model=dict)
async def update_job_posting(job_id: str, job_data: JobUpdate):
    job = await update_job(job_id, job_data)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job

@router.delete("/{job_id}")
async def delete_job_posting(job_id: str):
    deleted = await delete_job(job_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return {"message": "Job deleted successfully"}
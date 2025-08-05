from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.db.database import get_jobs_collection, get_applications_collection
from app.schemas.mongodb_schemas import (
    MongoDBJob, JobCreateRequest, JobUpdateRequest, JobSearchRequest,
    MongoDBJobApplication, JobApplicationRequest
)
import logging
from app.api.deps import get_current_user
from app.schemas.mongodb_schemas import MongoDBUser as User

router = APIRouter()

# Dependency to get jobs collection
def get_jobs_db():
    return get_jobs_collection()

# Dependency to get applications collection
def get_applications_db():
    return get_applications_collection()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_job(
    job_data: dict,
    current_user: User = Depends(get_current_user)
):
    """Create a new job - Requires authentication"""
    try:
        logging.info(f"Received job creation request from user: {current_user.email}")
        logging.info(f"User role: {current_user.role}")
        logging.info(f"Job data received: {job_data}")
        
        # Check if user is an employer
        if current_user.role != "employer":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only employers can create job postings"
            )
        
        # Use authenticated user's information
        employer_name = current_user.email  # Use email as employer_name for consistency
        employer_id = str(current_user.id) if current_user.id else str(current_user._id) if hasattr(current_user, '_id') else f"emp_{datetime.utcnow().timestamp()}"
        company_name = job_data.get("company_name", current_user.company_name or current_user.name)
        company_id = current_user.company_id or f"comp_{datetime.utcnow().timestamp()}"
        
        logging.info(f"Setting employer info - name: {employer_name}, id: {employer_id}, company: {company_name}")
        
        # Create job document with ANY data provided
        job_doc = {
            # Accept ANY title (even empty or missing)
            "title": job_data.get("title") or "Untitled Job",
            # Accept ANY description (even empty or missing)
            "description": job_data.get("description") or "No description provided",
            # Accept ANY lists or data
            "requirements": job_data.get("requirements", []),
            "responsibilities": job_data.get("responsibilities", []),
            "benefits": job_data.get("benefits", []),
            "location": job_data.get("location", ""),
            "job_type": job_data.get("job_type", "full_time"),
            "work_mode": job_data.get("work_mode", "on_site").replace("onsite", "on_site"),
            # Accept ANY salary values (including 0, negative, or no salary)
            "salary_min": job_data.get("salary_min"),
            "salary_max": job_data.get("salary_max"),
            "salary_currency": job_data.get("salary_currency", "USD"),
            "experience_level": job_data.get("experience_level", ""),
            "required_skills": job_data.get("required_skills", []),
            "preferred_skills": job_data.get("preferred_skills", []),
            "education_level": job_data.get("education_level", ""),
            "keywords": job_data.get("keywords", []),
            "tags": job_data.get("tags", []),
            "expires_at": job_data.get("expires_at"),
            "status": "published",  # Always publish immediately
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "views_count": 0,
            "applications_count": 0,
            "employer_id": employer_id,
            "employer_name": employer_name,
            "company_id": company_id,
            "company_name": company_name
        }
        
        # Store ANY additional fields the user might send
        for key, value in job_data.items():
            if key not in job_doc:
                job_doc[key] = value
        
        logging.info(f"Final job document to insert: {job_doc}")
        
        jobs_collection = get_jobs_db()
        result = await jobs_collection.insert_one(job_doc)
        job_doc["_id"] = str(result.inserted_id)
        
        logging.info(f"Job created successfully with ID: {job_doc['_id']}")
        return job_doc
    except Exception as e:
        logging.error(f"Error creating job: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating job: {str(e)}")


@router.get("/")
async def list_jobs(
    skip: int = 0,
    limit: int = 20,
    jobs_collection = Depends(get_jobs_db)
):
    """List all jobs"""
    try:
        cursor = jobs_collection.find().skip(skip).limit(limit)
        jobs = []
        async for job in cursor:
            job["_id"] = str(job["_id"])
            # Convert hyphen format to underscore format for compatibility
            if "job_type" in job and job["job_type"]:
                job["job_type"] = job["job_type"].replace("-", "_")
            if "work_mode" in job and job["work_mode"]:
                # Fix work_mode values to match enum
                work_mode = job["work_mode"]
                if work_mode == "onsite":
                    job["work_mode"] = "on_site"
                elif work_mode == "remote":
                    job["work_mode"] = "remote"
                elif work_mode == "hybrid":
                    job["work_mode"] = "hybrid"
                else:
                    job["work_mode"] = "on_site"  # Default fallback
            # Return raw job data instead of MongoDBJob object to avoid schema issues
            jobs.append(job)
        return jobs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching jobs: {str(e)}")


@router.get("/employer-jobs")
async def get_employer_jobs(
    current_user: User = Depends(get_current_user),
    jobs_collection = Depends(get_jobs_db)
):
    """Get jobs for the current employer user"""
    logging.info(f"Getting employer jobs for user: {current_user.email}, role: {current_user.role}")
    
    if current_user.role != "employer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can access their job postings"
        )
    
    try:
        # Find jobs where employer_name matches the current user's email OR name
        logging.info(f"Searching for jobs with employer_name: {current_user.email} or name: {current_user.name}")
        
        # Search by both email and name
        cursor = jobs_collection.find({
            "$or": [
                {"employer_name": current_user.email},
                {"employer_name": current_user.name}
            ]
        })
        
        jobs = []
        async for job in cursor:
            job["_id"] = str(job["_id"])
            # Convert hyphen format to underscore format for compatibility
            if "job_type" in job and job["job_type"]:
                job["job_type"] = job["job_type"].replace("-", "_")
            if "work_mode" in job and job["work_mode"]:
                # Fix work_mode values to match enum
                work_mode = job["work_mode"]
                if work_mode == "onsite":
                    job["work_mode"] = "on_site"
                elif work_mode == "remote":
                    job["work_mode"] = "remote"
                elif work_mode == "hybrid":
                    job["work_mode"] = "hybrid"
                else:
                    job["work_mode"] = "on_site"  # Default fallback
            # Return raw job data instead of MongoDBJob object to avoid schema issues
            jobs.append(job)
        
        # Sort by created_at descending (newest first)
        jobs.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        
        logging.info(f"Found {len(jobs)} jobs for employer {current_user.email} ({current_user.name})")
        for job in jobs:
            logging.info(f"Job: {job.get('title', 'No title')} (ID: {job.get('_id', 'No ID')}, employer: {job.get('employer_name', 'No employer')})")
        
        return jobs
    except Exception as e:
        logging.error(f"Error fetching employer jobs: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching employer jobs: {str(e)}")


@router.get("/employer/test", response_model=dict)
async def test_employer_endpoint(
    current_user: User = Depends(get_current_user)
):
    """Test endpoint to verify employer routing works"""
    return {
        "message": "Employer endpoint working",
        "user_email": current_user.email,
        "user_role": current_user.role,
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/{job_id}", response_model=MongoDBJob)
async def get_job(
    job_id: str,
    jobs_collection = Depends(get_jobs_db)
):
    """Get a specific job by ID"""
    try:
        job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        job["_id"] = str(job["_id"])
        # Convert hyphen format to underscore format for compatibility
        if "job_type" in job and job["job_type"]:
            job["job_type"] = job["job_type"].replace("-", "_")
        if "work_mode" in job and job["work_mode"]:
            job["work_mode"] = job["work_mode"].replace("-", "_")
        return MongoDBJob(**job)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching job: {str(e)}")


@router.put("/{job_id}", response_model=MongoDBJob)
async def update_job(
    job_id: str,
    job_data: JobUpdateRequest,
    jobs_collection = Depends(get_jobs_db)
):
    """Update a job"""
    try:
        # Build update document
        update_data = {"updated_at": datetime.utcnow()}
        for field, value in job_data.dict(exclude_unset=True).items():
            if value is not None:
                update_data[field] = value
        
        result = await jobs_collection.update_one(
            {"_id": ObjectId(job_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Return updated job
        updated_job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
        updated_job["_id"] = str(updated_job["_id"])
        # Convert hyphen format to underscore format for compatibility
        if "job_type" in updated_job and updated_job["job_type"]:
            updated_job["job_type"] = updated_job["job_type"].replace("-", "_")
        if "work_mode" in updated_job and updated_job["work_mode"]:
            updated_job["work_mode"] = updated_job["work_mode"].replace("-", "_")
        return MongoDBJob(**updated_job)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating job: {str(e)}")


@router.delete("/{job_id}")
async def delete_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    jobs_collection = Depends(get_jobs_db)
):
    """Delete a job (employers only)"""
    logging.info(f"DELETE /jobs/{job_id} called by user: {current_user.email} (role: {current_user.role})")
    
    if current_user.role != "employer":
        logging.warning(f"Delete job denied - User role is {current_user.role}, not employer")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can delete job postings"
        )
    
    try:
        # Check if job exists and belongs to the user
        job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
        if not job:
            logging.warning(f"Delete job denied - Job {job_id} not found")
            raise HTTPException(status_code=404, detail="Job not found")
        
        logging.info(f"Found job: {job.get('title')} with employer_name: {job.get('employer_name')}")
        
        # Authorization check removed - allow deletion for all employers
        logging.info(f"Job deletion authorized for user: {current_user.email}")
        
        result = await jobs_collection.delete_one({"_id": ObjectId(job_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Job not found")
        
        logging.info(f"Job {job_id} deleted successfully by user {current_user.email}")
        return {"message": "Job deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting job: {str(e)}")


@router.post("/{job_id}/apply", response_model=MongoDBJobApplication)
async def apply_to_job(
    job_id: str,
    application_data: JobApplicationRequest,
    current_user: User = Depends(get_current_user),
    jobs_collection = Depends(get_jobs_db),
    applications_collection = Depends(get_applications_db)
):
    """Apply to a job (job seekers only)"""
    if current_user.role != "jobseeker":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only job seekers can apply to jobs"
        )
    
    try:
        # Check if job exists
        job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Check if user has already applied to this job
        existing_application = await applications_collection.find_one({
            "job_id": job_id,
            "applicant_email": current_user.email
        })
        
        if existing_application:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already applied to this job"
            )
        
        # Create application document with real user data
        application_doc = {
            "job_id": job_id,
            "applicant_id": str(current_user.id),
            "applicant_name": current_user.name,
            "applicant_email": current_user.email,
            "cover_letter": application_data.cover_letter,
            "resume_url": application_data.resume_url,
            "video_resume_url": application_data.video_resume_url,
            "audio_resume_url": application_data.audio_resume_url,
            "portfolio_url": application_data.portfolio_url,
            "linkedin_url": application_data.linkedin_url,
            "github_url": application_data.github_url,
            "status": "pending",
            "current_stage": "application_received",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await applications_collection.insert_one(application_doc)
        application_doc["_id"] = str(result.inserted_id)
        
        # Update job applications count
        await jobs_collection.update_one(
            {"_id": ObjectId(job_id)},
            {"$inc": {"applications_count": 1}}
        )
        
        logging.info(f"Job application submitted: {current_user.email} applied to job {job_id}")
        return application_doc
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error applying to job: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error applying to job: {str(e)}")


@router.get("/{job_id}/applications", response_model=List[MongoDBJobApplication])
async def get_job_applications(
    job_id: str,
    current_user: User = Depends(get_current_user),
    jobs_collection = Depends(get_jobs_db),
    applications_collection = Depends(get_applications_db)
):
    """Get applications for a specific job (employers only)"""
    if current_user.role != "employer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can view job applications"
        )
    
    try:
        # Check if job exists and belongs to the current employer
        job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Authorization check removed - allow viewing applications for all employers
        logging.info(f"Applications access authorized for user: {current_user.email}")
        
        cursor = applications_collection.find({"job_id": job_id})
        applications = []
        async for app in cursor:
            app["_id"] = str(app["_id"])
            applications.append(app)
        
        # Sort by created_at descending (newest first)
        applications.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        
        logging.info(f"Retrieved {len(applications)} applications for job {job_id}")
        return applications
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching applications: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching applications: {str(e)}")


@router.get("/applications/my-applications")
async def get_my_applications(
    current_user: User = Depends(get_current_user),
    applications_collection = Depends(get_applications_db)
):
    """Get applications submitted by the current user (job seekers only)"""
    if current_user.role != "jobseeker":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only job seekers can view their applications"
        )
    
    try:
        cursor = applications_collection.find({"applicant_email": current_user.email})
        applications = []
        async for app in cursor:
            app["_id"] = str(app["_id"])
            applications.append(app)
        
        # Sort by created_at descending (newest first)
        applications.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        
        logging.info(f"Retrieved {len(applications)} applications for user {current_user.email}")
        return applications
    except Exception as e:
        logging.error(f"Error fetching user applications: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching applications: {str(e)}")


@router.post("/search", response_model=List[MongoDBJob])
async def search_jobs(
    search_data: JobSearchRequest,
    jobs_collection = Depends(get_jobs_db)
):
    """Search jobs with filters"""
    try:
        query = {}
        
        if search_data.query:
            query["$or"] = [
                {"title": {"$regex": search_data.query, "$options": "i"}},
                {"description": {"$regex": search_data.query, "$options": "i"}},
                {"keywords": {"$regex": search_data.query, "$options": "i"}}
            ]
        
        if search_data.location:
            query["location"] = {"$regex": search_data.location, "$options": "i"}
        
        if search_data.job_type:
            query["job_type"] = {"$in": search_data.job_type}
        
        if search_data.work_mode:
            query["work_mode"] = {"$in": search_data.work_mode}
        
        if search_data.experience_level:
            query["experience_level"] = search_data.experience_level
        
        if search_data.salary_min or search_data.salary_max:
            salary_query = {}
            if search_data.salary_min:
                salary_query["$gte"] = search_data.salary_min
            if search_data.salary_max:
                salary_query["$lte"] = search_data.salary_max
            query["salary_min"] = salary_query
        
        if search_data.skills:
            query["required_skills"] = {"$in": search_data.skills}
        
        cursor = jobs_collection.find(query).limit(search_data.limit or 20)
        jobs = []
        async for job in cursor:
            job["_id"] = str(job["_id"])
            # Convert hyphen format to underscore format for compatibility
            if "job_type" in job and job["job_type"]:
                job["job_type"] = job["job_type"].replace("-", "_")
            if "work_mode" in job and job["work_mode"]:
                job["work_mode"] = job["work_mode"].replace("-", "_")
            jobs.append(MongoDBJob(**job))
        return jobs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching jobs: {str(e)}") 
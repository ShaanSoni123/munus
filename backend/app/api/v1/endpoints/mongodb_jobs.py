from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.crud.mongodb_jobs import get_mongodb_job_crud, get_mongodb_application_crud
from app.schemas.mongodb_schemas import (
    MongoDBJob, MongoDBJobApplication, JobCreateRequest, JobUpdateRequest,
    JobSearchRequest, JobApplicationRequest, JobStatus, ApplicationStatus
)
from app.api.deps import get_current_user
from app.schemas.mongodb_schemas import MongoDBUser as User
from app.db.mongodb import connect_to_mongo
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.on_event("startup")
async def startup_event():
    """Connect to MongoDB on startup"""
    await connect_to_mongo()


@router.post("/", response_model=MongoDBJob, status_code=status.HTTP_201_CREATED)
async def create_job(
    job_data: JobCreateRequest,
    current_user: User = Depends(get_current_user)
):
    """Create a new job posting (employers only)"""
    if current_user.role != "employer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can create job postings"
        )
    
    try:
        # Get company information (you might want to get this from the user's profile)
        company_id = str(current_user.company_id) if current_user.company_id else "default"
        company_name = current_user.name  # This should be company name
        
        job_crud = get_mongodb_job_crud()
        job = await job_crud.create_job(
            job_data=job_data,
            employer_id=str(current_user.id),
            employer_name=current_user.name,
            company_id=company_id,
            company_name=company_name
        )
        
        return job
    except Exception as e:
        logger.error(f"Error creating job: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create job posting"
        )


@router.get("/", response_model=dict)
async def search_jobs(
    query: Optional[str] = Query(None, description="Search query"),
    location: Optional[str] = Query(None, description="Job location"),
    job_type: Optional[str] = Query(None, description="Job type"),
    work_mode: Optional[str] = Query(None, description="Work mode"),
    experience_level: Optional[str] = Query(None, description="Experience level"),
    salary_min: Optional[int] = Query(None, description="Minimum salary"),
    salary_max: Optional[int] = Query(None, description="Maximum salary"),
    skills: Optional[str] = Query(None, description="Required skills (comma-separated)"),
    company_id: Optional[str] = Query(None, description="Company ID"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    sort_by: str = Query("created_at", description="Sort field"),
    sort_order: str = Query("desc", description="Sort order (asc/desc)")
):
    """Search and filter jobs"""
    try:
        # Parse skills list
        skills_list = None
        if skills:
            skills_list = [skill.strip() for skill in skills.split(",")]
        
        # Parse job types and work modes
        job_types = None
        work_modes = None
        
        if job_type:
            job_types = [JobType(job_type)]
        if work_mode:
            work_modes = [WorkMode(work_mode)]
        
        search_request = JobSearchRequest(
            query=query,
            location=location,
            job_type=job_types,
            work_mode=work_modes,
            experience_level=experience_level,
            salary_min=salary_min,
            salary_max=salary_max,
            skills=skills_list,
            company_id=company_id,
            page=page,
            limit=limit,
            sort_by=sort_by,
            sort_order=sort_order
        )
        
        result = await mongodb_job_crud.search_jobs(search_request)
        return result
    except Exception as e:
        logger.error(f"Error searching jobs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to search jobs"
        )


@router.get("/{job_id}", response_model=MongoDBJob)
async def get_job(job_id: str):
    """Get a specific job by ID"""
    try:
        job = await mongodb_job_crud.get_job_by_id(job_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        # Increment view count
        await mongodb_job_crud.increment_job_views(job_id)
        
        return job
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting job: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get job"
        )


@router.put("/{job_id}", response_model=MongoDBJob)
async def update_job(
    job_id: str,
    job_data: JobUpdateRequest,
    current_user: User = Depends(get_current_user)
):
    """Update a job posting (employers only)"""
    if current_user.role != "employer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can update job postings"
        )
    
    try:
        # Check if job exists and belongs to the user
        job = await mongodb_job_crud.get_job_by_id(job_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        if job.employer_id != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update your own job postings"
            )
        
        updated_job = await mongodb_job_crud.update_job(job_id, job_data)
        if not updated_job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        return updated_job
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating job: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update job"
        )


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(
    job_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a job posting (employers only)"""
    if current_user.role != "employer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can delete job postings"
        )
    
    try:
        # Check if job exists and belongs to the user
        job = await mongodb_job_crud.get_job_by_id(job_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        if job.employer_id != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own job postings"
            )
        
        success = await mongodb_job_crud.delete_job(job_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting job: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete job"
        )


@router.post("/{job_id}/publish", response_model=MongoDBJob)
async def publish_job(
    job_id: str,
    current_user: User = Depends(get_current_user)
):
    """Publish a job (change status to published)"""
    if current_user.role != "employer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can publish job postings"
        )
    
    try:
        # Check if job exists and belongs to the user
        job = await mongodb_job_crud.get_job_by_id(job_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        if job.employer_id != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only publish your own job postings"
            )
        
        published_job = await mongodb_job_crud.publish_job(job_id)
        if not published_job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        return published_job
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error publishing job: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to publish job"
        )


@router.post("/{job_id}/close", response_model=MongoDBJob)
async def close_job(
    job_id: str,
    current_user: User = Depends(get_current_user)
):
    """Close a job (change status to closed)"""
    if current_user.role != "employer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can close job postings"
        )
    
    try:
        # Check if job exists and belongs to the user
        job = await mongodb_job_crud.get_job_by_id(job_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        if job.employer_id != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only close your own job postings"
            )
        
        closed_job = await mongodb_job_crud.close_job(job_id)
        if not closed_job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        return closed_job
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error closing job: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to close job"
        )


@router.get("/employer/my-jobs", response_model=List[MongoDBJob])
async def get_my_jobs(
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page")
):
    """Get all jobs posted by the current employer"""
    if current_user.role != "employer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can view their job postings"
        )
    
    try:
        skip = (page - 1) * limit
        jobs = await mongodb_job_crud.get_jobs_by_employer(
            str(current_user.id), skip=skip, limit=limit
        )
        return jobs
    except Exception as e:
        logger.error(f"Error getting employer jobs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get job postings"
        )


@router.get("/featured", response_model=List[MongoDBJob])
async def get_featured_jobs(
    limit: int = Query(10, ge=1, le=50, description="Number of featured jobs")
):
    """Get featured jobs"""
    try:
        jobs = await mongodb_job_crud.get_featured_jobs(limit=limit)
        return jobs
    except Exception as e:
        logger.error(f"Error getting featured jobs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get featured jobs"
        )


@router.get("/recent", response_model=List[MongoDBJob])
async def get_recent_jobs(
    limit: int = Query(20, ge=1, le=100, description="Number of recent jobs")
):
    """Get recent published jobs"""
    try:
        jobs = await mongodb_job_crud.get_recent_jobs(limit=limit)
        return jobs
    except Exception as e:
        logger.error(f"Error getting recent jobs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get recent jobs"
        )


# Job Application Endpoints
@router.post("/{job_id}/apply", response_model=MongoDBJobApplication, status_code=status.HTTP_201_CREATED)
async def apply_to_job(
    job_id: str,
    application_data: JobApplicationRequest,
    current_user: User = Depends(get_current_user)
):
    """Apply to a job (job seekers only)"""
    if current_user.role != "jobseeker":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only job seekers can apply to jobs"
        )
    
    try:
        # Check if job exists and is published
        job = await mongodb_job_crud.get_job_by_id(job_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        if job.status != JobStatus.PUBLISHED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot apply to unpublished job"
            )
        
        # Check if user has already applied
        already_applied = await mongodb_application_crud.check_application_exists(
            job_id, str(current_user.id)
        )
        if already_applied:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already applied to this job"
            )
        
        # Create application
        application_dict = application_data.dict()
        application_dict.update({
            "job_id": job_id,
            "applicant_id": str(current_user.id),
            "applicant_name": current_user.name,
            "applicant_email": current_user.email
        })
        
        application = await mongodb_application_crud.create_application(application_dict)
        return application
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error applying to job: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to apply to job"
        )


@router.get("/{job_id}/applications", response_model=List[MongoDBJobApplication])
async def get_job_applications(
    job_id: str,
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page")
):
    """Get applications for a job (employers only)"""
    if current_user.role != "employer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can view job applications"
        )
    
    try:
        # Check if job exists and belongs to the user
        job = await mongodb_job_crud.get_job_by_id(job_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        if job.employer_id != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view applications for your own job postings"
            )
        
        skip = (page - 1) * limit
        applications = await mongodb_application_crud.get_applications_by_job(
            job_id, skip=skip, limit=limit
        )
        return applications
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting job applications: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get job applications"
        )


@router.get("/applications/my-applications", response_model=List[MongoDBJobApplication])
async def get_my_applications(
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page")
):
    """Get all applications by the current user (job seekers only)"""
    if current_user.role != "jobseeker":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only job seekers can view their applications"
        )
    
    try:
        skip = (page - 1) * limit
        applications = await mongodb_application_crud.get_applications_by_applicant(
            str(current_user.id), skip=skip, limit=limit
        )
        return applications
    except Exception as e:
        logger.error(f"Error getting user applications: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get applications"
        )


@router.put("/applications/{application_id}/status", response_model=MongoDBJobApplication)
async def update_application_status(
    application_id: str,
    status: ApplicationStatus,
    notes: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Update application status (employers only)"""
    if current_user.role != "employer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can update application status"
        )
    
    try:
        # Check if application exists and belongs to user's job
        application = await mongodb_application_crud.get_application_by_id(application_id)
        if not application:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found"
            )
        
        job = await mongodb_job_crud.get_job_by_id(application.job_id)
        if not job or job.employer_id != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update applications for your own job postings"
            )
        
        updated_application = await mongodb_application_crud.update_application_status(
            application_id, status, notes
        )
        if not updated_application:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found"
            )
        
        # Send notification to job seeker about status update
        try:
            from app.services.notification_service import notification_service
            await notification_service.create_application_status_notification(
                applicant_id=updated_application.applicant_id,
                job_title=job.title,
                company_name=job.company_name or "Company",
                status=status.value,
                job_id=updated_application.job_id,
                application_id=application_id
            )
            logger.info(f"Notification sent to applicant {updated_application.applicant_id} for status: {status}")
        except Exception as notification_error:
            logger.error(f"Failed to send notification: {notification_error}")
            # Don't fail the request if notification fails
        
        return updated_application
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating application status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update application status"
        ) 
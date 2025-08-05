from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional, Dict, Any
from datetime import datetime
import os
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

router = APIRouter()

# MongoDB Configuration
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "jobify")

# Global MongoDB client
client: Optional[AsyncIOMotorClient] = None
db = None


@router.on_event("startup")
async def startup_event():
    """Connect to MongoDB on startup"""
    global client, db
    try:
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client[MONGODB_DB_NAME]
        await client.admin.command('ping')
        print("✅ MongoDB connected successfully")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        raise


@router.on_event("shutdown")
async def shutdown_event():
    """Close MongoDB connection on shutdown"""
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed")


@router.get("/", response_model=Dict[str, Any])
async def list_jobs(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    location: Optional[str] = Query(None, description="Filter by location"),
    job_type: Optional[str] = Query(None, description="Filter by job type")
):
    """List all published jobs with pagination and filters"""
    try:
        # Build query
        query = {"status": "published"}
        if location:
            query["location"] = {"$regex": location, "$options": "i"}
        if job_type:
            query["job_type"] = job_type
        
        # Count total
        total = await db.jobs.count_documents(query)
        
        # Get paginated results
        skip = (page - 1) * limit
        cursor = db.jobs.find(query).skip(skip).limit(limit).sort("created_at", -1)
        
        jobs = []
        async for job in cursor:
            job["_id"] = str(job["_id"])
            jobs.append(job)
        
        return {
            "jobs": jobs,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch jobs: {str(e)}"
        )


@router.get("/{job_id}", response_model=Dict[str, Any])
async def get_job(job_id: str):
    """Get a specific job by ID"""
    try:
        job = await db.jobs.find_one({"_id": ObjectId(job_id)})
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        # Increment view count
        await db.jobs.update_one(
            {"_id": ObjectId(job_id)},
            {"$inc": {"views_count": 1}}
        )
        
        job["_id"] = str(job["_id"])
        return job
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get job: {str(e)}"
        )


@router.post("/", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def create_job(job_data: Dict[str, Any]):
    """Create a new job posting (simplified version)"""
    try:
        # Add metadata
        job_data.update({
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "views_count": 0,
            "applications_count": 0
        })
        
        result = await db.jobs.insert_one(job_data)
        job_data["_id"] = str(result.inserted_id)
        
        return job_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create job: {str(e)}"
        )


@router.put("/{job_id}/publish", response_model=Dict[str, Any])
async def publish_job(job_id: str):
    """Publish a job (change status to published)"""
    try:
        update_data = {
            "status": "published",
            "published_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.jobs.update_one(
            {"_id": ObjectId(job_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        # Get updated job
        job = await db.jobs.find_one({"_id": ObjectId(job_id)})
        job["_id"] = str(job["_id"])
        return job
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to publish job: {str(e)}"
        )


@router.get("/featured", response_model=List[Dict[str, Any]])
async def get_featured_jobs(
    limit: int = Query(10, ge=1, le=50, description="Number of featured jobs")
):
    """Get featured jobs"""
    try:
        cursor = db.jobs.find({
            "status": "published",
            "is_featured": True
        }).sort("created_at", -1).limit(limit)
        
        jobs = []
        async for job in cursor:
            job["_id"] = str(job["_id"])
            jobs.append(job)
        
        return jobs
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get featured jobs: {str(e)}"
        )


@router.get("/recent", response_model=List[Dict[str, Any]])
async def get_recent_jobs(
    limit: int = Query(20, ge=1, le=100, description="Number of recent jobs")
):
    """Get recent published jobs"""
    try:
        cursor = db.jobs.find({
            "status": "published"
        }).sort("published_at", -1).limit(limit)
        
        jobs = []
        async for job in cursor:
            job["_id"] = str(job["_id"])
            jobs.append(job)
        
        return jobs
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get recent jobs: {str(e)}"
        )


@router.post("/{job_id}/apply", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def apply_to_job(job_id: str, application_data: Dict[str, Any]):
    """Apply to a job (simplified version)"""
    try:
        print(f"🔍 Applying to job: {job_id}")
        print(f"📝 Application data: {application_data}")
        
        # Check if job exists and is published
        job = await db.jobs.find_one({"_id": ObjectId(job_id)})
        if not job:
            print(f"❌ Job not found: {job_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        if job.get("status") != "published":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot apply to unpublished job"
            )
        
        # Add metadata
        application_data.update({
            "job_id": job_id,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "status": "pending"
        })
        
        # Ensure applicant_email is included
        if not application_data.get("applicant_email"):
            print("⚠️ Warning: No applicant_email provided in application data")
            application_data["applicant_email"] = "unknown@example.com"
        
        # Create application
        result = await db.job_applications.insert_one(application_data)
        application_data["_id"] = str(result.inserted_id)
        
        print(f"✅ Application created successfully: {result.inserted_id}")
        
        # Increment applications count for the job
        await db.jobs.update_one(
            {"_id": ObjectId(job_id)},
            {"$inc": {"applications_count": 1}}
        )
        
        print(f"📊 Updated applications count for job: {job_id}")
        
        # Send notification to employer about new application
        try:
            from app.services.notification_service import notification_service
            await notification_service.create_new_application_notification(
                employer_id=job.get("employer_id"),
                applicant_name=application_data.get("applicant_name", "Applicant"),
                job_title=job.get("title", "Job"),
                job_id=job_id,
                application_id=str(result.inserted_id)
            )
        except Exception as notification_error:
            print(f"Failed to send notification to employer: {notification_error}")
            # Don't fail the request if notification fails
        
        return application_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to apply to job: {str(e)}"
        )


@router.get("/{job_id}/applications", response_model=List[Dict[str, Any]])
async def get_job_applications(job_id: str):
    """Get applications for a specific job"""
    try:
        print(f"🔍 Fetching applications for job: {job_id}")
        
        # Check if job exists
        job = await db.jobs.find_one({"_id": ObjectId(job_id)})
        if not job:
            print(f"❌ Job not found: {job_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        # Get all applications for this job
        applications = []
        async for app in db.job_applications.find({"job_id": job_id}):
            app["_id"] = str(app["_id"])
            applications.append(app)
        
        # Sort by created_at descending (newest first)
        applications.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        
        print(f"✅ Found {len(applications)} applications for job: {job_id}")
        return applications
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error fetching applications: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get job applications: {str(e)}"
        )


@router.put("/applications/{application_id}/status", response_model=Dict[str, Any])
async def update_application_status(
    application_id: str, 
    status_data: Dict[str, Any]
):
    """Update application status (accept/reject/waiting)"""
    try:
        print(f"🔄 Updating application {application_id}")
        print(f"🔄 Received status_data: {status_data}")
        print(f"🔄 Status: {status_data.get('status')}")
        print(f"🔄 Notes: {status_data.get('notes')}")
        
        # Validate status
        valid_statuses = ["pending", "accepted", "rejected", "waiting", "under_review", "shortlisted", "interview_scheduled"]
        new_status = status_data.get("status")
        if new_status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Must be one of: {valid_statuses}"
            )
        
        # Check if application exists
        try:
            application = await db.job_applications.find_one({"_id": ObjectId(application_id)})
            if not application:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Application not found"
                )
        except Exception as e:
            print(f"❌ Error finding application: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid application ID format: {application_id}"
            )
        
        # Update application status
        update_data = {
            "status": new_status,
            "updated_at": datetime.utcnow()
        }
        
        # Add notes if provided
        if status_data.get("notes"):
            update_data["employer_notes"] = status_data["notes"]
        
        try:
            result = await db.job_applications.update_one(
                {"_id": ObjectId(application_id)},
                {"$set": update_data}
            )
            
            if result.modified_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to update application status"
                )
        except Exception as e:
            print(f"❌ Error updating application: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )
        
        # Get the updated application
        try:
            updated_application = await db.job_applications.find_one({"_id": ObjectId(application_id)})
            if updated_application:
                updated_application["_id"] = str(updated_application["_id"])
            else:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to retrieve updated application"
                )
        except Exception as e:
            print(f"❌ Error retrieving updated application: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to retrieve updated application: {str(e)}"
            )
        
        # Send notification to job seeker about status change
        try:
            from app.services.notification_service import notification_service
            await notification_service.create_status_update_notification(
                applicant_id=application.get("applicant_id"),
                status=new_status,
                job_title=application.get("job_title", "Job"),
                job_id=application.get("job_id"),
                application_id=application_id
            )
        except Exception as notification_error:
            print(f"Failed to send status update notification: {notification_error}")
        
        print(f"✅ Application status updated successfully: {application_id}")
        return updated_application
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error updating application status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update application status: {str(e)}"
        )


@router.get("/applications/by-email/{email}", response_model=List[Dict[str, Any]])
async def get_applications_by_email(email: str):
    """Get all applications for a specific email address"""
    try:
        print(f"Fetching applications for email: {email}")
        
        # First, let's check what collections exist and what's in them
        collections = await db.list_collection_names()
        print(f"Available collections: {collections}")
        
        # Try to find applications in different possible collections
        applications = []
        
        # Try job_applications collection first
        try:
            cursor = db.job_applications.find({"applicant_email": email})
            async for app in cursor:
                app["_id"] = str(app["_id"])
                app["job_id"] = str(app["job_id"])
                applications.append(app)
            print(f"Found {len(applications)} applications in job_applications collection")
        except Exception as e:
            print(f"Error searching job_applications collection: {e}")
        
        # If no applications found, try applications collection
        if len(applications) == 0:
            try:
                cursor = db.applications.find({"applicant_email": email})
                async for app in cursor:
                    app["_id"] = str(app["_id"])
                    app["job_id"] = str(app["job_id"])
                    applications.append(app)
                print(f"Found {len(applications)} applications in applications collection")
            except Exception as e:
                print(f"Error searching applications collection: {e}")
        
        # If still no applications, try a broader search
        if len(applications) == 0:
            try:
                # Search for any document containing this email
                cursor = db.job_applications.find({})
                async for app in cursor:
                    if app.get("applicant_email") == email:
                        app["_id"] = str(app["_id"])
                        app["job_id"] = str(app["job_id"])
                        applications.append(app)
                print(f"Found {len(applications)} applications in broad search")
            except Exception as e:
                print(f"Error in broad search: {e}")
        
        # Get job details for each application
        for app in applications:
            try:
                job = await db.jobs.find_one({"_id": ObjectId(app["job_id"])})
                if job:
                    app["job_title"] = job.get("title", "Unknown Job")
                    app["company_name"] = job.get("company_name", "Unknown Company")
                else:
                    app["job_title"] = "Job Not Found"
                    app["company_name"] = "Unknown Company"
            except Exception as jobError:
                print(f"Error fetching job details for {app['job_id']}: {jobError}")
                app["job_title"] = "Job Not Found"
                app["company_name"] = "Unknown Company"
        
        print(f"Final result: Found {len(applications)} applications for {email}")
        return applications
        
    except Exception as e:
        print(f"Error fetching applications by email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch applications: {str(e)}"
        )


@router.get("/health", response_model=Dict[str, Any])
async def health_check():
    """Health check for MongoDB connection"""
    try:
        await client.admin.command('ping')
        return {
            "status": "healthy",
            "database": "mongodb",
            "connection": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "mongodb",
            "connection": "disconnected",
            "error": str(e)
        } 
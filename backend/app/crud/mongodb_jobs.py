from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from app.db.mongodb import get_jobs_collection, get_job_applications_collection
from app.schemas.mongodb_schemas import (
    MongoDBJob, MongoDBJobApplication, JobCreateRequest, 
    JobUpdateRequest, JobSearchRequest, JobStatus, ApplicationStatus
)
import logging

logger = logging.getLogger(__name__)


class MongoDBJobCRUD:
    """MongoDB CRUD operations for jobs"""
    
    def __init__(self):
        self.jobs_collection: Optional[AsyncIOMotorCollection] = None
        self.applications_collection: Optional[AsyncIOMotorCollection] = None
    
    def _get_jobs_collection(self):
        """Get jobs collection with lazy initialization"""
        if self.jobs_collection is None:
            self.jobs_collection = get_jobs_collection()
        return self.jobs_collection
    
    def _get_applications_collection(self):
        """Get applications collection with lazy initialization"""
        if self.applications_collection is None:
            self.applications_collection = get_job_applications_collection()
        return self.applications_collection
    
    async def create_job(self, job_data: JobCreateRequest, employer_id: str, employer_name: str, 
                        company_id: str, company_name: str) -> MongoDBJob:
        """Create a new job posting"""
        try:
            job_dict = job_data.dict()
            job_dict.update({
                "employer_id": employer_id,
                "employer_name": employer_name,
                "company_id": company_id,
                "company_name": company_name,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
            
            result = await self._get_jobs_collection().insert_one(job_dict)
            job_dict["_id"] = str(result.inserted_id)
            
            return MongoDBJob(**job_dict)
        except Exception as e:
            logger.error(f"Error creating job: {e}")
            raise
    
    async def get_job_by_id(self, job_id: str) -> Optional[MongoDBJob]:
        """Get a job by ID"""
        try:
            job_doc = await self.jobs_collection.find_one({"_id": ObjectId(job_id)})
            if job_doc:
                job_doc["_id"] = str(job_doc["_id"])
                return MongoDBJob(**job_doc)
            return None
        except Exception as e:
            logger.error(f"Error getting job by ID: {e}")
            raise
    
    async def get_jobs_by_employer(self, employer_id: str, skip: int = 0, limit: int = 20) -> List[MongoDBJob]:
        """Get all jobs by an employer"""
        try:
            cursor = self.jobs_collection.find({"employer_id": employer_id})
            cursor.skip(skip).limit(limit).sort("created_at", -1)
            
            jobs = []
            async for job_doc in cursor:
                job_doc["_id"] = str(job_doc["_id"])
                jobs.append(MongoDBJob(**job_doc))
            
            return jobs
        except Exception as e:
            logger.error(f"Error getting jobs by employer: {e}")
            raise
    
    async def update_job(self, job_id: str, job_data: JobUpdateRequest) -> Optional[MongoDBJob]:
        """Update a job posting"""
        try:
            update_data = job_data.dict(exclude_unset=True)
            update_data["updated_at"] = datetime.utcnow()
            
            # If status is being changed to published, set published_at
            if update_data.get("status") == JobStatus.PUBLISHED:
                update_data["published_at"] = datetime.utcnow()
            
            result = await self.jobs_collection.update_one(
                {"_id": ObjectId(job_id)},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                return await self.get_job_by_id(job_id)
            return None
        except Exception as e:
            logger.error(f"Error updating job: {e}")
            raise
    
    async def delete_job(self, job_id: str) -> bool:
        """Delete a job posting"""
        try:
            result = await self.jobs_collection.delete_one({"_id": ObjectId(job_id)})
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Error deleting job: {e}")
            raise
    
    async def publish_job(self, job_id: str) -> Optional[MongoDBJob]:
        """Publish a job (change status to published)"""
        try:
            update_data = {
                "status": JobStatus.PUBLISHED,
                "published_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = await self.jobs_collection.update_one(
                {"_id": ObjectId(job_id)},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                return await self.get_job_by_id(job_id)
            return None
        except Exception as e:
            logger.error(f"Error publishing job: {e}")
            raise
    
    async def close_job(self, job_id: str) -> Optional[MongoDBJob]:
        """Close a job (change status to closed)"""
        try:
            update_data = {
                "status": JobStatus.CLOSED,
                "updated_at": datetime.utcnow()
            }
            
            result = await self.jobs_collection.update_one(
                {"_id": ObjectId(job_id)},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                return await self.get_job_by_id(job_id)
            return None
        except Exception as e:
            logger.error(f"Error closing job: {e}")
            raise
    
    async def search_jobs(self, search_request: JobSearchRequest) -> Dict[str, Any]:
        """Search jobs with filters"""
        try:
            # Build query
            query = {"status": JobStatus.PUBLISHED}
            
            if search_request.query:
                query["$text"] = {"$search": search_request.query}
            
            if search_request.location:
                query["location"] = {"$regex": search_request.location, "$options": "i"}
            
            if search_request.job_type:
                query["job_type"] = {"$in": [jt.value for jt in search_request.job_type]}
            
            if search_request.work_mode:
                query["work_mode"] = {"$in": [wm.value for wm in search_request.work_mode]}
            
            if search_request.experience_level:
                query["experience_level"] = search_request.experience_level
            
            if search_request.salary_min or search_request.salary_max:
                salary_query = {}
                if search_request.salary_min:
                    salary_query["$gte"] = search_request.salary_min
                if search_request.salary_max:
                    salary_query["$lte"] = search_request.salary_max
                query["salary_min"] = salary_query
            
            if search_request.skills:
                query["required_skills"] = {"$in": search_request.skills}
            
            if search_request.company_id:
                query["company_id"] = search_request.company_id
            
            # Count total results
            total = await self.jobs_collection.count_documents(query)
            
            # Get paginated results
            skip = (search_request.page - 1) * search_request.limit
            sort_order = -1 if search_request.sort_order == "desc" else 1
            
            cursor = self.jobs_collection.find(query)
            cursor.skip(skip).limit(search_request.limit).sort(search_request.sort_by, sort_order)
            
            jobs = []
            async for job_doc in cursor:
                job_doc["_id"] = str(job_doc["_id"])
                jobs.append(MongoDBJob(**job_doc))
            
            return {
                "jobs": jobs,
                "total": total,
                "page": search_request.page,
                "limit": search_request.limit,
                "pages": (total + search_request.limit - 1) // search_request.limit
            }
        except Exception as e:
            logger.error(f"Error searching jobs: {e}")
            raise
    
    async def increment_job_views(self, job_id: str) -> bool:
        """Increment job view count"""
        try:
            result = await self.jobs_collection.update_one(
                {"_id": ObjectId(job_id)},
                {"$inc": {"views_count": 1}}
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Error incrementing job views: {e}")
            raise
    
    async def get_featured_jobs(self, limit: int = 10) -> List[MongoDBJob]:
        """Get featured jobs"""
        try:
            cursor = self.jobs_collection.find({
                "status": JobStatus.PUBLISHED,
                "is_featured": True
            }).sort("created_at", -1).limit(limit)
            
            jobs = []
            async for job_doc in cursor:
                job_doc["_id"] = str(job_doc["_id"])
                jobs.append(MongoDBJob(**job_doc))
            
            return jobs
        except Exception as e:
            logger.error(f"Error getting featured jobs: {e}")
            raise
    
    async def get_recent_jobs(self, limit: int = 20) -> List[MongoDBJob]:
        """Get recent published jobs"""
        try:
            cursor = self.jobs_collection.find({
                "status": JobStatus.PUBLISHED
            }).sort("published_at", -1).limit(limit)
            
            jobs = []
            async for job_doc in cursor:
                job_doc["_id"] = str(job_doc["_id"])
                jobs.append(MongoDBJob(**job_doc))
            
            return jobs
        except Exception as e:
            logger.error(f"Error getting recent jobs: {e}")
            raise


class MongoDBJobApplicationCRUD:
    """MongoDB CRUD operations for job applications"""
    
    def __init__(self):
        self.applications_collection: Optional[AsyncIOMotorCollection] = None
        self.jobs_collection: Optional[AsyncIOMotorCollection] = None
    
    def _get_applications_collection(self):
        """Get applications collection with lazy initialization"""
        if self.applications_collection is None:
            self.applications_collection = get_job_applications_collection()
        return self.applications_collection
    
    def _get_jobs_collection(self):
        """Get jobs collection with lazy initialization"""
        if self.jobs_collection is None:
            self.jobs_collection = get_jobs_collection()
        return self.jobs_collection
    
    async def create_application(self, application_data: Dict[str, Any]) -> MongoDBJobApplication:
        """Create a new job application"""
        try:
            application_data["created_at"] = datetime.utcnow()
            application_data["updated_at"] = datetime.utcnow()
            
            result = await self._get_applications_collection().insert_one(application_data)
            application_data["_id"] = str(result.inserted_id)
            
            # Increment applications count for the job
            await self._get_jobs_collection().update_one(
                {"_id": ObjectId(application_data["job_id"])},
                {"$inc": {"applications_count": 1}}
            )
            
            return MongoDBJobApplication(**application_data)
        except Exception as e:
            logger.error(f"Error creating application: {e}")
            raise
    
    async def get_application_by_id(self, application_id: str) -> Optional[MongoDBJobApplication]:
        """Get an application by ID"""
        try:
            app_doc = await self.applications_collection.find_one({"_id": ObjectId(application_id)})
            if app_doc:
                app_doc["_id"] = str(app_doc["_id"])
                return MongoDBJobApplication(**app_doc)
            return None
        except Exception as e:
            logger.error(f"Error getting application by ID: {e}")
            raise
    
    async def get_applications_by_job(self, job_id: str, skip: int = 0, limit: int = 20) -> List[MongoDBJobApplication]:
        """Get all applications for a job"""
        try:
            cursor = self.applications_collection.find({"job_id": job_id})
            cursor.skip(skip).limit(limit).sort("created_at", -1)
            
            applications = []
            async for app_doc in cursor:
                app_doc["_id"] = str(app_doc["_id"])
                applications.append(MongoDBJobApplication(**app_doc))
            
            return applications
        except Exception as e:
            logger.error(f"Error getting applications by job: {e}")
            raise
    
    async def get_applications_by_applicant(self, applicant_id: str, skip: int = 0, limit: int = 20) -> List[MongoDBJobApplication]:
        """Get all applications by an applicant"""
        try:
            cursor = self.applications_collection.find({"applicant_id": applicant_id})
            cursor.skip(skip).limit(limit).sort("created_at", -1)
            
            applications = []
            async for app_doc in cursor:
                app_doc["_id"] = str(app_doc["_id"])
                applications.append(MongoDBJobApplication(**app_doc))
            
            return applications
        except Exception as e:
            logger.error(f"Error getting applications by applicant: {e}")
            raise
    
    async def update_application_status(self, application_id: str, status: ApplicationStatus, 
                                      notes: Optional[str] = None) -> Optional[MongoDBJobApplication]:
        """Update application status"""
        try:
            update_data = {
                "status": status,
                "updated_at": datetime.utcnow()
            }
            
            if notes:
                update_data["interview_notes"] = notes
            
            result = await self.applications_collection.update_one(
                {"_id": ObjectId(application_id)},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                return await self.get_application_by_id(application_id)
            return None
        except Exception as e:
            logger.error(f"Error updating application status: {e}")
            raise
    
    async def check_application_exists(self, job_id: str, applicant_id: str) -> bool:
        """Check if an application already exists"""
        try:
            count = await self.applications_collection.count_documents({
                "job_id": job_id,
                "applicant_id": applicant_id
            })
            return count > 0
        except Exception as e:
            logger.error(f"Error checking application exists: {e}")
            raise


# Factory functions to create CRUD instances
def get_mongodb_job_crud() -> MongoDBJobCRUD:
    """Get MongoDB job CRUD instance"""
    return MongoDBJobCRUD()

def get_mongodb_application_crud() -> MongoDBJobApplicationCRUD:
    """Get MongoDB application CRUD instance"""
    return MongoDBJobApplicationCRUD() 
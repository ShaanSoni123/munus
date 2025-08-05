from typing import Optional, List
from pydantic import BaseModel, validator
from datetime import datetime
# Commented out SQLAlchemy model imports for MongoDB-only setup.


class JobBase(BaseModel):
    title: str
    description: str
    location: str
    job_type: Optional[str] # JobType
    work_mode: Optional[str] # WorkMode
    experience_level: Optional[str] # ExperienceLevel


class JobCreate(JobBase):
    requirements: Optional[List[str]] = []
    responsibilities: Optional[List[str]] = []
    benefits: Optional[List[str]] = []
    skills: Optional[List[str]] = []
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str = "INR"
    salary_period: str = "month"
    application_deadline: Optional[datetime] = None
    company_id: Optional[int] = None


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None # JobType
    work_mode: Optional[str] = None # WorkMode
    experience_level: Optional[str] = None # ExperienceLevel
    requirements: Optional[List[str]] = None
    responsibilities: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    application_deadline: Optional[datetime] = None
    is_active: Optional[bool] = None


class JobResponse(JobBase):
    id: int
    requirements: List[str]
    responsibilities: List[str]
    benefits: List[str]
    skills: List[str]
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str
    salary_period: str
    application_deadline: Optional[datetime] = None
    is_active: bool
    is_featured: bool
    employer_id: int
    company_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    applications_count: int = 0
    
    class Config:
        from_attributes = True


class JobFilter(BaseModel):
    search: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[List[str]] = None # JobType
    work_mode: Optional[List[str]] = None # WorkMode
    experience_level: Optional[List[str]] = None # ExperienceLevel
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    skills: Optional[List[str]] = None
    posted_within_days: Optional[int] = None
    is_featured: Optional[bool] = None
    limit: int = 20
    offset: int = 0


class JobApplicationCreate(BaseModel):
    job_id: int
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    video_resume_url: Optional[str] = None
    voice_resume_url: Optional[str] = None


class JobApplicationUpdate(BaseModel):
    status: Optional[str] = None # ApplicationStatus
    interview_scheduled_at: Optional[datetime] = None


class JobApplicationResponse(BaseModel):
    id: int
    status: Optional[str] = None # ApplicationStatus
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    video_resume_url: Optional[str] = None
    voice_resume_url: Optional[str] = None
    applied_at: datetime
    reviewed_at: Optional[datetime] = None
    interview_scheduled_at: Optional[datetime] = None
    user_id: int
    job_id: int
    
    class Config:
        from_attributes = True
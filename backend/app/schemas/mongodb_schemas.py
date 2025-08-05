from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class JobStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    CLOSED = "closed"
    EXPIRED = "expired"


class JobType(str, Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    INTERNSHIP = "internship"
    FREELANCE = "freelance"


class WorkMode(str, Enum):
    ON_SITE = "on_site"
    REMOTE = "remote"
    HYBRID = "hybrid"


class ApplicationStatus(str, Enum):
    PENDING = "pending"
    REVIEWING = "reviewing"
    SHORTLISTED = "shortlisted"
    INTERVIEWING = "interviewing"
    REJECTED = "rejected"
    ACCEPTED = "accepted"


class MongoDBJob(BaseModel):
    """MongoDB Job Schema - All fields optional, no validation constraints"""
    id: Optional[str] = Field(None, alias="_id")
    title: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None
    responsibilities: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    
    # Company Information
    company_id: Optional[str] = None
    company_name: Optional[str] = None
    company_logo: Optional[str] = None
    
    # Job Details
    location: Optional[str] = None
    job_type: Optional[JobType] = None
    work_mode: Optional[WorkMode] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: Optional[str] = None
    experience_level: Optional[str] = None
    
    # Skills and Requirements
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    education_level: Optional[str] = None
    
    # Status and Metadata
    status: Optional[JobStatus] = None
    is_featured: Optional[bool] = None
    is_urgent: Optional[bool] = None
    
    # SEO and Search
    keywords: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    
    # Timestamps
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    
    # Statistics
    views_count: Optional[int] = None
    applications_count: Optional[int] = None
    
    # Employer Information
    employer_id: Optional[str] = None
    employer_name: Optional[str] = None
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class MongoDBJobApplication(BaseModel):
    """MongoDB Job Application Schema"""
    id: Optional[str] = Field(None, alias="_id")
    job_id: str
    applicant_id: str
    applicant_name: str
    applicant_email: str
    
    # Application Details
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    video_resume_url: Optional[str] = None
    audio_resume_url: Optional[str] = None
    
    # Status and Progress
    status: ApplicationStatus = ApplicationStatus.PENDING
    current_stage: str = "application_received"
    
    # Assessment
    skills_match_score: Optional[float] = None
    experience_match_score: Optional[float] = None
    overall_score: Optional[float] = None
    
    # Interview Information
    interview_scheduled: Optional[datetime] = None
    interview_notes: Optional[str] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Additional Information
    portfolio_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class MongoDBCompany(BaseModel):
    """MongoDB Company Schema"""
    id: Optional[str] = Field(None, alias="_id")
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None  # startup, small, medium, large
    
    # Contact Information
    website: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    
    # Location
    location: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    
    # Media
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    
    # Social Media
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    facebook_url: Optional[str] = None
    
    # Company Details
    founded_year: Optional[int] = None
    mission: Optional[str] = None
    vision: Optional[str] = None
    values: List[str] = Field(default_factory=list)
    
    # Statistics
    jobs_posted: int = 0
    total_applications: int = 0
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Verification
    is_verified: bool = False
    verification_date: Optional[datetime] = None
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class MongoDBUser(BaseModel):
    """MongoDB User Schema (for user-specific data)"""
    id: Optional[str] = Field(None, alias="_id")
    user_id: Optional[str] = None  # Reference to PostgreSQL user ID (optional for MongoDB-only setup)
    email: str
    
    # Profile Information
    name: str
    role: str  # jobseeker, employer, admin
    is_active: bool = True
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    
    # Job Seeker Specific
    skills: List[str] = Field(default_factory=list)
    experience_years: Optional[int] = None
    preferred_job_types: List[str] = Field(default_factory=list)
    preferred_locations: List[str] = Field(default_factory=list)
    salary_expectations: Optional[Dict[str, Any]] = None
    expected_salary_min: Optional[int] = None
    expected_salary_max: Optional[int] = None
    preferred_job_type: Optional[str] = None
    preferred_work_mode: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    
    # Employer Specific
    company_id: Optional[str] = None
    company_name: Optional[str] = None
    
    # Preferences
    job_alerts: bool = True
    email_notifications: bool = True
    push_notifications: bool = True
    
    # Statistics
    jobs_applied: int = 0
    jobs_posted: int = 0
    profile_views: int = 0
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_active: Optional[datetime] = None
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class MongoDBNotification(BaseModel):
    """MongoDB Notification Schema"""
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    title: str
    message: str
    notification_type: str  # job_application, job_posted, etc.
    
    # Content
    data: Optional[Dict[str, Any]] = None
    action_url: Optional[str] = None
    
    # Status
    is_read: bool = False
    is_archived: bool = False
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    read_at: Optional[datetime] = None
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


# Request/Response Models
class JobCreateRequest(BaseModel):
    """Request model for creating a job"""
    title: str
    description: str
    requirements: List[str] = []
    responsibilities: List[str] = []
    benefits: List[str] = []
    location: str
    job_type: JobType
    work_mode: WorkMode
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str = "USD"
    experience_level: Optional[str] = None
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    education_level: Optional[str] = None
    keywords: List[str] = []
    tags: List[str] = []
    expires_at: Optional[datetime] = None


class JobUpdateRequest(BaseModel):
    """Request model for updating a job"""
    title: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None
    responsibilities: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    location: Optional[str] = None
    job_type: Optional[JobType] = None
    work_mode: Optional[WorkMode] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: Optional[str] = None
    experience_level: Optional[str] = None
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    education_level: Optional[str] = None
    status: Optional[JobStatus] = None
    keywords: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    expires_at: Optional[datetime] = None


class JobSearchRequest(BaseModel):
    """Request model for job search"""
    query: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[List[JobType]] = None
    work_mode: Optional[List[WorkMode]] = None
    experience_level: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    skills: Optional[List[str]] = None
    company_id: Optional[str] = None
    page: int = 1
    limit: int = 20
    sort_by: str = "created_at"
    sort_order: str = "desc"


class JobApplicationRequest(BaseModel):
    """Request model for job application"""
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    video_resume_url: Optional[str] = None
    audio_resume_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None 
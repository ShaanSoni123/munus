# from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum, ForeignKey, Float
# from sqlalchemy.sql import func
# from sqlalchemy.orm import relationship
# from app.db.database import Base
import enum

# Commented out all SQLAlchemy model class definitions for MongoDB-only setup.
# class JobType(enum.Enum):
#     FULL_TIME = "full-time"
#     PART_TIME = "part-time"
#     INTERNSHIP = "internship"
#     CONTRACT = "contract"
#     FREELANCE = "freelance"


# class WorkMode(enum.Enum):
#     REMOTE = "remote"
#     ONSITE = "onsite"
#     HYBRID = "hybrid"


# class ExperienceLevel(enum.Enum):
#     FRESHER = "fresher"
#     ONE_TO_TWO = "1-2"
#     THREE_TO_FIVE = "3-5"
#     FIVE_PLUS = "5+"


# class ApplicationStatus(enum.Enum):
#     PENDING = "pending"
#     REVIEWED = "reviewed"
#     SHORTLISTED = "shortlisted"
#     INTERVIEWED = "interviewed"
#     REJECTED = "rejected"
#     HIRED = "hired"


# class Job(Base):
#     __tablename__ = "jobs"

#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String(255), nullable=False, index=True)
#     description = Column(Text, nullable=False)
#     requirements = Column(JSON)  # List of requirements
#     responsibilities = Column(JSON)  # List of responsibilities
#     benefits = Column(JSON)  # List of benefits
#     skills = Column(JSON)  # List of required skills
    
#     # Job Details
#     job_type = Column(Enum(JobType), nullable=False)
#     work_mode = Column(Enum(WorkMode), nullable=False)
#     experience_level = Column(Enum(ExperienceLevel), nullable=False)
#     location = Column(String(255), nullable=False)
    
#     # Salary Information
#     salary_min = Column(Integer)
#     salary_max = Column(Integer)
#     salary_currency = Column(String(10), default="INR")
#     salary_period = Column(String(20), default="month")
    
#     # Application Details
#     application_deadline = Column(DateTime(timezone=True))
#     is_active = Column(Boolean, default=True)
#     is_featured = Column(Boolean, default=False)
    
#     # Foreign Keys
#     employer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
#     company_id = Column(Integer, ForeignKey("companies.id"))
    
#     # Timestamps
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
#     # Relationships
#     employer = relationship("User", back_populates="posted_jobs")
#     company = relationship("Company", back_populates="jobs")
#     applications = relationship("JobApplication", back_populates="job", cascade="all, delete-orphan")
    
#     def __repr__(self):
#         return f"<Job(id={self.id}, title='{self.title}', company='{self.company.name if self.company else 'N/A'}')>"


# class JobApplication(Base):
#     __tablename__ = "job_applications"

#     id = Column(Integer, primary_key=True, index=True)
#     status = Column(Enum(ApplicationStatus), default=ApplicationStatus.PENDING)
#     cover_letter = Column(Text)
#     resume_url = Column(String(500))
#     video_resume_url = Column(String(500))
#     voice_resume_url = Column(String(500))
    
#     # Application Tracking
#     applied_at = Column(DateTime(timezone=True), server_default=func.now())
#     reviewed_at = Column(DateTime(timezone=True))
#     interview_scheduled_at = Column(DateTime(timezone=True))
    
#     # Foreign Keys
#     user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
#     job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    
#     # Timestamps
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
#     # Relationships
#     user = relationship("User", back_populates="job_applications")
#     job = relationship("Job", back_populates="applications")
    
#     def __repr__(self):
#         return f"<JobApplication(id={self.id}, user_id={self.user_id}, job_id={self.job_id}, status='{self.status}')>"
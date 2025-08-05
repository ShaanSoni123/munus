from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime


class ExperienceBase(BaseModel):
    company: str
    position: str
    description: Optional[str] = None
    achievements: Optional[List[str]] = []
    start_date: datetime
    end_date: Optional[datetime] = None
    is_current: bool = False


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceResponse(ExperienceBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class EducationBase(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    description: Optional[str] = None
    gpa: Optional[float] = None
    start_date: datetime
    end_date: Optional[datetime] = None


class EducationCreate(EducationBase):
    pass


class EducationResponse(EducationBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None
    proficiency_level: int = 3


class SkillCreate(SkillBase):
    pass


class SkillResponse(SkillBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    technologies: Optional[List[str]] = []
    url: Optional[str] = None
    github_url: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class CertificationBase(BaseModel):
    name: str
    issuer: str
    credential_id: Optional[str] = None
    url: Optional[str] = None
    issue_date: datetime
    expiry_date: Optional[datetime] = None


class CertificationCreate(CertificationBase):
    pass


class CertificationResponse(CertificationBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class ResumeBase(BaseModel):
    title: str
    summary: Optional[str] = None
    template_id: str = "default"
    is_public: bool = False


class ResumeCreate(ResumeBase):
    experiences: Optional[List[ExperienceCreate]] = []
    educations: Optional[List[EducationCreate]] = []
    skills: Optional[List[SkillCreate]] = []
    projects: Optional[List[ProjectCreate]] = []
    certifications: Optional[List[CertificationCreate]] = []


class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    video_url: Optional[str] = None
    voice_url: Optional[str] = None
    template_id: Optional[str] = None
    is_public: Optional[bool] = None


class ResumeResponse(ResumeBase):
    id: int
    video_url: Optional[str] = None
    voice_url: Optional[str] = None
    pdf_url: Optional[str] = None
    is_default: bool
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    experiences: List[ExperienceResponse] = []
    educations: List[EducationResponse] = []
    skills: List[SkillResponse] = []
    projects: List[ProjectResponse] = []
    certifications: List[CertificationResponse] = []
    
    class Config:
        from_attributes = True
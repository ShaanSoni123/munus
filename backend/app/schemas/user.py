from typing import Optional, List
from pydantic import BaseModel, EmailStr, validator
from datetime import datetime
from app.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: UserRole = UserRole.JOBSEEKER


class UserCreate(UserBase):
    password: str
    phone: Optional[str] = None
    location: Optional[str] = None
    company: Optional[str] = None  # For employers
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    experience_years: Optional[int] = None
    expected_salary_min: Optional[int] = None
    expected_salary_max: Optional[int] = None
    preferred_job_type: Optional[str] = None
    preferred_work_mode: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: UserRole


class UserResponse(UserBase):
    id: int
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    experience_years: Optional[int] = None
    expected_salary_min: Optional[int] = None
    expected_salary_max: Optional[int] = None
    preferred_job_type: Optional[str] = None
    preferred_work_mode: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    is_active: bool
    is_verified: bool
    email_verified: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    company_id: Optional[int] = None
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenRefresh(BaseModel):
    refresh_token: str


class PasswordReset(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str
    
    @validator('new_password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v
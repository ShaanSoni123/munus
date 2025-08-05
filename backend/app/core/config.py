from typing import List, Optional, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "SkillGlide API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "AI-Powered Job Portal & Resume Builder API"
    
    # Security
    SECRET_KEY: str = "your-super-secret-key-change-in-production-skillglide-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    DATABASE_URL: str = "sqlite:///./test.db"
    ASYNC_DATABASE_URL: str = "sqlite+aiosqlite:///./test.db"
    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Email Configuration
    MAIL_USERNAME: str = "noreply@skillglide.com"
    MAIL_PASSWORD: str = "dummy-password"
    MAIL_FROM: str = "noreply@skillglide.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_FROM_NAME: str = "SkillGlide"
    
    # File Storage
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_BUCKET_NAME: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # OpenAI / Twilio
    OPENAI_API_KEY: Optional[str] = None
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_VERIFY_SID: Optional[str] = None
    TWILIO_PHONE_NUMBER: Optional[str] = None
    OTP_EXPIRY_MINUTES: int = 5

    # MongoDB
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "jobify"

    # ✅ This is what makes .env auto-load
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
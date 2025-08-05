import os
import uuid
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from app.db.database import get_users_collection
from app.api.deps import get_current_user
from app.schemas.mongodb_schemas import MongoDBUser as User

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()

# Create upload directories if they don't exist
UPLOAD_DIR = "uploads"
os.makedirs(f"{UPLOAD_DIR}/avatars", exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/resumes", exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/videos", exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/audio", exist_ok=True)

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_DOCUMENT_TYPES = {"application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime"}
ALLOWED_AUDIO_TYPES = {"audio/mpeg", "audio/wav", "audio/webm", "audio/mp4"}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def validate_file_size(file: UploadFile):
    """Validate file size"""
    if file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB"
        )


def save_file(file: UploadFile, directory: str) -> str:
    """Save uploaded file and return the file path"""
    try:
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1] if file.filename else ""
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, directory, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = file.file.read()
            buffer.write(content)
        
        logger.info(f"File saved successfully: {file_path}")
        
        # Return relative path for URL
        return f"/{file_path}"
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save file"
        )


@router.post("/test")
async def test_upload():
    """Test endpoint to verify upload functionality"""
    return {"message": "Upload endpoint is working", "status": "ok"}


@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Upload user avatar"""
    logger.info(f"Avatar upload request from user: {current_user.email}")
    
    # Check if file is provided
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file provided"
        )
    
    # Validate file type
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        logger.warning(f"Invalid file type attempted: {file.content_type}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_IMAGE_TYPES)}"
        )
    
    # Validate file size
    try:
        validate_file_size(file)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"File size validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file size"
        )
    
    try:
        # Save file
        avatar_url = save_file(file, "avatars")
        
        # Update user avatar URL in MongoDB
        users_collection = get_users_collection()
        result = await users_collection.update_one(
            {"email": current_user.email},
            {"$set": {"avatar_url": avatar_url}}
        )
        
        if result.matched_count == 0:
            logger.error(f"User not found in database: {current_user.email}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        logger.info(f"Avatar uploaded successfully for user: {current_user.email}")
        return {"avatar_url": avatar_url}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Avatar upload error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload avatar"
        )


@router.post("/resume")
def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Upload resume file"""
    # Validate file type
    if file.content_type not in ALLOWED_DOCUMENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF and Word documents are allowed."
        )
    
    # Validate file size
    validate_file_size(file)
    
    try:
        # Save file
        resume_url = save_file(file, "resumes")
        
        return {"resume_url": resume_url}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload resume"
        )


@router.post("/video")
def upload_video(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Upload video file"""
    # Validate file type
    if file.content_type not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only MP4, WebM, and QuickTime videos are allowed."
        )
    
    # Validate file size
    validate_file_size(file)
    
    try:
        # Save file
        video_url = save_file(file, "videos")
        
        return {"video_url": video_url}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload video"
        )


@router.post("/audio")
def upload_audio(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Upload audio file"""
    # Validate file type
    if file.content_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only MP3, WAV, WebM, and MP4 audio are allowed."
        )
    
    # Validate file size
    validate_file_size(file)
    
    try:
        # Save file
        audio_url = save_file(file, "audio")
        
        return {"voice_url": audio_url}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload audio"
        )
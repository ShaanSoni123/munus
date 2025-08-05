from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import verify_token
from app.db.database import get_db, get_users_collection
from app.schemas.mongodb_schemas import MongoDBUser as User
from bson import ObjectId

security = HTTPBearer()


async def get_current_user(
    db = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """Get current authenticated user"""
    token = credentials.credentials
    user_email = verify_token(token)
    
    if user_email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get users collection
    users_collection = get_users_collection()
    
    # Find user by email (since token contains email as subject)
    user_doc = await users_collection.find_one({"email": user_email})
    if user_doc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Convert ObjectId to string for the response
    user_doc["_id"] = str(user_doc["_id"])
    
    # Convert to User schema - handle missing fields
    user_data = user_doc.copy()
    # Ensure required fields exist
    if 'user_id' not in user_data:
        user_data['user_id'] = None
    if 'is_active' not in user_data:
        user_data['is_active'] = True
    if 'skills' not in user_data:
        user_data['skills'] = []
    if 'preferred_job_types' not in user_data:
        user_data['preferred_job_types'] = []
    if 'preferred_locations' not in user_data:
        user_data['preferred_locations'] = []
    if 'jobs_applied' not in user_data:
        user_data['jobs_applied'] = 0
    if 'jobs_posted' not in user_data:
        user_data['jobs_posted'] = 0
    if 'profile_views' not in user_data:
        user_data['profile_views'] = 0
    if 'job_alerts' not in user_data:
        user_data['job_alerts'] = True
    if 'email_notifications' not in user_data:
        user_data['email_notifications'] = True
    if 'push_notifications' not in user_data:
        user_data['push_notifications'] = True
    
    user = User(**user_data)
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user


def get_current_employer(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """Get current user if they are an employer"""
    if current_user.role != "employer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Employer access required."
        )
    return current_user


def get_current_jobseeker(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """Get current user if they are a job seeker"""
    if current_user.role != "jobseeker":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Job seeker access required."
        )
    return current_user


async def get_optional_current_user(
    db = Depends(get_db),
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[User]:
    """Get current user if authenticated, otherwise return None"""
    if credentials is None:
        return None
    
    try:
        token = credentials.credentials
        user_email = verify_token(token)
        
        if user_email is None:
            return None
        
        # Get users collection
        users_collection = get_users_collection()
        
        # Find user by email (since token contains email as subject)
        user_doc = await users_collection.find_one({"email": user_email})
        if user_doc is None:
            return None
        
        # Convert ObjectId to string for the response
        user_doc["_id"] = str(user_doc["_id"])
        
        # Convert to User schema - handle missing fields
        user_data = user_doc.copy()
        # Ensure required fields exist
        if 'user_id' not in user_data:
            user_data['user_id'] = None
        if 'is_active' not in user_data:
            user_data['is_active'] = True
        if 'skills' not in user_data:
            user_data['skills'] = []
        if 'preferred_job_types' not in user_data:
            user_data['preferred_job_types'] = []
        if 'preferred_locations' not in user_data:
            user_data['preferred_locations'] = []
        if 'jobs_applied' not in user_data:
            user_data['jobs_applied'] = 0
        if 'jobs_posted' not in user_data:
            user_data['jobs_posted'] = 0
        if 'profile_views' not in user_data:
            user_data['profile_views'] = 0
        if 'job_alerts' not in user_data:
            user_data['job_alerts'] = True
        if 'email_notifications' not in user_data:
            user_data['email_notifications'] = True
        if 'push_notifications' not in user_data:
            user_data['push_notifications'] = True
        
        user = User(**user_data)
        return user if user.is_active else None
    except:
        return None 
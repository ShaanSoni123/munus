from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_current_user
from app.schemas.mongodb_schemas import MongoDBUser as User
from app.schemas.user import UserResponse, UserUpdate
from app.db.mongodb import get_users_collection
from pydantic import BaseModel
from typing import Dict
import random
import time
from datetime import datetime, timedelta
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory store for OTPs with expiry (for demo only - use Redis in production)
otp_store: Dict[str, Dict[str, any]] = {}

class SendOtpRequest(BaseModel):
    phone: str

class VerifyOtpRequest(BaseModel):
    phone: str
    otp: str

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Get current user profile"""
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_current_user_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update current user profile"""
    try:
        users_collection = get_users_collection()
        
        # Convert user_data to dict and exclude None values
        update_data = user_data.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        # Update user in MongoDB
        result = await users_collection.update_one(
            {"_id": current_user.id},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Get updated user
        updated_user_doc = await users_collection.find_one({"_id": current_user.id})
        updated_user_doc["_id"] = str(updated_user_doc["_id"])
        
        return UserResponse(**updated_user_doc)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

@router.post("/change-password")
async def change_password(
    password_data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user)
):
    """Change user password"""
    import bcrypt
    
    try:
        users_collection = get_users_collection()
        
        # Verify current password - MongoDB stores it as "password" field
        if not bcrypt.checkpw(password_data.current_password.encode("utf-8"), current_user.password.encode("utf-8")):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect current password"
            )
        
        # Update password - MongoDB stores it as "password" field
        hashed_password = bcrypt.hashpw(password_data.new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        
        result = await users_collection.update_one(
            {"_id": current_user.id},
            {"$set": {"password": hashed_password, "updated_at": datetime.utcnow()}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update password"
            )
        
        return {"message": "Password updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing password: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change password"
        )


@router.delete("/me")
async def delete_current_user_account(
    current_user: User = Depends(get_current_user)
):
    """Delete current user account"""
    try:
        users_collection = get_users_collection()
        
        # Deactivate user instead of deleting
        result = await users_collection.update_one(
            {"_id": current_user.id},
            {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete account"
            )
        
        return {"message": "Account deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting account: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete account"
        )


@router.post("/verify-email")
async def verify_email(
    token: str
):
    """Verify user email"""
    # TODO: Implement email verification logic
    return {"message": "Email verified successfully"}


@router.post("/resend-verification")
def resend_verification_email(
    current_user: User = Depends(get_current_user)
):
    """Resend verification email"""
    # TODO: Implement resend verification logic
    return {"message": "Verification email sent"}

@router.post('/send-otp')
async def send_otp(data: SendOtpRequest):
    try:
        # Generate a 6-digit OTP
        otp = f"{random.randint(100000, 999999)}"
        
        # Store OTP with expiry
        expiry_time = datetime.now() + timedelta(minutes=settings.OTP_EXPIRY_MINUTES)
        otp_store[data.phone] = {
            "otp": otp,
            "expiry": expiry_time,
            "attempts": 0
        }
        
        # SMS functionality removed - Twilio not configured
        # In production, you would integrate with an SMS service here
        print(f"OTP for {data.phone}: {otp}")  # For development/testing only
        
        print(f"OTP sent to {data.phone}: {otp}")  # For debugging
        
        return {
            "success": True, 
            "message": f"OTP sent to {data.phone}",
            "otp": otp  # For development/testing only
        }
        
    except Exception as e:
        print(f"Error sending OTP: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP. Please try again."
        )

@router.post('/verify-otp')
async def verify_otp(data: VerifyOtpRequest):
    try:
        # Check if OTP exists and is not expired
        if data.phone not in otp_store:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No OTP found for this phone number. Please request a new OTP."
            )
        
        stored_data = otp_store[data.phone]
        
        # Check if OTP is expired
        if datetime.now() > stored_data["expiry"]:
            del otp_store[data.phone]  # Clean up expired OTP
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP has expired. Please request a new OTP."
            )
        
        # Check if too many attempts
        if stored_data["attempts"] >= 3:
            del otp_store[data.phone]  # Clean up after too many attempts
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Too many failed attempts. Please request a new OTP."
            )
        
        # Verify OTP
        if stored_data["otp"] == data.otp:
            # OTP is correct - clean up and return success
            del otp_store[data.phone]
            return {
                "success": True,
                "message": "Phone number verified successfully!"
            }
        else:
            # Increment attempts
            stored_data["attempts"] += 1
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid OTP. {3 - stored_data['attempts']} attempts remaining."
            )
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error verifying OTP: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify OTP. Please try again."
        )
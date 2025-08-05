from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session  # Removed for MongoDB-only setup
from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.crud.user import update_user
from pydantic import BaseModel
from typing import Dict
import random
import time
from datetime import datetime, timedelta
from twilio.rest import Client
from app.core.config import settings

router = APIRouter()

# In-memory store for OTPs with expiry (for demo only - use Redis in production)
otp_store: Dict[str, Dict[str, any]] = {}

# Initialize Twilio client
twilio_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

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
def update_current_user_profile(
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update current user profile"""
    try:
        updated_user = update_user(db, user_id=current_user.id, user_data=user_data)
        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return updated_user
    except Exception as e:
        print(f"Error updating user profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

@router.post("/change-password")
def change_password(
    password_data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Change user password"""
    import bcrypt
    from app.crud.user import update_user_password
    
    try:
        # Verify current password - MongoDB stores it as "password" field
        if not bcrypt.checkpw(password_data.current_password.encode("utf-8"), current_user.password.encode("utf-8")):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect current password"
            )
        
        # Update password - MongoDB stores it as "password" field
        hashed_password = bcrypt.hashpw(password_data.new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        success = update_user_password(db, user_id=current_user.id, hashed_password=hashed_password)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update password"
            )
        
        return {"message": "Password updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error changing password: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change password"
        )


@router.delete("/me")
def delete_current_user_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete current user account"""
    from app.crud.user import deactivate_user
    
    try:
        success = deactivate_user(db, user_id=current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete account"
            )
        
        return {"message": "Account deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting account: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete account"
        )


@router.post("/verify-email")
def verify_email(
    token: str,
    db: Session = Depends(get_db)
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
        
        # Send SMS via Twilio
        message = twilio_client.messages.create(
            body=f"Your SkillGlide verification code is: {otp}. Valid for {settings.OTP_EXPIRY_MINUTES} minutes.",
            from_=settings.TWILIO_PHONE_NUMBER,
            to=data.phone
        )
        
        print(f"OTP sent to {data.phone}: {otp}")  # For debugging
        
        return {
            "success": True, 
            "message": f"OTP sent to {data.phone}",
            "message_sid": message.sid
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
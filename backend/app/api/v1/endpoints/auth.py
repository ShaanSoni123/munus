from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime, timedelta
from typing import Optional
from app.db.database import get_users_collection
from app.schemas.mongodb_schemas import MongoDBUser
from jose import jwt
import bcrypt
import logging
from app.core.config import settings

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_users_db():
    return get_users_collection()


@router.post("/register/")
async def register(user_data: dict, users_collection=Depends(get_users_db)):
    """Register a new user (MongoDB only)"""
    try:
        logger.info(f"Registration attempt for email: {user_data.get('email')}")
        
        # Check if user already exists
        existing_user = await users_collection.find_one({"email": user_data["email"]})
        if existing_user:
            logger.warning(f"Email already registered: {user_data['email']}")
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        try:
            hashed_password = bcrypt.hashpw(user_data["password"].encode("utf-8"), bcrypt.gensalt())
            logger.info("Password hashed successfully")
        except Exception as e:
            logger.error(f"Password hashing failed: {e}")
            raise HTTPException(status_code=500, detail=f"Password hashing failed: {str(e)}")
        
        # Prepare user document
        user_doc = {
            "email": user_data["email"],
            "name": user_data.get("name"),
            "role": user_data.get("role", "jobseeker"),
            "password": hashed_password.decode("utf-8"),
            "phone": user_data.get("phone"),
            "location": user_data.get("location"),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "last_active": datetime.utcnow(),
            "is_active": True,
            "is_verified": False,
            "email_verified": False,
        }
        
        # Add employer-specific fields
        if user_data.get("role") == "employer":
            user_doc.update({
                "company_name": user_data.get("company"),
                "jobs_posted": 0,
                "company_id": None,  # Will be set when company is created
            })
        else:
            # Job seeker specific fields
            user_doc.update({
                "skills": user_data.get("skills", []),
                "experience_years": user_data.get("experience_years"),
                "preferred_job_types": user_data.get("preferred_job_types", []),
                "preferred_locations": user_data.get("preferred_locations", []),
                "salary_expectations": user_data.get("salary_expectations"),
                "jobs_applied": 0,
                "profile_views": 0,
            })
        
        logger.info(f"User document prepared: {user_doc}")
        
        # Insert user into database
        try:
            result = await users_collection.insert_one(user_doc)
            user_doc["_id"] = str(result.inserted_id)
            logger.info(f"User inserted successfully with ID: {result.inserted_id}")
        except Exception as e:
            logger.error(f"Database insertion failed: {e}")
            raise HTTPException(status_code=500, detail=f"Database insertion failed: {str(e)}")
        
        # Remove password from response
        user_response = user_doc.copy()
        user_response.pop("password", None)
        
        # Create JWT token
        try:
            access_token = create_access_token({"sub": user_doc["email"], "role": user_doc["role"]})
            logger.info("JWT token created successfully")
        except Exception as e:
            logger.error(f"JWT token creation failed: {e}")
            raise HTTPException(status_code=500, detail=f"Token creation failed: {str(e)}")
        
        logger.info(f"Registration successful for user: {user_data['email']}")
        return {"access_token": access_token, "user": user_response}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during registration: {e}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@router.post("/login")
async def login(user_data: dict, users_collection=Depends(get_users_db)):
    """Login user (MongoDB only)"""
    try:
        logger.info(f"Login attempt for email: {user_data.get('email')}")
        
        # Find user by email
        try:
            user = await users_collection.find_one({"email": user_data["email"]})
            logger.info(f"User lookup result: {user is not None}")
            if user:
                logger.info(f"User found with ID: {user.get('_id')}")
        except Exception as e:
            logger.error(f"Database lookup failed: {e}")
            raise HTTPException(status_code=500, detail=f"Database lookup failed: {str(e)}")
            
        if not user:
            logger.warning(f"User not found: {user_data['email']}")
            raise HTTPException(status_code=401, detail="Incorrect email or password")
        
        # Verify password
        try:
            logger.info(f"Attempting password verification for user: {user_data['email']}")
            logger.info(f"Stored password hash: {user['password'][:20]}...")
            
            if not bcrypt.checkpw(user_data["password"].encode("utf-8"), user["password"].encode("utf-8")):
                logger.warning(f"Invalid password for user: {user_data['email']}")
                raise HTTPException(status_code=401, detail="Incorrect email or password")
            logger.info("Password verification successful")
        except Exception as e:
            logger.error(f"Password verification failed: {e}")
            raise HTTPException(status_code=401, detail="Incorrect email or password")
        
        # Check if user is active
        if not user.get("is_active", True):
            logger.warning(f"Inactive user login attempt: {user_data['email']}")
            raise HTTPException(status_code=401, detail="Account is deactivated")
        
        # Remove password from response and convert ObjectId to string
        user_response = user.copy()
        user_response.pop("password", None)
        if "_id" in user_response:
            user_response["_id"] = str(user_response["_id"])
        
        # Create JWT token
        try:
            access_token = create_access_token({"sub": user["email"], "role": user["role"]})
            logger.info("JWT token created successfully for login")
        except Exception as e:
            logger.error(f"JWT token creation failed during login: {e}")
            raise HTTPException(status_code=500, detail=f"Token creation failed: {str(e)}")
        
        logger.info(f"Login successful for user: {user_data['email']}")
        return {"access_token": access_token, "user": user_response}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during login: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


@router.get("/me")
async def get_current_user(users_collection=Depends(get_users_db)):
    """Get current user information"""
    try:
        # This would typically use JWT token verification
        # For now, we'll return a placeholder
        return {"message": "Current user endpoint - implement JWT verification"}
    except Exception as e:
        logger.error(f"Error in get_current_user: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get user info: {str(e)}")


# Password reset endpoints would need to be re-implemented for MongoDB as well, but are omitted for brevity.

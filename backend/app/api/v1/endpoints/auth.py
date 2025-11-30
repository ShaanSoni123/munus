from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
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
        
        # Prepare user document - role will be set later via role selection
        user_doc = {
            "email": user_data["email"],
            "name": user_data.get("name"),
            "role": None,  # Role will be selected after registration
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
        
        # Add default fields for both roles (will be updated when role is selected)
        user_doc.update({
            "skills": [],
            "experience_years": None,
            "preferred_job_types": [],
            "preferred_locations": [],
            "salary_expectations": None,
            "jobs_applied": 0,
            "profile_views": 0,
            "company_name": None,
            "jobs_posted": 0,
            "company_id": None,
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
        
        # Create JWT token (role may be None initially)
        try:
            access_token = create_access_token({"sub": user_doc["email"], "role": user_doc.get("role")})
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


@router.post("/update-role")
async def update_user_role(
    role_data: dict,
    users_collection=Depends(get_users_db),
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())
):
    """Update user role after authentication"""
    try:
        # Get token from Authorization header
        token = credentials.credentials
        
        # Verify token and get email
        from app.core.security import verify_token
        email = verify_token(token)
        
        if not email:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        new_role = role_data.get("role")
        
        if not new_role:
            raise HTTPException(status_code=400, detail="Role is required")
        
        if new_role not in ["jobseeker", "employer"]:
            raise HTTPException(status_code=400, detail="Invalid role. Must be 'jobseeker' or 'employer'")
        
        # Find user
        user = await users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update role and role-specific fields
        update_data = {
            "role": new_role,
            "updated_at": datetime.utcnow()
        }
        
        # Add role-specific fields
        if new_role == "employer":
            update_data.update({
                "company_name": None,
                "jobs_posted": 0,
                "company_id": None,
            })
        else:  # jobseeker
            update_data.update({
                "skills": [],
                "experience_years": None,
                "preferred_job_types": [],
                "preferred_locations": [],
                "salary_expectations": None,
                "jobs_applied": 0,
                "profile_views": 0,
            })
        
        # Update role
        await users_collection.update_one(
            {"email": email},
            {"$set": update_data}
        )
        
        # Get updated user
        updated_user = await users_collection.find_one({"email": email})
        updated_user.pop("password", None)
        if "_id" in updated_user:
            updated_user["_id"] = str(updated_user["_id"])
        
        # Create new token with updated role
        access_token = create_access_token({"sub": email, "role": new_role})
        
        logger.info(f"User role updated: {email} -> {new_role}")
        
        return {
            "access_token": access_token,
            "user": updated_user,
            "message": "Role updated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user role: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to update role: {str(e)}")


# Google OAuth endpoints
@router.get("/google/url")
async def get_google_auth_url():
    """Get Google OAuth URL for frontend"""
    try:
        if not settings.GOOGLE_CLIENT_ID:
            raise HTTPException(status_code=500, detail="Google OAuth not configured")
        
        # Frontend will handle the OAuth flow using Google's client library
        return {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "redirect_uri": settings.GOOGLE_REDIRECT_URI
        }
    except Exception as e:
        logger.error(f"Error getting Google auth URL: {e}")
        raise HTTPException(status_code=500, detail="Failed to get Google auth URL")


@router.post("/google/callback")
async def google_oauth_callback(auth_data: dict, users_collection=Depends(get_users_db)):
    """Handle Google OAuth callback with authorization code"""
    try:
        logger.info("Google OAuth callback received")
        logger.info(f"Received auth_data keys: {auth_data.keys()}")
        
        # Get the authorization code (no user_type needed - will be selected later)
        code = auth_data.get("code")
        
        if not code:
            logger.error("No authorization code provided")
            raise HTTPException(status_code=400, detail="Authorization code is required")
        
        logger.info("Processing Google OAuth (role will be selected after authentication)")
        
        # Check if Google OAuth is configured
        if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
            logger.error("Google OAuth not configured")
            raise HTTPException(
                status_code=500, 
                detail="Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET."
            )
        
        # Exchange authorization code for access token
        user_info = await exchange_google_code_for_user_info(code)
        if not user_info:
            logger.error("Failed to exchange code for user info")
            raise HTTPException(
                status_code=400, 
                detail="Failed to get user info from Google. The authorization code may be invalid or expired."
            )
        
        if not user_info.get("email"):
            logger.error("No email in user info from Google")
            raise HTTPException(status_code=400, detail="Google account email is required")
        
        logger.info(f"Google user info retrieved: {user_info.get('email')}")
        
        # Check if user already exists
        existing_user = await users_collection.find_one({"email": user_info["email"]})
        
        if existing_user:
            # User exists, log them in (use existing role, don't change it)
            logger.info(f"Existing user logging in via Google: {user_info['email']} (role: {existing_user.get('role')})")
            user_response = existing_user.copy()
            user_response.pop("password", None)
            if "_id" in user_response:
                user_response["_id"] = str(user_response["_id"])
            
            # Ensure role is set (fallback to jobseeker if missing)
            if "role" not in user_response or not user_response["role"]:
                logger.warning(f"User {user_info['email']} missing role, defaulting to jobseeker")
                user_response["role"] = "jobseeker"
            
            # Create JWT token
            access_token = create_access_token({"sub": existing_user["email"], "role": user_response["role"]})
            
            return {
                "access_token": access_token,
                "user": user_response,
                "is_new_user": False
            }
        else:
            # Create new user (role will be selected later)
            logger.info(f"Creating new user via Google: {user_info['email']}")
            
            user_doc = {
                "email": user_info["email"],
                "name": f"{user_info.get('given_name', '')} {user_info.get('family_name', '')}".strip() or user_info.get("name", "User"),
                "role": None,  # Role will be selected after authentication
                "avatar_url": user_info.get("picture"),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "last_active": datetime.utcnow(),
                "is_active": True,
                "is_verified": True,  # Google accounts are pre-verified
                "email_verified": True,
                "google_id": user_info.get("id"),
            }
            
            # Add default fields for both roles (will be updated when role is selected)
            user_doc.update({
                "skills": [],
                "experience_years": None,
                "preferred_job_types": [],
                "preferred_locations": [],
                "salary_expectations": None,
                "jobs_applied": 0,
                "profile_views": 0,
                "company_name": None,
                "jobs_posted": 0,
                "company_id": None,
            })
            
            # Insert user into database
            try:
                result = await users_collection.insert_one(user_doc)
                user_doc["_id"] = str(result.inserted_id)
                logger.info(f"User created successfully with ID: {result.inserted_id}")
            except Exception as db_error:
                logger.error(f"Database error creating user: {db_error}")
                raise HTTPException(status_code=500, detail="Failed to create user account")
            
            # Create JWT token (role may be None initially)
            access_token = create_access_token({"sub": user_doc["email"], "role": user_doc.get("role")})
            
            user_response = user_doc.copy()
            user_response.pop("password", None)
            
            logger.info(f"Google OAuth successful for new user: {user_info['email']} (role will be selected)")
            return {
                "access_token": access_token,
                "user": user_response,
                "is_new_user": True
            }
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in Google OAuth callback: {e}", exc_info=True)
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Google authentication failed: {str(e)}")


async def exchange_google_code_for_user_info(code: str):
    """Exchange Google OAuth authorization code for user info"""
    try:
        import httpx
        
        if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
            logger.error("Google OAuth credentials not configured")
            return None
        
        if not settings.GOOGLE_REDIRECT_URI:
            logger.error("GOOGLE_REDIRECT_URI not configured")
            return None
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Exchange authorization code for access token
            logger.info("Exchanging authorization code for access token...")
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": settings.GOOGLE_REDIRECT_URI
                }
            )
            
            if token_response.status_code != 200:
                logger.error(f"Failed to exchange code for token. Status: {token_response.status_code}")
                logger.error(f"Response: {token_response.text}")
                try:
                    error_data = token_response.json()
                    logger.error(f"Error details: {error_data}")
                except:
                    pass
                return None
            
            try:
                token_data = token_response.json()
            except Exception as json_error:
                logger.error(f"Failed to parse token response as JSON: {json_error}")
                logger.error(f"Response text: {token_response.text[:200]}")
                return None
            
            access_token = token_data.get("access_token")
            
            if not access_token:
                logger.error("No access token received from Google")
                logger.error(f"Token response: {token_data}")
                return None
            
            logger.info("Successfully obtained access token from Google")
            
            # Get user info using the access token
            logger.info("Fetching user info from Google...")
            user_info_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if user_info_response.status_code != 200:
                logger.error(f"Failed to get user info. Status: {user_info_response.status_code}")
                logger.error(f"Response: {user_info_response.text}")
                return None
            
            try:
                user_info = user_info_response.json()
            except Exception as json_error:
                logger.error(f"Failed to parse user info response as JSON: {json_error}")
                logger.error(f"Response text: {user_info_response.text[:200]}")
                return None
            
            if not user_info.get("email"):
                logger.error("User info missing email field")
                logger.error(f"User info received: {user_info}")
                return None
            
            logger.info(f"Successfully retrieved user info from Google: {user_info.get('email')}")
            return user_info
            
    except httpx.TimeoutException:
        logger.error("Timeout while exchanging Google code for user info")
        return None
    except httpx.RequestError as e:
        logger.error(f"Request error exchanging Google code: {e}")
        return None
    except Exception as e:
        logger.error(f"Error exchanging Google code for user info: {e}", exc_info=True)
        return None


async def fetch_google_user_info(access_token: str):
    """Fetch user info from Google using access token"""
    try:
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Google API error: {response.status_code} - {response.text}")
                return None
                
    except Exception as e:
        logger.error(f"Error fetching Google user info: {e}")
        return None


# Password reset endpoints would need to be re-implemented for MongoDB as well, but are omitted for brevity.

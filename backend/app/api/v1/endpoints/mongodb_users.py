from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.db.database import get_users_collection
from app.schemas.mongodb_schemas import MongoDBUser
from app.api.deps import get_current_user

router = APIRouter()

def get_users_db():
    return get_users_collection()


@router.get("/me", response_model=MongoDBUser)
async def get_current_user_profile(
    current_user: MongoDBUser = Depends(get_current_user)
):
    """Get current user profile"""
    return current_user

@router.put("/me", response_model=MongoDBUser)
async def update_current_user_profile(
    user_data: dict,
    current_user: MongoDBUser = Depends(get_current_user)
):
    """Update current user profile"""
    try:
        users_collection = get_users_collection()
        
        print(f"Updating profile for user: {current_user.email}")
        print(f"Update data received: {user_data}")
        
        # Prepare update data
        update_data = {"updated_at": datetime.utcnow()}
        for field, value in user_data.items():
            if value is not None:
                update_data[field] = value
        
        print(f"Final update data: {update_data}")
        
        # Update user in database
        result = await users_collection.update_one(
            {"email": current_user.email},
            {"$set": update_data}
        )
        
        print(f"Update result: matched={result.matched_count}, modified={result.modified_count}")
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Return updated user
        updated_user = await users_collection.find_one({"email": current_user.email})
        if updated_user:
            updated_user["_id"] = str(updated_user["_id"])
            print(f"Returning updated user: {updated_user.get('name', 'Unknown')}")
            return MongoDBUser(**updated_user)
        else:
            raise HTTPException(status_code=404, detail="User not found")
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating user profile: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )

@router.get("/", response_model=List[MongoDBUser])
def list_users(
    skip: int = 0,
    limit: int = 20,
    users_collection = Depends(get_users_db)
):
    """List all users"""
    try:
        cursor = users_collection.find().skip(skip).limit(limit)
        users = []
        for user in cursor:
            user["_id"] = str(user["_id"])
            users.append(MongoDBUser(**user))
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching users: {str(e)}")


@router.get("/{user_id}", response_model=MongoDBUser)
def get_user(
    user_id: str,
    users_collection = Depends(get_users_db)
):
    """Get a specific user by ID"""
    try:
        user = users_collection.find_one({"user_id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user["_id"] = str(user["_id"])
        return MongoDBUser(**user)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")


@router.post("/", response_model=MongoDBUser)
def create_user(
    user_data: dict,
    users_collection = Depends(get_users_db)
):
    """Create a new user"""
    try:
        user_doc = {
            "user_id": user_data.get("user_id"),
            "email": user_data.get("email"),
            "name": user_data.get("name"),
            "role": user_data.get("role", "jobseeker"),
            "skills": user_data.get("skills", []),
            "experience_years": user_data.get("experience_years"),
            "preferred_job_types": user_data.get("preferred_job_types", []),
            "preferred_locations": user_data.get("preferred_locations", []),
            "salary_expectations": user_data.get("salary_expectations"),
            "company_id": user_data.get("company_id"),
            "company_name": user_data.get("company_name"),
            "job_alerts": user_data.get("job_alerts", True),
            "email_notifications": user_data.get("email_notifications", True),
            "push_notifications": user_data.get("push_notifications", True),
            "jobs_applied": user_data.get("jobs_applied", 0),
            "jobs_posted": user_data.get("jobs_posted", 0),
            "profile_views": user_data.get("profile_views", 0),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "last_active": datetime.utcnow()
        }
        print("[DEBUG] Creating user in MongoDB with user_doc:", user_doc)
        result = users_collection.insert_one(user_doc)
        user_doc["_id"] = str(result.inserted_id)
        
        return MongoDBUser(**user_doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")


@router.put("/{user_id}", response_model=MongoDBUser)
def update_user(
    user_id: str,
    user_data: dict,
    users_collection = Depends(get_users_db)
):
    """Update a user"""
    try:
        update_data = {"updated_at": datetime.utcnow()}
        for field, value in user_data.items():
            if value is not None:
                update_data[field] = value
        
        result = users_collection.update_one(
            {"user_id": user_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Return updated user
        updated_user = users_collection.find_one({"user_id": user_id})
        updated_user["_id"] = str(updated_user["_id"])
        return MongoDBUser(**updated_user)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")


@router.delete("/{user_id}")
def delete_user(
    user_id: str,
    users_collection = Depends(get_users_db)
):
    """Delete a user"""
    try:
        result = users_collection.delete_one({"user_id": user_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "User deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting user: {str(e)}") 
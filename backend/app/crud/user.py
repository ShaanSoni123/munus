from typing import Optional
from app.core.security import get_password_hash
from app.schemas.mongodb_schemas import MongoDBUser as User
from app.schemas.user import UserCreate, UserUpdate
from app.schemas.mongodb_schemas import MongoDBCompany as Company
from app.schemas.company import CompanyCreate
from app.db.database import get_users_collection, get_companies_collection


def get_user_by_id(db, user_id: str) -> Optional[User]:
    """Get user by ID"""
    from bson import ObjectId
    users_collection = get_users_collection()
    try:
        user_data = users_collection.find_one({"_id": ObjectId(user_id)})
        if user_data:
            user_data["_id"] = str(user_data["_id"])
            return User(**user_data)
    except:
        pass
    return None


def get_user_by_email(db, email: str) -> Optional[User]:
    """Get user by email"""
    users_collection = get_users_collection()
    user_data = users_collection.find_one({"email": email})
    if user_data:
        return User(**user_data)
    return None


def create_user(db, user_data: UserCreate) -> User:
    """Create a new user"""
    hashed_password = get_password_hash(user_data.password)
    company_id = None
    if user_data.role == "employer" and getattr(user_data, "company", None):
        # Try to find existing company by name
        companies_collection = get_companies_collection()
        company = companies_collection.find_one({"name": user_data.company})
        if not company:
            # Create new company with minimal info
            company_in = CompanyCreate(name=user_data.company)
            company_data = company_in.dict()
            result = companies_collection.insert_one(company_data)
            company_id = str(result.inserted_id)
        else:
            company_id = str(company["_id"])
    
    users_collection = get_users_collection()
    user_data_dict = user_data.dict()
    user_data_dict["hashed_password"] = hashed_password
    user_data_dict["company_id"] = company_id
    del user_data_dict["password"]  # Remove plain password
    
    result = users_collection.insert_one(user_data_dict)
    user_data_dict["_id"] = str(result.inserted_id)
    return User(**user_data_dict)


def update_user(db, user_id: str, user_data: UserUpdate) -> Optional[User]:
    """Update user information"""
    from bson import ObjectId
    users_collection = get_users_collection()
    update_data = user_data.dict(exclude_unset=True)
    
    result = users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    
    if result.modified_count > 0:
        # Get updated user
        user_data = users_collection.find_one({"_id": ObjectId(user_id)})
        if user_data:
            user_data["_id"] = str(user_data["_id"])
            return User(**user_data)
    return None


def update_user_password(db, user_id: str, hashed_password: str) -> bool:
    """Update user password"""
    from bson import ObjectId
    users_collection = get_users_collection()
    
    result = users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"password": hashed_password}}
    )
    
    return result.modified_count > 0


def deactivate_user(db, user_id: str) -> bool:
    """Deactivate user account"""
    from bson import ObjectId
    users_collection = get_users_collection()
    
    result = users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_active": False}}
    )
    
    return result.modified_count > 0
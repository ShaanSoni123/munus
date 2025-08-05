from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.db.database import get_companies_collection
from app.schemas.mongodb_schemas import MongoDBCompany

router = APIRouter()

def get_companies_db():
    return get_companies_collection()


@router.get("/", response_model=List[MongoDBCompany])
def list_companies(
    skip: int = 0,
    limit: int = 20,
    companies_collection = Depends(get_companies_db)
):
    """List all companies"""
    try:
        cursor = companies_collection.find().skip(skip).limit(limit)
        companies = []
        for company in cursor:
            company["_id"] = str(company["_id"])
            companies.append(MongoDBCompany(**company))
        return companies
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching companies: {str(e)}")


@router.get("/{company_id}", response_model=MongoDBCompany)
def get_company(
    company_id: str,
    companies_collection = Depends(get_companies_db)
):
    """Get a specific company by ID"""
    try:
        company = companies_collection.find_one({"_id": ObjectId(company_id)})
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")
        
        company["_id"] = str(company["_id"])
        return MongoDBCompany(**company)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching company: {str(e)}")


@router.post("/", response_model=MongoDBCompany)
def create_company(
    company_data: dict,
    companies_collection = Depends(get_companies_db)
):
    """Create a new company"""
    try:
        company_doc = {
            "name": company_data.get("name"),
            "description": company_data.get("description"),
            "industry": company_data.get("industry"),
            "size": company_data.get("size"),
            "website": company_data.get("website"),
            "email": company_data.get("email"),
            "phone": company_data.get("phone"),
            "location": company_data.get("location"),
            "address": company_data.get("address"),
            "city": company_data.get("city"),
            "state": company_data.get("state"),
            "country": company_data.get("country"),
            "logo_url": company_data.get("logo_url"),
            "banner_url": company_data.get("banner_url"),
            "linkedin_url": company_data.get("linkedin_url"),
            "twitter_url": company_data.get("twitter_url"),
            "facebook_url": company_data.get("facebook_url"),
            "founded_year": company_data.get("founded_year"),
            "mission": company_data.get("mission"),
            "vision": company_data.get("vision"),
            "values": company_data.get("values", []),
            "jobs_posted": company_data.get("jobs_posted", 0),
            "total_applications": company_data.get("total_applications", 0),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_verified": company_data.get("is_verified", False),
            "verification_date": company_data.get("verification_date")
        }
        
        result = companies_collection.insert_one(company_doc)
        company_doc["_id"] = str(result.inserted_id)
        
        return MongoDBCompany(**company_doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating company: {str(e)}")


@router.put("/{company_id}", response_model=MongoDBCompany)
def update_company(
    company_id: str,
    company_data: dict,
    companies_collection = Depends(get_companies_db)
):
    """Update a company"""
    try:
        update_data = {"updated_at": datetime.utcnow()}
        for field, value in company_data.items():
            if value is not None:
                update_data[field] = value
        
        result = companies_collection.update_one(
            {"_id": ObjectId(company_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Company not found")
        
        # Return updated company
        updated_company = companies_collection.find_one({"_id": ObjectId(company_id)})
        updated_company["_id"] = str(updated_company["_id"])
        return MongoDBCompany(**updated_company)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating company: {str(e)}")


@router.delete("/{company_id}")
def delete_company(
    company_id: str,
    companies_collection = Depends(get_companies_db)
):
    """Delete a company"""
    try:
        result = companies_collection.delete_one({"_id": ObjectId(company_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Company not found")
        
        return {"message": "Company deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting company: {str(e)}")


@router.get("/search/")
def search_companies(
    query: Optional[str] = None,
    industry: Optional[str] = None,
    location: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    companies_collection = Depends(get_companies_db)
):
    """Search companies with filters"""
    try:
        search_query = {}
        
        if query:
            search_query["$or"] = [
                {"name": {"$regex": query, "$options": "i"}},
                {"description": {"$regex": query, "$options": "i"}}
            ]
        
        if industry:
            search_query["industry"] = {"$regex": industry, "$options": "i"}
        
        if location:
            search_query["$or"] = [
                {"location": {"$regex": location, "$options": "i"}},
                {"city": {"$regex": location, "$options": "i"}},
                {"state": {"$regex": location, "$options": "i"}},
                {"country": {"$regex": location, "$options": "i"}}
            ]
        
        cursor = companies_collection.find(search_query).skip(skip).limit(limit)
        companies = []
        for company in cursor:
            company["_id"] = str(company["_id"])
            companies.append(MongoDBCompany(**company))
        return companies
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching companies: {str(e)}") 
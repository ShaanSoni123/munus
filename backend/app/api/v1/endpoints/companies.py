from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_current_user, get_current_employer
from app.schemas.mongodb_schemas import MongoDBUser as User
from app.schemas.mongodb_schemas import MongoDBCompany as Company
from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse
from app.db.mongodb import get_companies_collection
from bson import ObjectId
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/", response_model=List[CompanyResponse])
async def get_companies(
    skip: int = 0,
    limit: int = 20
):
    """Get list of companies"""
    try:
        companies_collection = get_companies_collection()
        cursor = companies_collection.find().skip(skip).limit(limit)
        
        companies = []
        async for company_doc in cursor:
            company_doc["_id"] = str(company_doc["_id"])
            companies.append(Company(**company_doc))
        
        return companies
    except Exception as e:
        logger.error(f"Error fetching companies: {e}")
        return []


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(
    company_id: str
):
    """Get company by ID"""
    try:
        companies_collection = get_companies_collection()
        company_doc = await companies_collection.find_one({"_id": ObjectId(company_id)})
        
        if not company_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
        
        company_doc["_id"] = str(company_doc["_id"])
        return Company(**company_doc)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching company: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch company"
        )


@router.post("/", response_model=CompanyResponse)
async def create_company(
    company_data: CompanyCreate,
    current_user: User = Depends(get_current_employer)
):
    """Create a new company (employers only)"""
    try:
        companies_collection = get_companies_collection()
        
        company_dict = company_data.dict()
        company_dict.update({
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })
        
        result = await companies_collection.insert_one(company_dict)
        company_dict["_id"] = str(result.inserted_id)
        
        return Company(**company_dict)
        
    except Exception as e:
        logger.error(f"Error creating company: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create company"
        )


@router.put("/{company_id}", response_model=CompanyResponse)
async def update_company(
    company_id: str,
    company_data: CompanyUpdate,
    current_user: User = Depends(get_current_employer)
):
    """Update company (employers only)"""
    try:
        companies_collection = get_companies_collection()
        
        # Find company first
        company_doc = await companies_collection.find_one({"_id": ObjectId(company_id)})
        if not company_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
        
        # Update company
        update_data = company_data.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        result = await companies_collection.update_one(
            {"_id": ObjectId(company_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update company"
            )
        
        # Get updated company
        updated_doc = await companies_collection.find_one({"_id": ObjectId(company_id)})
        updated_doc["_id"] = str(updated_doc["_id"])
        
        return Company(**updated_doc)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating company: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update company"
        )
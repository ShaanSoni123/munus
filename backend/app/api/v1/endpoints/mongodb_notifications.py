from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.db.database import get_notifications_collection
from app.schemas.mongodb_schemas import MongoDBNotification

router = APIRouter()

def get_notifications_db():
    return get_notifications_collection()


@router.get("/", response_model=List[MongoDBNotification])
async def list_notifications(
    user_id: str,
    skip: int = 0,
    limit: int = 20,
    notifications_collection = Depends(get_notifications_db)
):
    """List notifications for a user"""
    try:
        cursor = notifications_collection.find({"user_id": user_id}).skip(skip).limit(limit).sort("created_at", -1)
        notifications = []
        async for notification in cursor:
            notification["_id"] = str(notification["_id"])
            notifications.append(MongoDBNotification(**notification))
        return notifications
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching notifications: {str(e)}")


@router.get("/unread-count")
async def get_unread_count(
    user_id: str = None,
    notifications_collection = Depends(get_notifications_db)
):
    """Get unread notification count for a user"""
    try:
        if not user_id:
            return {"unread_count": 0}
        count = await notifications_collection.count_documents({
            "user_id": user_id,
            "is_read": False
        })
        return {"unread_count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching unread count: {str(e)}")


@router.get("/{notification_id}", response_model=MongoDBNotification)
async def get_notification(
    notification_id: str,
    notifications_collection = Depends(get_notifications_db)
):
    """Get a specific notification by ID"""
    try:
        notification = await notifications_collection.find_one({"_id": ObjectId(notification_id)})
        if not notification:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        notification["_id"] = str(notification["_id"])
        return MongoDBNotification(**notification)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching notification: {str(e)}")


@router.post("/", response_model=MongoDBNotification)
async def create_notification(
    notification_data: dict,
    notifications_collection = Depends(get_notifications_db)
):
    """Create a new notification"""
    try:
        notification_doc = {
            "user_id": notification_data.get("user_id"),
            "title": notification_data.get("title"),
            "message": notification_data.get("message"),
            "notification_type": notification_data.get("notification_type"),
            "data": notification_data.get("data"),
            "action_url": notification_data.get("action_url"),
            "is_read": notification_data.get("is_read", False),
            "is_archived": notification_data.get("is_archived", False),
            "created_at": datetime.utcnow(),
            "read_at": notification_data.get("read_at")
        }
        
        result = await notifications_collection.insert_one(notification_doc)
        notification_doc["_id"] = str(result.inserted_id)
        
        return MongoDBNotification(**notification_doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating notification: {str(e)}")


@router.put("/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    notifications_collection = Depends(get_notifications_db)
):
    """Mark a notification as read"""
    try:
        result = await notifications_collection.update_one(
            {"_id": ObjectId(notification_id)},
            {
                "$set": {
                    "is_read": True,
                    "read_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        return {"message": "Notification marked as read"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error marking notification as read: {str(e)}")


@router.put("/{notification_id}/archive")
async def archive_notification(
    notification_id: str,
    notifications_collection = Depends(get_notifications_db)
):
    """Archive a notification"""
    try:
        result = await notifications_collection.update_one(
            {"_id": ObjectId(notification_id)},
            {"$set": {"is_archived": True}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        return {"message": "Notification archived"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error archiving notification: {str(e)}")


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    notifications_collection = Depends(get_notifications_db)
):
    """Delete a notification"""
    try:
        result = await notifications_collection.delete_one({"_id": ObjectId(notification_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        return {"message": "Notification deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting notification: {str(e)}") 
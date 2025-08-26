from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_current_user
from app.schemas.mongodb_schemas import MongoDBUser as User
from app.schemas.mongodb_schemas import MongoDBNotification as Notification
from app.schemas.notification import NotificationResponse, NotificationUpdate
from app.db.mongodb import get_notifications_collection
from bson import ObjectId
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/", response_model=List[NotificationResponse])
async def get_notifications(
    current_user: User = Depends(get_current_user)
):
    """Get user notifications"""
    try:
        notifications_collection = get_notifications_collection()
        cursor = notifications_collection.find({"user_id": current_user.id})
        cursor = cursor.sort("created_at", -1)
        
        notifications = []
        async for notification_doc in cursor:
            notification_doc["_id"] = str(notification_doc["_id"])
            notifications.append(Notification(**notification_doc))
        
        return notifications
    except Exception as e:
        logger.error(f"Error fetching notifications: {e}")
        return []


@router.put("/{notification_id}", response_model=NotificationResponse)
async def update_notification(
    notification_id: str,
    notification_data: NotificationUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update notification (mark as read)"""
    try:
        notifications_collection = get_notifications_collection()
        
        # Find notification by ID and user_id
        notification_doc = await notifications_collection.find_one({
            "_id": ObjectId(notification_id),
            "user_id": current_user.id
        })
        
        if not notification_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )
        
        # Update notification
        update_data = {}
        if notification_data.is_read is not None:
            update_data["is_read"] = notification_data.is_read
            if notification_data.is_read:
                update_data["read_at"] = datetime.utcnow()
        
        if update_data:
            await notifications_collection.update_one(
                {"_id": ObjectId(notification_id)},
                {"$set": update_data}
            )
            
            # Get updated notification
            updated_doc = await notifications_collection.find_one({"_id": ObjectId(notification_id)})
            updated_doc["_id"] = str(updated_doc["_id"])
            return Notification(**updated_doc)
        
        return Notification(**notification_doc)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating notification: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update notification"
        )


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete notification"""
    try:
        notifications_collection = get_notifications_collection()
        
        # Find and delete notification
        result = await notifications_collection.delete_one({
            "_id": ObjectId(notification_id),
            "user_id": current_user.id
        })
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )
        
        return {"message": "Notification deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting notification: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete notification"
        )


@router.post("/mark-all-read")
async def mark_all_notifications_read(
    current_user: User = Depends(get_current_user)
):
    """Mark all notifications as read"""
    try:
        notifications_collection = get_notifications_collection()
        
        result = await notifications_collection.update_many(
            {
                "user_id": current_user.id,
                "is_read": False
            },
            {
                "$set": {
                    "is_read": True,
                    "read_at": datetime.utcnow()
                }
            }
        )
        
        return {"message": f"Marked {result.modified_count} notifications as read"}
        
    except Exception as e:
        logger.error(f"Error marking notifications as read: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to mark notifications as read"
        )


@router.get("/unread-count")
async def get_unread_notifications_count(
    current_user: User = Depends(get_current_user)
):
    """Get count of unread notifications"""
    try:
        notifications_collection = get_notifications_collection()
        
        count = await notifications_collection.count_documents({
            "user_id": current_user.id,
            "is_read": False
        })
        
        return {"unread_count": count}
        
    except Exception as e:
        logger.error(f"Error getting unread count: {e}")
        return {"unread_count": 0}
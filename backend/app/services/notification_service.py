"""
Notification service for sending notifications to users
"""
from datetime import datetime
from typing import Optional, Dict, Any
from app.db.database import get_notifications_collection
from app.schemas.mongodb_schemas import MongoDBNotification
import logging

logger = logging.getLogger(__name__)


class NotificationService:
    """Service for creating and managing notifications"""
    
    def __init__(self):
        self.notifications_collection = get_notifications_collection()
    
    async def create_notification(
        self,
        user_id: str,
        title: str,
        message: str,
        notification_type: str,
        data: Optional[Dict[str, Any]] = None,
        action_url: Optional[str] = None
    ) -> Optional[MongoDBNotification]:
        """Create a new notification for a user"""
        try:
            notification_doc = {
                "user_id": user_id,
                "title": title,
                "message": message,
                "notification_type": notification_type,
                "data": data or {},
                "action_url": action_url,
                "is_read": False,
                "is_archived": False,
                "created_at": datetime.utcnow(),
                "read_at": None
            }
            
            result = await self.notifications_collection.insert_one(notification_doc)
            notification_doc["_id"] = str(result.inserted_id)
            
            logger.info(f"Created notification for user {user_id}: {title}")
            return MongoDBNotification(**notification_doc)
        except Exception as e:
            logger.error(f"Error creating notification: {e}")
            return None
    
    async def create_application_status_notification(
        self,
        applicant_id: str,
        job_title: str,
        company_name: str,
        status: str,
        job_id: str,
        application_id: str
    ) -> Optional[MongoDBNotification]:
        """Create a notification for application status change"""
        try:
            # Create appropriate message based on status
            if status == "accepted":
                title = f"🎉 Application Accepted!"
                message = f"Congratulations! Your application for {job_title} at {company_name} has been accepted. The employer will contact you soon."
                notification_type = "application_accepted"
            elif status == "rejected":
                title = f"Application Update"
                message = f"Thank you for your interest in {job_title} at {company_name}. While we were impressed with your qualifications, we have decided to move forward with other candidates."
                notification_type = "application_rejected"
            elif status == "shortlisted":
                title = f"🌟 You've Been Shortlisted!"
                message = f"Great news! You've been shortlisted for {job_title} at {company_name}. Expect to hear from them soon for the next steps."
                notification_type = "application_shortlisted"
            elif status == "interviewing":
                title = f"📅 Interview Scheduled"
                message = f"You've been selected for an interview for {job_title} at {company_name}. Check your email for interview details."
                notification_type = "application_interview"
            elif status == "reviewing":
                title = f"Application Under Review"
                message = f"Your application for {job_title} at {company_name} is being reviewed by the employer."
                notification_type = "application_reviewing"
            else:
                title = f"Application Status Update"
                message = f"Your application status for {job_title} at {company_name} has been updated to: {status}"
                notification_type = "application_status_change"
            
            # Create notification data
            data = {
                "job_id": job_id,
                "application_id": application_id,
                "job_title": job_title,
                "company_name": company_name,
                "status": status
            }
            
            action_url = f"/applications/{application_id}"
            
            return await self.create_notification(
                user_id=applicant_id,
                title=title,
                message=message,
                notification_type=notification_type,
                data=data,
                action_url=action_url
            )
        except Exception as e:
            logger.error(f"Error creating application status notification: {e}")
            return None
    
    async def create_new_application_notification(
        self,
        employer_id: str,
        applicant_name: str,
        job_title: str,
        job_id: str,
        application_id: str
    ) -> Optional[MongoDBNotification]:
        """Create a notification for employers when someone applies to their job"""
        try:
            title = f"🎯 New Job Application"
            message = f"{applicant_name} has applied for your {job_title} position. Review their application now."
            notification_type = "new_application"
            
            data = {
                "job_id": job_id,
                "application_id": application_id,
                "job_title": job_title,
                "applicant_name": applicant_name
            }
            
            action_url = f"/employer/applications/{job_id}"
            
            return await self.create_notification(
                user_id=employer_id,
                title=title,
                message=message,
                notification_type=notification_type,
                data=data,
                action_url=action_url
            )
        except Exception as e:
            logger.error(f"Error creating new application notification: {e}")
            return None


# Global instance
notification_service = NotificationService()
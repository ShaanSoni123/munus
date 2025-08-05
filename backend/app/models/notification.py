import enum

# Commented out all SQLAlchemy model class definitions for MongoDB-only setup.
# class NotificationType(enum.Enum):
#     JOB_APPLICATION = "job_application"
#     JOB_UPDATE = "job_update"
#     SYSTEM = "system"
#     EMAIL = "email"
#     SMS = "sms"

# class Notification(Base):
#     __tablename__ = "notifications"
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"))
#     title = Column(String(255), nullable=False)
#     message = Column(Text, nullable=False)
#     notification_type = Column(Enum(NotificationType), nullable=False)
#     is_read = Column(Boolean, default=False)
#     is_important = Column(Boolean, default=False)
#     action_url = Column(String(500))
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
#     user = relationship("User", back_populates="notifications")
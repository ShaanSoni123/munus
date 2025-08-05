# from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON, Float
# from sqlalchemy.sql import func
# from sqlalchemy.orm import relationship
# from app.db.database import Base

# Commented out all SQLAlchemy model class definitions for MongoDB-only setup.
# class Resume(Base):
#     __tablename__ = "resumes"
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
#     title = Column(String(255), nullable=False)
#     summary = Column(Text)
#     skills = Column(JSON)
#     experience = Column(JSON)
#     education = Column(JSON)
#     projects = Column(JSON)
#     certifications = Column(JSON)
#     is_public = Column(Boolean, default=True)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
#     user = relationship("User", back_populates="resumes")
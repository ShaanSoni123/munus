# from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum
# from sqlalchemy.sql import func
# from sqlalchemy.orm import relationship
# from app.db.database import Base
import enum

# Commented out all SQLAlchemy model class definitions for MongoDB-only setup.
# class UserRole(enum.Enum):
#     ADMIN = "admin"
#     EMPLOYER = "employer"
#     JOBSEEKER = "jobseeker"
#
# class User(Base):
#     __tablename__ = "users"
#     id = Column(Integer, primary_key=True, index=True)
#     ...
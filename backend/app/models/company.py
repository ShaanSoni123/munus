# from sqlalchemy import Column, Integer, String, Text, DateTime
# from sqlalchemy.sql import func
# from sqlalchemy.orm import relationship
# from app.db.database import Base

# Commented out all SQLAlchemy model class definitions for MongoDB-only setup.
# class Company(Base):
#     __tablename__ = "companies"
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String(255), nullable=False)
#     description = Column(Text)
#     website = Column(String(255))
#     industry = Column(String(100))
#     size = Column(String(50))
#     founded_year = Column(Integer)
#     location = Column(String(255))
#     logo_url = Column(String(500))
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
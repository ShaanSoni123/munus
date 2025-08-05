from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from app.services.google_drive_service import google_drive_service
from app.services.pdf_generator import pdf_generator
import os
import json
import logging

logger = logging.getLogger(__name__)

# For MongoDB compatibility, we'll use a mock Session type
class Session:
    pass

router = APIRouter()


# @router.get("/", response_model=List[ResumeResponse])
# def get_resumes(
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """Get user resumes"""
#     resumes = db.query(Resume).filter(
#         Resume.user_id == current_user.id
#     ).order_by(Resume.created_at.desc()).all()
#     
#     return resumes


# All SQLAlchemy-based endpoints commented out for MongoDB-only setup
# @router.get("/{resume_id}", response_model=ResumeResponse)
# @router.post("/", response_model=ResumeResponse)  
# @router.put("/{resume_id}", response_model=ResumeResponse)
# @router.delete("/{resume_id}")
# @router.post("/{resume_id}/set-default")
# (All these endpoints depend on SQLAlchemy models that are not available in MongoDB setup)


@router.post("/generate-pdf")
async def generate_resume_pdf(
    resume_data: dict
):
    """Generate a PDF for the resume from provided data"""
    try:
        logger.info(f"Generating PDF for resume data: {resume_data.keys()}")
        
        # Generate PDF from resume data
        pdf_content = pdf_generator.generate_resume_pdf(resume_data)
        
        # Create filename
        name = resume_data.get('personalInfo', {}).get('name', 'resume')
        filename = f"{name.replace(' ', '_').lower()}_resume.pdf"
        
        logger.info(f"PDF generated successfully, filename: {filename}")
        
        return {
            "success": True,
            "message": "PDF generated successfully",
            "filename": filename,
            "pdf_content": pdf_content.hex()  # Convert bytes to hex for JSON transmission
        }
        
    except Exception as e:
        logger.error(f"Error generating PDF: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate PDF: {str(e)}"
        )


@router.get("/test-pdf")
async def test_pdf_generation():
    """Test PDF generation with sample data"""
    sample_data = {
        "personalInfo": {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "phone": "+1 234 567 8900",
            "location": "San Francisco, CA"
        },
        "experience": [],
        "education": [],
        "skills": ["Python", "JavaScript", "React"],
        "projects": [],
        "certifications": []
    }
    
    try:
        pdf_content = pdf_generator.generate_resume_pdf(sample_data)
        return {
            "success": True,
            "message": "Test PDF generated successfully",
            "pdf_size": len(pdf_content)
        }
    except Exception as e:
        logger.error(f"Test PDF generation failed: {e}")
        return {
            "success": False,
            "error": str(e)
        }


# @router.post("/{resume_id}/upload-video")
# @router.post("/{resume_id}/upload-audio")
# (Upload endpoints also depend on SQLAlchemy models - commented out for MongoDB setup)


@router.post("/parse-google-drive")
async def parse_google_drive_resume(
    file: UploadFile = File(...),
    metadata: str = Form(...)
):
    """Parse resume from Google Drive file"""
    try:
        # Parse metadata
        file_metadata = json.loads(metadata)
        file_id = file_metadata.get('id')
        mime_type = file_metadata.get('mimeType')
        
        if not file_id or not mime_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file metadata"
            )
        
        # Validate file type
        allowed_types = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
        
        if mime_type not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported file type. Only PDF and DOCX files are supported."
            )
        
        # Validate file size (10MB limit)
        if file.size and file.size > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size must be less than 10MB."
            )
        
        # For now, we'll parse the uploaded file directly
        # In a production environment, you might want to use the Google Drive API
        # to download the file using the file_id and access token
        
        file_content = await file.read()
        
        # Parse based on file type
        if mime_type == 'application/pdf':
            parsed_data = google_drive_service.parse_pdf_content(file_content)
        elif mime_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            parsed_data = google_drive_service.parse_docx_content(file_content)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported file type"
            )
        
        return {
            "success": True,
            "message": "Resume parsed successfully",
            "data": parsed_data
        }
        
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid metadata format"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse resume: {str(e)}"
        )
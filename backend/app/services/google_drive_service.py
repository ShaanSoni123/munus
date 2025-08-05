import os
import io
import json
from typing import Dict, Any, Optional
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import PyPDF2
from docx import Document
from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)

class GoogleDriveService:
    def __init__(self):
        self.SCOPES = [
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/drive.file'
        ]
        self.service = None

    def validate_token(self, access_token: str) -> bool:
        """Validate Google OAuth access token"""
        try:
            credentials = Credentials(access_token)
            if credentials.expired and credentials.refresh_token:
                credentials.refresh(Request())
            
            # Test the token by making a simple API call
            service = build('drive', 'v3', credentials=credentials)
            service.files().list(pageSize=1).execute()
            return True
        except Exception as e:
            logger.error(f"Token validation failed: {e}")
            return False

    def download_file(self, file_id: str, access_token: str) -> bytes:
        """Download file content from Google Drive"""
        try:
            credentials = Credentials(access_token)
            service = build('drive', 'v3', credentials=credentials)
            
            # Get file metadata
            file_metadata = service.files().get(fileId=file_id).execute()
            
            # Download file content
            request = service.files().get_media(fileId=file_id)
            file_content = io.BytesIO()
            downloader = MediaIoBaseDownload(file_content, request)
            
            done = False
            while not done:
                status, done = downloader.next_chunk()
                if status:
                    logger.info(f"Download {int(status.progress() * 100)}%")
            
            return file_content.getvalue()
            
        except Exception as e:
            logger.error(f"Failed to download file: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to download file from Google Drive: {str(e)}"
            )

    def parse_pdf_content(self, file_content: bytes) -> Dict[str, Any]:
        """Parse PDF content and extract resume information"""
        try:
            pdf_file = io.BytesIO(file_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text_content = ""
            for page in pdf_reader.pages:
                text_content += page.extract_text()
            
            return self._extract_resume_data(text_content)
            
        except Exception as e:
            logger.error(f"Failed to parse PDF: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to parse PDF file: {str(e)}"
            )

    def parse_docx_content(self, file_content: bytes) -> Dict[str, Any]:
        """Parse DOCX content and extract resume information"""
        try:
            doc_file = io.BytesIO(file_content)
            doc = Document(doc_file)
            
            text_content = ""
            for paragraph in doc.paragraphs:
                text_content += paragraph.text + "\n"
            
            return self._extract_resume_data(text_content)
            
        except Exception as e:
            logger.error(f"Failed to parse DOCX: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to parse DOCX file: {str(e)}"
            )

    def _extract_resume_data(self, text_content: str) -> Dict[str, Any]:
        """Extract resume information from text content using basic parsing"""
        # This is a basic implementation - in production, you might want to use
        # more sophisticated NLP/AI models for better extraction
        
        lines = text_content.split('\n')
        personal_info = {}
        
        # Basic email extraction
        import re
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text_content)
        if emails:
            personal_info['email'] = emails[0]
        
        # Basic phone extraction
        phone_pattern = r'(\+?[\d\s\-\(\)]{10,})'
        phones = re.findall(phone_pattern, text_content)
        if phones:
            personal_info['phone'] = phones[0].strip()
        
        # Try to extract name (first line that looks like a name)
        for line in lines[:10]:  # Check first 10 lines
            line = line.strip()
            if line and len(line.split()) <= 4 and not any(char.isdigit() for char in line):
                if not personal_info.get('name'):
                    personal_info['name'] = line
                break
        
        # Extract summary (look for longer paragraphs)
        summary_candidates = []
        for line in lines:
            line = line.strip()
            if len(line) > 50 and len(line) < 500:
                summary_candidates.append(line)
        
        if summary_candidates:
            personal_info['summary'] = summary_candidates[0]
        
        # Try to extract location (look for common location patterns)
        location_patterns = [
            r'\b[A-Z][a-z]+,\s*[A-Z]{2}\b',  # City, State
            r'\b[A-Z][a-z]+,\s*[A-Z][a-z]+\b',  # City, Country
        ]
        
        for pattern in location_patterns:
            locations = re.findall(pattern, text_content)
            if locations:
                personal_info['location'] = locations[0]
                break
        
        return {
            'personalInfo': personal_info,
            'rawText': text_content[:1000]  # First 1000 characters for debugging
        }

    def process_google_drive_file(self, file_id: str, access_token: str, mime_type: str) -> Dict[str, Any]:
        """Process a Google Drive file and extract resume information"""
        # Validate token
        if not self.validate_token(access_token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired Google OAuth token"
            )
        
        # Download file
        file_content = self.download_file(file_id, access_token)
        
        # Parse based on file type
        if mime_type == 'application/pdf':
            return self.parse_pdf_content(file_content)
        elif mime_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return self.parse_docx_content(file_content)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported file type. Only PDF and DOCX files are supported."
            )

# Create singleton instance
google_drive_service = GoogleDriveService() 
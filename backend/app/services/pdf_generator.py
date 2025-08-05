import os
import io
from datetime import datetime
from typing import Dict, Any, List
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)

class PDFGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles for the resume"""
        # Header style
        self.styles.add(ParagraphStyle(
            name='ResumeHeader',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=12,
            textColor=HexColor('#1e40af'),
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Section header style
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceAfter=8,
            spaceBefore=16,
            textColor=HexColor('#1e40af'),
            fontName='Helvetica-Bold',
            borderWidth=1,
            borderColor=HexColor('#1e40af'),
            borderPadding=6,
            backColor=HexColor('#f8fafc')
        ))
        
        # Contact info style
        self.styles.add(ParagraphStyle(
            name='ContactInfo',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=6,
            alignment=TA_CENTER,
            fontName='Helvetica'
        ))
        
        # Job title style
        self.styles.add(ParagraphStyle(
            name='JobTitle',
            parent=self.styles['Normal'],
            fontSize=12,
            spaceAfter=4,
            fontName='Helvetica-Bold',
            textColor=HexColor('#374151')
        ))
        
        # Company style
        self.styles.add(ParagraphStyle(
            name='Company',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=2,
            fontName='Helvetica-Bold',
            textColor=HexColor('#6b7280')
        ))
        
        # Date style
        self.styles.add(ParagraphStyle(
            name='Date',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=6,
            fontName='Helvetica',
            textColor=HexColor('#9ca3af')
        ))
        
        # Description style
        self.styles.add(ParagraphStyle(
            name='Description',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=8,
            fontName='Helvetica',
            alignment=TA_JUSTIFY,
            leftIndent=20
        ))
        
        # Skill style
        self.styles.add(ParagraphStyle(
            name='Skill',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=2,
            fontName='Helvetica'
        ))

    def generate_resume_pdf(self, resume_data: Dict[str, Any]) -> bytes:
        """Generate a PDF resume from resume data"""
        try:
            logger.info("Starting PDF generation")
            logger.info(f"Resume data keys: {list(resume_data.keys()) if resume_data else 'None'}")
            
            # Create PDF in memory
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(
                buffer,
                pagesize=A4,
                rightMargin=0.75*inch,
                leftMargin=0.75*inch,
                topMargin=0.75*inch,
                bottomMargin=0.75*inch
            )
            
            # Build the PDF content
            story = []
            
            # Add header with name
            personal_info = resume_data.get('personalInfo', {})
            name = personal_info.get('name', 'Resume')
            
            story.append(Paragraph(
                name,
                self.styles['ResumeHeader']
            ))
            story.append(Spacer(1, 12))
            
            # Add contact information
            contact_info = self._build_contact_info(resume_data.get('personalInfo', {}))
            if contact_info:
                story.append(contact_info)
                story.append(Spacer(1, 16))
            
            # Add professional summary
            if resume_data.get('personalInfo', {}).get('summary'):
                story.append(Paragraph(
                    'Professional Summary',
                    self.styles['SectionHeader']
                ))
                story.append(Paragraph(
                    resume_data['personalInfo']['summary'],
                    self.styles['Description']
                ))
                story.append(Spacer(1, 12))
            
            # Add experience section
            if resume_data.get('experience'):
                story.append(Paragraph(
                    'Professional Experience',
                    self.styles['SectionHeader']
                ))
                story.extend(self._build_experience_section(resume_data['experience']))
                story.append(Spacer(1, 12))
            
            # Add education section
            if resume_data.get('education'):
                story.append(Paragraph(
                    'Education',
                    self.styles['SectionHeader']
                ))
                story.extend(self._build_education_section(resume_data['education']))
                story.append(Spacer(1, 12))
            
            # Add skills section
            if resume_data.get('skills'):
                story.append(Paragraph(
                    'Skills',
                    self.styles['SectionHeader']
                ))
                story.extend(self._build_skills_section(resume_data['skills']))
                story.append(Spacer(1, 12))
            
            # Add projects section
            if resume_data.get('projects'):
                story.append(Paragraph(
                    'Projects',
                    self.styles['SectionHeader']
                ))
                story.extend(self._build_projects_section(resume_data['projects']))
                story.append(Spacer(1, 12))
            
            # Add certifications section
            if resume_data.get('certifications'):
                story.append(Paragraph(
                    'Certifications',
                    self.styles['SectionHeader']
                ))
                story.extend(self._build_certifications_section(resume_data['certifications']))
            
            # Build the PDF
            doc.build(story)
            
            # Get the PDF content
            buffer.seek(0)
            return buffer.getvalue()
            
        except Exception as e:
            logger.error(f"Error generating PDF: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate PDF: {str(e)}"
            )

    def _build_contact_info(self, personal_info: Dict[str, Any]) -> Paragraph:
        """Build contact information section"""
        contact_parts = []
        
        if personal_info.get('email'):
            contact_parts.append(f"Email: {personal_info['email']}")
        if personal_info.get('phone'):
            contact_parts.append(f"Phone: {personal_info['phone']}")
        if personal_info.get('location'):
            contact_parts.append(f"Location: {personal_info['location']}")
        if personal_info.get('linkedIn'):
            contact_parts.append(f"LinkedIn: {personal_info['linkedIn']}")
        if personal_info.get('github'):
            contact_parts.append(f"GitHub: {personal_info['github']}")
        if personal_info.get('portfolio'):
            contact_parts.append(f"Portfolio: {personal_info['portfolio']}")
        
        if contact_parts:
            contact_text = " | ".join(contact_parts)
            return Paragraph(contact_text, self.styles['ContactInfo'])
        
        return None

    def _build_experience_section(self, experiences: List[Dict[str, Any]]) -> List:
        """Build experience section"""
        story = []
        
        for exp in experiences:
            # Job title and company
            title_company = f"{exp.get('position', '')} at {exp.get('company', '')}"
            story.append(Paragraph(title_company, self.styles['JobTitle']))
            
            # Date range
            start_date = exp.get('startDate')
            end_date = exp.get('endDate')
            current = exp.get('current', False)
            
            if start_date:
                start_str = self._format_date(start_date)
                if current or not end_date:
                    date_range = f"{start_str} - Present"
                else:
                    end_str = self._format_date(end_date)
                    date_range = f"{start_str} - {end_str}"
                
                story.append(Paragraph(date_range, self.styles['Date']))
            
            # Description
            if exp.get('description'):
                story.append(Paragraph(exp['description'], self.styles['Description']))
            
            # Achievements
            if exp.get('achievements'):
                for achievement in exp['achievements']:
                    story.append(Paragraph(
                        f"• {achievement}",
                        self.styles['Description']
                    ))
            
            story.append(Spacer(1, 8))
        
        return story

    def _build_education_section(self, education: List[Dict[str, Any]]) -> List:
        """Build education section"""
        story = []
        
        for edu in education:
            # Degree and institution
            degree = edu.get('degree', '')
            field = edu.get('field', '')
            institution = edu.get('institution', '')
            
            if degree and field:
                degree_text = f"{degree} in {field}"
            else:
                degree_text = degree or field
            
            if degree_text and institution:
                title_text = f"{degree_text} from {institution}"
            else:
                title_text = degree_text or institution
            
            story.append(Paragraph(title_text, self.styles['JobTitle']))
            
            # Date range
            start_date = edu.get('startDate')
            end_date = edu.get('endDate')
            
            if start_date:
                start_str = self._format_date(start_date)
                if not end_date:
                    date_range = f"{start_str} - Present"
                else:
                    end_str = self._format_date(end_date)
                    date_range = f"{start_str} - {end_str}"
                
                story.append(Paragraph(date_range, self.styles['Date']))
            
            # GPA
            if edu.get('gpa'):
                story.append(Paragraph(f"GPA: {edu['gpa']}", self.styles['Description']))
            
            # Description
            if edu.get('description'):
                story.append(Paragraph(edu['description'], self.styles['Description']))
            
            story.append(Spacer(1, 8))
        
        return story

    def _build_skills_section(self, skills: List[str]) -> List:
        """Build skills section"""
        story = []
        
        # Group skills into columns for better layout
        skills_text = ", ".join(skills)
        story.append(Paragraph(skills_text, self.styles['Skill']))
        
        return story

    def _build_projects_section(self, projects: List[Dict[str, Any]]) -> List:
        """Build projects section"""
        story = []
        
        for project in projects:
            # Project name
            story.append(Paragraph(project.get('name', ''), self.styles['JobTitle']))
            
            # Description
            if project.get('description'):
                story.append(Paragraph(project['description'], self.styles['Description']))
            
            # Technologies
            if project.get('technologies'):
                tech_text = f"Technologies: {', '.join(project['technologies'])}"
                story.append(Paragraph(tech_text, self.styles['Description']))
            
            # Links
            links = []
            if project.get('url'):
                links.append(f"Live Demo: {project['url']}")
            if project.get('github'):
                links.append(f"GitHub: {project['github']}")
            
            if links:
                links_text = " | ".join(links)
                story.append(Paragraph(links_text, self.styles['Description']))
            
            story.append(Spacer(1, 8))
        
        return story

    def _build_certifications_section(self, certifications: List[Dict[str, Any]]) -> List:
        """Build certifications section"""
        story = []
        
        for cert in certifications:
            # Certification name and issuer
            name = cert.get('name', '')
            issuer = cert.get('issuer', '')
            
            if name and issuer:
                title_text = f"{name} from {issuer}"
            else:
                title_text = name or issuer
            
            story.append(Paragraph(title_text, self.styles['JobTitle']))
            
            # Date
            if cert.get('date'):
                date_str = self._format_date(cert['date'])
                story.append(Paragraph(date_str, self.styles['Date']))
            
            # Credential ID
            if cert.get('credentialId'):
                story.append(Paragraph(f"Credential ID: {cert['credentialId']}", self.styles['Description']))
            
            # URL
            if cert.get('url'):
                story.append(Paragraph(f"Verification: {cert['url']}", self.styles['Description']))
            
            story.append(Spacer(1, 8))
        
        return story

    def _format_date(self, date_value: Any) -> str:
        """Format date for display"""
        if isinstance(date_value, str):
            try:
                # Try to parse ISO date string
                date_obj = datetime.fromisoformat(date_value.replace('Z', '+00:00'))
                return date_obj.strftime('%B %Y')
            except:
                return date_value
        elif hasattr(date_value, 'strftime'):
            return date_value.strftime('%B %Y')
        else:
            return str(date_value)

# Create singleton instance
pdf_generator = PDFGenerator() 
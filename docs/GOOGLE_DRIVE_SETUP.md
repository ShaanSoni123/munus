# Google Drive Integration Setup

This document explains how to set up Google Drive integration for resume imports in the Jobify platform.

## Prerequisites

1. Google Cloud Console account
2. Google Drive API enabled
3. Google Picker API enabled

## Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Drive API
   - Google Picker API

### 2. Configure OAuth 2.0

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
5. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
6. Save and note the Client ID

### 3. Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Restrict the API key to:
   - Google Drive API
   - Google Picker API
4. Save and note the API Key

### 4. Environment Variables

#### Frontend (.env)
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

#### Backend (.env)
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 5. Install Dependencies

#### Backend
```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client python-docx PyPDF2
```

## Features

### Frontend
- Modern button with Google Drive branding
- OAuth 2.0 authentication flow
- Google Picker API for file selection
- File type validation (PDF, DOCX only)
- File size validation (10MB limit)
- Loading states and error handling
- Toast notifications for user feedback

### Backend
- Secure OAuth token validation
- File content parsing (PDF and DOCX)
- Resume information extraction
- Error handling and logging
- File size and type validation

## Security Considerations

1. **OAuth Scopes**: Only request necessary scopes:
   - `https://www.googleapis.com/auth/drive.readonly`
   - `https://www.googleapis.com/auth/drive.file`

2. **Token Handling**: 
   - Validate tokens on the backend
   - Don't store tokens permanently
   - Handle token refresh properly

3. **File Validation**:
   - Validate file types server-side
   - Check file size limits
   - Sanitize file content

4. **API Key Security**:
   - Restrict API keys to specific domains
   - Use environment variables
   - Never expose secrets in client-side code

## Usage

1. User clicks "Import Resume from Google Drive"
2. Google OAuth popup appears for authentication
3. User grants permissions
4. Google Picker opens for file selection
5. User selects a PDF or DOCX file
6. File is downloaded and parsed on the backend
7. Extracted information populates the resume form

## Troubleshooting

### Common Issues

1. **"Failed to initialize Google Drive"**
   - Check if Google APIs are enabled
   - Verify API key and client ID
   - Check browser console for errors

2. **"Invalid or expired token"**
   - User needs to re-authenticate
   - Check OAuth configuration
   - Verify redirect URIs

3. **"Unsupported file type"**
   - Only PDF and DOCX files are supported
   - Check file extension and MIME type

4. **"File size too large"**
   - Maximum file size is 10MB
   - Compress or resize the file

### Debug Mode

Enable debug logging in the browser console:
```javascript
localStorage.setItem('googleDriveDebug', 'true');
```

## API Endpoints

### POST /api/v1/resumes/parse-google-drive
Parses a resume file from Google Drive.

**Request:**
- `file`: Uploaded file (PDF or DOCX)
- `metadata`: JSON string with file metadata

**Response:**
```json
{
  "success": true,
  "message": "Resume parsed successfully",
  "data": {
    "personalInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "location": "New York, NY",
      "summary": "Experienced developer..."
    },
    "rawText": "First 1000 characters of parsed text..."
  }
}
```

## Future Enhancements

1. **AI-Powered Parsing**: Use NLP models for better information extraction
2. **Multiple File Support**: Allow importing multiple resumes
3. **Template Matching**: Auto-detect resume templates
4. **Skill Extraction**: Extract skills and technologies
5. **Experience Parsing**: Parse work experience and education
6. **Image Processing**: Handle scanned PDFs with OCR 
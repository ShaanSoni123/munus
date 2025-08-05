# SkillGlide API Documentation

## 🔗 Base URL
```
Development: http://localhost:8000/api/v1
Production: https://your-domain.com/api/v1
```

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## 📋 Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/password-reset` - Request password reset
- `POST /auth/password-reset/confirm` - Confirm password reset

### Users
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update user profile
- `POST /users/change-password` - Change password

### Jobs
- `GET /jobs/` - List jobs with filters
- `GET /jobs/{job_id}` - Get job details
- `POST /jobs/` - Create job (employers only)
- `PUT /jobs/{job_id}` - Update job (employers only)
- `DELETE /jobs/{job_id}` - Delete job (employers only)
- `POST /jobs/{job_id}/apply` - Apply to job

### Notifications
- `GET /notifications/` - Get user notifications
- `PUT /notifications/{id}` - Mark notification as read
- `DELETE /notifications/{id}` - Delete notification
- `GET /notifications/unread-count` - Get unread count

### File Upload
- `POST /upload/avatar` - Upload profile picture
- `POST /upload/resume` - Upload resume file
- `POST /upload/video` - Upload video file
- `POST /upload/audio` - Upload audio file

## 📊 Response Format

### Success Response
```json
{
  "data": {...},
  "message": "Success"
}
```

### Error Response
```json
{
  "detail": "Error message"
}
```

## 🔍 Example Requests

### Login
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "role": "jobseeker"
  }'
```

### Get Jobs
```bash
curl -X GET "http://localhost:8000/api/v1/jobs/?search=developer&location=bangalore" \
  -H "Authorization: Bearer <token>"
```

### Update Profile
```bash
curl -X PUT "http://localhost:8000/api/v1/users/me" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "location": "Bangalore, India"
  }'
```
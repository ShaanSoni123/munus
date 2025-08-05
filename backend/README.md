# SkillGlide Backend API

A comprehensive Python backend for the SkillGlide job portal application built with FastAPI, PostgreSQL, and modern Python technologies.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Job Management** - Complete CRUD operations for job postings
- **Resume Builder** - AI-powered resume creation with video/voice support
- **Application Tracking** - Full application lifecycle management
- **Notifications System** - Real-time notifications for users
- **File Upload** - Secure file handling for resumes, avatars, and media
- **Email Services** - Automated email notifications

### Technical Features
- **FastAPI Framework** - Modern, fast web framework for building APIs
- **PostgreSQL Database** - Robust relational database with SQLAlchemy ORM
- **Async Support** - Asynchronous database operations for better performance
- **Redis Caching** - Fast caching and session management
- **Celery Background Tasks** - Asynchronous task processing
- **Docker Support** - Containerized deployment
- **Database Migrations** - Alembic for database schema management
- **API Documentation** - Auto-generated OpenAPI/Swagger docs
- **Security** - Password hashing, JWT tokens, CORS protection
- **Validation** - Pydantic models for request/response validation

## 🛠 Technology Stack

- **Framework**: FastAPI 0.104+
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy 2.0
- **Authentication**: JWT with python-jose
- **Password Hashing**: bcrypt
- **Caching**: Redis
- **Background Tasks**: Celery
- **File Storage**: Local/AWS S3 support
- **Email**: SMTP with fastapi-mail
- **Validation**: Pydantic
- **Migrations**: Alembic
- **Testing**: pytest
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── core/
│   │   ├── config.py          # Application configuration
│   │   └── security.py        # Authentication & security utilities
│   ├── db/
│   │   └── database.py        # Database connection and session management
│   ├── models/                # SQLAlchemy database models
│   │   ├── user.py
│   │   ├── job.py
│   │   ├── resume.py
│   │   ├── notification.py
│   │   └── company.py
│   ├── schemas/               # Pydantic models for API validation
│   │   ├── user.py
│   │   ├── job.py
│   │   ├── resume.py
│   │   ├── notification.py
│   │   └── company.py
│   ├── api/                   # API route handlers
│   │   ├── deps.py           # Dependencies (auth, db sessions)
│   │   └── v1/
│   │       └── endpoints/
│   │           ├── auth.py
│   │           ├── users.py
│   │           ├── jobs.py
│   │           ├── resumes.py
│   │           ├── notifications.py
│   │           ├── companies.py
│   │           └── upload.py
│   ├── crud/                  # Database operations
│   │   ├── user.py
│   │   ├── job.py
│   │   └── resume.py
│   ├── services/              # Business logic services
│   │   ├── email.py
│   │   ├── file_upload.py
│   │   └── ai_services.py
│   └── tasks/                 # Background tasks
│       └── celery.py
├── alembic/                   # Database migrations
├── tests/                     # Test files
├── uploads/                   # File upload directory
├── requirements.txt           # Python dependencies
├── docker-compose.yml         # Docker services configuration
├── Dockerfile                 # Docker image configuration
├── .env.example              # Environment variables template
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### Option 1: Docker Setup (Recommended)

1. **Clone and setup**:
```bash
git clone <repository>
cd backend
cp .env.example .env
```

2. **Configure environment variables** in `.env`:
```env
DATABASE_URL=postgresql://skillglide_user:skillglide_password@localhost:5432/skillglide_db
SECRET_KEY=your-super-secret-key-here
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

3. **Start services**:
```bash
docker-compose up -d
```

4. **Run migrations**:
```bash
docker-compose exec backend alembic upgrade head
```

5. **Access the API**:
- API: http://localhost:8000
- Documentation: http://localhost:8000/api/v1/docs
- Database: localhost:5432
- Redis: localhost:6379

### Option 2: Local Development Setup

1. **Install dependencies**:
```bash
pip install -r requirements.txt
```

2. **Setup PostgreSQL database**:
```sql
CREATE DATABASE skillglide_db;
CREATE USER skillglide_user WITH PASSWORD 'skillglide_password';
GRANT ALL PRIVILEGES ON DATABASE skillglide_db TO skillglide_user;
```

3. **Run migrations**:
```bash
alembic upgrade head
```

4. **Start the server**:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/password-reset` - Request password reset
- `POST /api/v1/auth/password-reset/confirm` - Confirm password reset

### User Management
- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update user profile
- `POST /api/v1/users/upload-avatar` - Upload profile picture

### Job Management
- `GET /api/v1/jobs/` - List jobs with filters
- `POST /api/v1/jobs/` - Create new job (employers only)
- `GET /api/v1/jobs/{job_id}` - Get job details
- `PUT /api/v1/jobs/{job_id}` - Update job (employers only)
- `DELETE /api/v1/jobs/{job_id}` - Delete job (employers only)
- `POST /api/v1/jobs/{job_id}/apply` - Apply to job (job seekers only)

### Resume Management
- `GET /api/v1/resumes/` - List user resumes
- `POST /api/v1/resumes/` - Create new resume
- `GET /api/v1/resumes/{resume_id}` - Get resume details
- `PUT /api/v1/resumes/{resume_id}` - Update resume
- `DELETE /api/v1/resumes/{resume_id}` - Delete resume
- `POST /api/v1/resumes/{resume_id}/upload-video` - Upload video resume
- `POST /api/v1/resumes/{resume_id}/upload-audio` - Upload voice resume

### Notifications
- `GET /api/v1/notifications/` - List user notifications
- `PUT /api/v1/notifications/{notification_id}` - Mark as read
- `DELETE /api/v1/notifications/{notification_id}` - Delete notification

### File Upload
- `POST /api/v1/upload/avatar` - Upload profile picture
- `POST /api/v1/upload/resume` - Upload resume file
- `POST /api/v1/upload/video` - Upload video file
- `POST /api/v1/upload/audio` - Upload audio file

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/skillglide_db
ASYNC_DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/skillglide_db

# Security
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Email
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587

# File Storage (Optional - AWS S3)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_BUCKET_NAME=skillglide-uploads
AWS_REGION=us-east-1

# Redis
REDIS_URL=redis://localhost:6379

# Environment
ENVIRONMENT=development
DEBUG=True
```

## 🧪 Testing

Run tests with pytest:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py
```

## 📊 Database Schema

### Key Models

1. **User** - User accounts with role-based access
2. **Company** - Company profiles for employers
3. **Job** - Job postings with detailed requirements
4. **JobApplication** - Application tracking
5. **Resume** - User resumes with multimedia support
6. **Experience/Education/Skills** - Resume components
7. **Notification** - User notifications system

### Relationships
- Users can have multiple resumes
- Employers can post multiple jobs
- Jobs can have multiple applications
- Users can have multiple notifications
- Resumes contain experiences, education, skills, projects, and certifications

## 🔄 Background Tasks

The application uses Celery for background task processing:

- **Email sending** - Welcome emails, password resets, notifications
- **File processing** - Image resizing, video transcoding
- **AI processing** - Resume analysis, job matching
- **Data cleanup** - Removing expired tokens, old files
- **Analytics** - Generating reports and insights

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**:
```bash
export ENVIRONMENT=production
export DEBUG=False
```

2. **Database Migration**:
```bash
alembic upgrade head
```

3. **Start Services**:
```bash
# API Server
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker

# Background Workers
celery -A app.tasks.celery worker --loglevel=info
celery -A app.tasks.celery beat --loglevel=info
```

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **CORS Protection** - Configurable cross-origin resource sharing
- **Input Validation** - Pydantic models for request validation
- **SQL Injection Prevention** - SQLAlchemy ORM protection
- **Rate Limiting** - API rate limiting (can be added)
- **File Upload Security** - File type and size validation

## 📈 Performance Optimization

- **Async Database Operations** - Non-blocking database queries
- **Redis Caching** - Fast data retrieval
- **Database Indexing** - Optimized query performance
- **Connection Pooling** - Efficient database connections
- **Background Tasks** - Non-blocking heavy operations
- **Pagination** - Efficient data loading

## 🤝 Integration with Frontend

The backend is designed to work seamlessly with the React frontend:

1. **CORS Configuration** - Allows frontend requests
2. **JWT Tokens** - Secure authentication flow
3. **RESTful API** - Standard HTTP methods and status codes
4. **JSON Responses** - Consistent data format
5. **Error Handling** - Detailed error messages
6. **File Upload** - Multipart form data support

### Frontend Integration Example

```javascript
// Login example
const response = await fetch('http://localhost:8000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    role: 'jobseeker'
  })
});

const data = await response.json();
// Store tokens and user data
localStorage.setItem('access_token', data.access_token);
localStorage.setItem('user', JSON.stringify(data.user));
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Ensure database exists

2. **Authentication Issues**:
   - Check SECRET_KEY is set
   - Verify JWT token format
   - Check token expiration

3. **File Upload Issues**:
   - Check uploads directory permissions
   - Verify file size limits
   - Check AWS S3 credentials (if using)

4. **Email Issues**:
   - Verify SMTP credentials
   - Check email server settings
   - Enable "Less secure app access" for Gmail

## 📞 Support

For issues and questions:
1. Check the API documentation at `/api/v1/docs`
2. Review the logs for error details
3. Check the troubleshooting section
4. Create an issue in the repository

## 🔄 Updates and Maintenance

- **Database Migrations**: Use Alembic for schema changes
- **Dependency Updates**: Regularly update requirements.txt
- **Security Updates**: Monitor for security vulnerabilities
- **Performance Monitoring**: Use logging and metrics
- **Backup Strategy**: Regular database backups

This backend provides a solid foundation for the SkillGlide job portal with modern Python technologies, comprehensive features, and production-ready architecture.
from fastapi import APIRouter
# from app.api.v1.endpoints import auth, users, jobs, resumes, notifications, companies, upload
# Only import MongoDB endpoints here if needed.

api_router = APIRouter()

# Include all route modules
# api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
# api_router.include_router(users.router, prefix="/users", tags=["users"])
# api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
# api_router.include_router(resumes.router, prefix="/resumes", tags=["resumes"])
# api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
# api_router.include_router(companies.router, prefix="/companies", tags=["companies"])
# api_router.include_router(upload.router, prefix="/upload", tags=["file-upload"])
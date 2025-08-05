import asyncio
import os
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

# MongoDB Configuration
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "jobify")

async def create_sample_jobs():
    """Create sample jobs in the database"""
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[MONGODB_DB_NAME]
    
    # Sample jobs data
    sample_jobs = [
        {
            "title": "Senior Software Engineer",
            "description": "We are looking for a talented Senior Software Engineer to join our team. You will be responsible for developing and maintaining high-quality software solutions.",
            "location": "San Francisco, CA",
            "job_type": "full-time",
            "work_mode": "hybrid",
            "experience_level": "5+",
            "salary_min": 120000,
            "salary_max": 180000,
            "salary_currency": "USD",
            "salary_period": "year",
            "required_skills": ["Python", "JavaScript", "React", "Node.js", "MongoDB"],
            "company_name": "TechCorp Inc",
            "employer_name": "TechCorp Inc",
            "status": "published",
            "is_featured": True,
            "applications_count": 15,
            "views_count": 120,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "title": "Frontend Developer",
            "description": "Join our frontend team to build beautiful and responsive user interfaces. Experience with modern JavaScript frameworks is required.",
            "location": "New York, NY",
            "job_type": "full-time",
            "work_mode": "remote",
            "experience_level": "3-5",
            "salary_min": 80000,
            "salary_max": 120000,
            "salary_currency": "USD",
            "salary_period": "year",
            "required_skills": ["JavaScript", "React", "Vue.js", "CSS", "HTML"],
            "company_name": "WebSolutions",
            "employer_name": "WebSolutions",
            "status": "published",
            "is_featured": False,
            "applications_count": 8,
            "views_count": 85,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "title": "Data Scientist",
            "description": "We are seeking a Data Scientist to analyze complex data sets and develop machine learning models. Strong Python and statistics skills required.",
            "location": "Austin, TX",
            "job_type": "full-time",
            "work_mode": "onsite",
            "experience_level": "3-5",
            "salary_min": 90000,
            "salary_max": 140000,
            "salary_currency": "USD",
            "salary_period": "year",
            "required_skills": ["Python", "R", "Machine Learning", "Statistics", "SQL"],
            "company_name": "DataTech",
            "employer_name": "DataTech",
            "status": "published",
            "is_featured": True,
            "applications_count": 12,
            "views_count": 95,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "title": "DevOps Engineer",
            "description": "Join our DevOps team to manage cloud infrastructure and deployment pipelines. Experience with AWS and Docker required.",
            "location": "Seattle, WA",
            "job_type": "full-time",
            "work_mode": "hybrid",
            "experience_level": "3-5",
            "salary_min": 100000,
            "salary_max": 150000,
            "salary_currency": "USD",
            "salary_period": "year",
            "required_skills": ["AWS", "Docker", "Kubernetes", "Linux", "CI/CD"],
            "company_name": "CloudTech",
            "employer_name": "CloudTech",
            "status": "published",
            "is_featured": False,
            "applications_count": 6,
            "views_count": 70,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "title": "Product Manager",
            "description": "We are looking for a Product Manager to lead product development and work closely with engineering and design teams.",
            "location": "Boston, MA",
            "job_type": "full-time",
            "work_mode": "onsite",
            "experience_level": "5+",
            "salary_min": 110000,
            "salary_max": 160000,
            "salary_currency": "USD",
            "salary_period": "year",
            "required_skills": ["Product Management", "Agile", "User Research", "Analytics"],
            "company_name": "ProductHub",
            "employer_name": "ProductHub",
            "status": "published",
            "is_featured": True,
            "applications_count": 20,
            "views_count": 150,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "title": "UX/UI Designer",
            "description": "Join our design team to create beautiful and intuitive user experiences. Strong portfolio and design skills required.",
            "location": "Los Angeles, CA",
            "job_type": "full-time",
            "work_mode": "remote",
            "experience_level": "3-5",
            "salary_min": 70000,
            "salary_max": 110000,
            "salary_currency": "USD",
            "salary_period": "year",
            "required_skills": ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
            "company_name": "DesignStudio",
            "employer_name": "DesignStudio",
            "status": "published",
            "is_featured": False,
            "applications_count": 10,
            "views_count": 90,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "title": "Backend Developer",
            "description": "We need a Backend Developer to build scalable APIs and microservices. Experience with Node.js and databases required.",
            "location": "Chicago, IL",
            "job_type": "full-time",
            "work_mode": "hybrid",
            "experience_level": "2-3",
            "salary_min": 75000,
            "salary_max": 110000,
            "salary_currency": "USD",
            "salary_period": "year",
            "required_skills": ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs"],
            "company_name": "APITech",
            "employer_name": "APITech",
            "status": "published",
            "is_featured": False,
            "applications_count": 7,
            "views_count": 65,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "title": "Mobile App Developer",
            "description": "Join our mobile team to develop iOS and Android applications. Experience with React Native or Flutter preferred.",
            "location": "Miami, FL",
            "job_type": "full-time",
            "work_mode": "remote",
            "experience_level": "3-5",
            "salary_min": 80000,
            "salary_max": 120000,
            "salary_currency": "USD",
            "salary_period": "year",
            "required_skills": ["React Native", "Flutter", "iOS", "Android", "JavaScript"],
            "company_name": "MobileTech",
            "employer_name": "MobileTech",
            "status": "published",
            "is_featured": True,
            "applications_count": 14,
            "views_count": 110,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
    ]
    
    try:
        # Clear existing jobs (optional - comment out if you want to keep existing jobs)
        # await db.jobs.delete_many({})
        
        # Insert sample jobs
        result = await db.jobs.insert_many(sample_jobs)
        print(f"✅ Successfully created {len(result.inserted_ids)} sample jobs")
        
        # Print the created jobs
        for job_id in result.inserted_ids:
            job = await db.jobs.find_one({"_id": job_id})
            print(f"  - {job['title']} at {job['company_name']}")
            
    except Exception as e:
        print(f"❌ Error creating sample jobs: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(create_sample_jobs()) 
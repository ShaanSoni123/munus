#!/usr/bin/env python3
"""
SkillGlide Backend Setup Script
Automates the setup process for the SkillGlide backend
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path


def run_command(command, description):
    """Run a shell command and handle errors"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return None


def check_requirements():
    """Check if required software is installed"""
    print("🔍 Checking requirements...")
    
    requirements = {
        'python3': 'python3 --version',
        'pip': 'pip --version',
        'docker': 'docker --version',
        'docker-compose': 'docker-compose --version'
    }
    
    missing = []
    for name, command in requirements.items():
        if not run_command(command, f"Checking {name}"):
            missing.append(name)
    
    if missing:
        print(f"❌ Missing requirements: {', '.join(missing)}")
        print("Please install the missing requirements and try again.")
        return False
    
    print("✅ All requirements satisfied")
    return True


def setup_environment():
    """Setup environment file"""
    env_example = Path('.env.example')
    env_file = Path('.env')
    
    if not env_file.exists():
        if env_example.exists():
            shutil.copy(env_example, env_file)
            print("✅ Created .env file from .env.example")
            print("⚠️  Please update the .env file with your actual configuration")
        else:
            print("❌ .env.example file not found")
            return False
    else:
        print("✅ .env file already exists")
    
    return True


def setup_docker():
    """Setup and start Docker services"""
    print("\n🐳 Setting up Docker services...")
    
    # Build and start services
    if not run_command("docker-compose up -d --build", "Building and starting Docker services"):
        return False
    
    # Wait for services to be ready
    print("⏳ Waiting for services to be ready...")
    import time
    time.sleep(10)
    
    # Check if services are running
    if not run_command("docker-compose ps", "Checking service status"):
        return False
    
    return True


def setup_database():
    """Setup database and run migrations"""
    print("\n🗄️ Setting up database...")
    
    # Wait a bit more for PostgreSQL to be fully ready
    import time
    time.sleep(5)
    
    # Run database migrations
    if not run_command("docker-compose exec -T backend alembic upgrade head", "Running database migrations"):
        print("⚠️  Migration failed, trying to create initial migration...")
        run_command("docker-compose exec -T backend alembic revision --autogenerate -m 'Initial migration'", "Creating initial migration")
        run_command("docker-compose exec -T backend alembic upgrade head", "Running initial migration")
    
    return True


def create_sample_data():
    """Create sample data for testing"""
    print("\n📊 Creating sample data...")
    
    sample_data_script = """
import sys
sys.path.append('/app')

from app.db.database import SessionLocal
from app.models.user import User, UserRole
from app.models.company import Company
from app.models.job import Job, JobType, WorkMode, ExperienceLevel
from app.core.security import get_password_hash

db = SessionLocal()

# Create sample company
company = Company(
    name="TechCorp Solutions",
    description="Leading technology company focused on innovative solutions",
    industry="Technology",
    company_size="201-500",
    website="https://techcorp.com",
    email="hr@techcorp.com"
)
db.add(company)
db.commit()

# Create sample employer
employer = User(
    email="hr@techcorp.com",
    hashed_password=get_password_hash("employer123"),
    name="Sarah Wilson",
    role=UserRole.EMPLOYER,
    company_id=company.id,
    is_active=True,
    is_verified=True
)
db.add(employer)

# Create sample job seeker
jobseeker = User(
    email="john.doe@skillglide.com",
    hashed_password=get_password_hash("password123"),
    name="John Doe",
    role=UserRole.JOBSEEKER,
    phone="+91 98765 43210",
    location="Bangalore, India",
    experience_years=3,
    is_active=True,
    is_verified=True
)
db.add(jobseeker)
db.commit()

# Create sample job
job = Job(
    title="Senior Frontend Developer",
    description="We are looking for a skilled Frontend Developer to join our team...",
    requirements=["React", "TypeScript", "3+ years experience"],
    responsibilities=["Develop user interfaces", "Collaborate with team", "Code reviews"],
    benefits=["Health insurance", "Flexible hours", "Remote work"],
    skills=["React", "TypeScript", "JavaScript", "CSS"],
    job_type=JobType.FULL_TIME,
    work_mode=WorkMode.HYBRID,
    experience_level=ExperienceLevel.THREE_TO_FIVE,
    location="Bangalore, India",
    salary_min=80000,
    salary_max=120000,
    employer_id=employer.id,
    company_id=company.id,
    is_active=True
)
db.add(job)
db.commit()

print("Sample data created successfully!")
db.close()
"""
    
    # Write sample data script to temporary file
    with open('/tmp/create_sample_data.py', 'w') as f:
        f.write(sample_data_script)
    
    # Copy script to container and run it
    run_command("docker cp /tmp/create_sample_data.py skillglide_backend:/tmp/", "Copying sample data script")
    run_command("docker-compose exec -T backend python /tmp/create_sample_data.py", "Creating sample data")
    
    # Clean up
    os.remove('/tmp/create_sample_data.py')
    
    return True


def show_completion_info():
    """Show completion information"""
    print("\n" + "="*60)
    print("🎉 SkillGlide Backend Setup Complete!")
    print("="*60)
    print("\n📋 Service Information:")
    print("   • API Server: http://localhost:8000")
    print("   • API Documentation: http://localhost:8000/api/v1/docs")
    print("   • Database: localhost:5432")
    print("   • Redis: localhost:6379")
    
    print("\n🔑 Demo Accounts:")
    print("   Job Seeker:")
    print("     Email: john.doe@skillglide.com")
    print("     Password: password123")
    print("   Employer:")
    print("     Email: hr@techcorp.com")
    print("     Password: employer123")
    
    print("\n🛠️ Useful Commands:")
    print("   • View logs: docker-compose logs -f")
    print("   • Stop services: docker-compose down")
    print("   • Restart services: docker-compose restart")
    print("   • Access backend shell: docker-compose exec backend bash")
    print("   • Run migrations: docker-compose exec backend alembic upgrade head")
    
    print("\n📁 Important Files:")
    print("   • Environment config: .env")
    print("   • API documentation: http://localhost:8000/api/v1/docs")
    print("   • Database migrations: alembic/versions/")
    
    print("\n🔧 Next Steps:")
    print("   1. Update .env file with your actual configuration")
    print("   2. Test the API endpoints using the documentation")
    print("   3. Integrate with your frontend application")
    print("   4. Configure email settings for notifications")
    
    print("\n" + "="*60)


def main():
    """Main setup function"""
    print("🚀 SkillGlide Backend Setup")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not Path('requirements.txt').exists():
        print("❌ Please run this script from the backend directory")
        sys.exit(1)
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Setup environment
    if not setup_environment():
        sys.exit(1)
    
    # Setup Docker services
    if not setup_docker():
        sys.exit(1)
    
    # Setup database
    if not setup_database():
        print("⚠️  Database setup had issues, but continuing...")
    
    # Create sample data
    if not create_sample_data():
        print("⚠️  Sample data creation had issues, but continuing...")
    
    # Show completion info
    show_completion_info()


if __name__ == "__main__":
    main()
# SkillGlide Post-Launch Development Guide

## 🚀 Overview

This guide covers how to safely make changes to SkillGlide after it's been launched to production. Following these practices ensures minimal downtime and maintains system stability.

## 📋 Table of Contents

1. [Development Workflow](#development-workflow)
2. [Environment Setup](#environment-setup)
3. [Making Changes](#making-changes)
4. [Database Updates](#database-updates)
5. [Deployment Process](#deployment-process)
6. [Monitoring & Rollback](#monitoring--rollback)
7. [Best Practices](#best-practices)

## 🔄 Development Workflow

### 1. **Local Development Environment**

```bash
# Clone the repository
git clone <your-repo-url>
cd skillglide

# Install dependencies
npm install
cd backend && pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
cp backend/.env.example backend/.env

# Start development servers
npm run dev                    # Frontend (port 5173)
cd backend && python main.py  # Backend (port 8000)
```

### 2. **Branch Strategy**

```bash
# Create feature branch
git checkout -b feature/new-feature-name

# Make your changes
# ... development work ...

# Commit changes
git add .
git commit -m "feat: add new feature description"

# Push to remote
git push origin feature/new-feature-name

# Create Pull Request for review
```

## 🛠️ Making Changes

### **Frontend Changes**

#### **Adding New Components**
```typescript
// src/components/new-feature/NewComponent.tsx
import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const NewComponent: React.FC = () => {
  return (
    <Card>
      <h2>New Feature</h2>
      <Button variant="primary">Action</Button>
    </Card>
  );
};
```

#### **Updating Existing Components**
```typescript
// Always maintain backward compatibility
// Add new props as optional
interface ExistingComponentProps {
  existingProp: string;
  newProp?: string; // Optional to maintain compatibility
}
```

#### **Adding New Pages/Routes**
```typescript
// Update App.tsx to include new routes
const [currentView, setCurrentView] = useState<
  'home' | 'jobs' | 'resume' | 'profile' | 'new-feature' // Add new view
>('home');

// Add navigation handler
case 'new-feature':
  return <NewFeaturePage />;
```

### **Backend Changes**

#### **Adding New API Endpoints**
```python
# backend/app/api/v1/endpoints/new_feature.py
from fastapi import APIRouter, Depends
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/")
def get_new_feature_data(current_user = Depends(get_current_user)):
    """Get new feature data"""
    try:
        # Implementation
        return {"data": "success"}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
```

#### **Update API Router**
```python
# backend/app/api/__init__.py
from app.api.v1.endpoints import new_feature

api_router.include_router(
    new_feature.router, 
    prefix="/new-feature", 
    tags=["new-feature"]
)
```

## 🗄️ Database Updates

### **Creating Migrations**

```bash
# Navigate to backend directory
cd backend

# Create new migration
alembic revision --autogenerate -m "add new table for feature"

# Review the generated migration file
# backend/alembic/versions/xxxx_add_new_table_for_feature.py

# Apply migration to development
alembic upgrade head
```

### **Safe Migration Practices**

```python
# Example migration file
"""add new table for feature

Revision ID: 001
Revises: 000
Create Date: 2024-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    # Always use IF NOT EXISTS for safety
    op.execute("""
        CREATE TABLE IF NOT EXISTS new_feature_table (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            data JSONB,
            created_at TIMESTAMP DEFAULT NOW()
        )
    """)

def downgrade():
    # Provide rollback capability
    op.drop_table('new_feature_table')
```

## 🚀 Deployment Process

### **1. Testing Before Deployment**

```bash
# Run all tests
npm test                    # Frontend tests
cd backend && pytest       # Backend tests

# Check for linting issues
npm run lint
cd backend && flake8 .

# Build production version
npm run build
```

### **2. Staging Deployment**

```bash
# Deploy to staging environment first
git checkout staging
git merge feature/new-feature-name

# Deploy to staging server
# Test thoroughly in staging environment
```

### **3. Production Deployment**

```bash
# Merge to main branch
git checkout main
git merge staging

# Tag the release
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0

# Deploy to production
```

### **4. Database Migration in Production**

```bash
# Backup database first
pg_dump skillglide_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Apply migrations
cd backend
alembic upgrade head

# Verify migration success
alembic current
```

## 📊 Monitoring & Rollback

### **Health Checks**

```bash
# Check application health
curl https://your-domain.com/health

# Check API endpoints
curl https://your-domain.com/api/v1/jobs

# Monitor logs
tail -f /var/log/skillglide/app.log
```

### **Rollback Procedures**

#### **Code Rollback**
```bash
# Rollback to previous version
git checkout v1.0.0
# Redeploy previous version
```

#### **Database Rollback**
```bash
# Rollback migration
alembic downgrade -1

# Or restore from backup
psql skillglide_db < backup_20240101_120000.sql
```

## 🎯 Best Practices

### **1. Feature Flags**

```typescript
// Use feature flags for gradual rollouts
const FEATURE_FLAGS = {
  NEW_FEATURE_ENABLED: process.env.VITE_NEW_FEATURE_ENABLED === 'true'
};

// In component
{FEATURE_FLAGS.NEW_FEATURE_ENABLED && <NewFeature />}
```

### **2. Backward Compatibility**

```python
# Always maintain API backward compatibility
@router.get("/users/me", response_model=UserResponse)
def get_user_profile(current_user = Depends(get_current_user)):
    # Add new fields as optional
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        # New field (optional)
        "new_field": getattr(current_user, 'new_field', None)
    }
```

### **3. Error Handling**

```typescript
// Always add proper error handling for new features
const handleNewFeature = async () => {
  try {
    const result = await newFeatureService.performAction();
    setSuccess('Feature executed successfully');
  } catch (error) {
    console.error('New feature error:', error);
    setError('Failed to execute feature. Please try again.');
  }
};
```

### **4. Performance Monitoring**

```python
# Add performance monitoring to new endpoints
import time

@router.get("/new-endpoint")
def new_endpoint():
    start_time = time.time()
    try:
        # Your logic here
        result = perform_operation()
        
        # Log performance
        duration = time.time() - start_time
        print(f"New endpoint took {duration:.2f}s")
        
        return result
    except Exception as e:
        print(f"Error in new endpoint: {e}")
        raise
```

## 🔧 Common Change Scenarios

### **Adding a New Job Filter**

1. **Frontend**: Update `JobFilters` component
2. **Backend**: Update job search endpoint
3. **Database**: No changes needed (uses existing structure)
4. **Testing**: Test filter functionality

### **Adding User Profile Fields**

1. **Database**: Create migration to add new columns
2. **Backend**: Update user models and schemas
3. **Frontend**: Update profile forms and display
4. **Testing**: Test profile updates

### **Adding New Notification Types**

1. **Database**: Update notification enum/table
2. **Backend**: Add notification creation logic
3. **Frontend**: Update notification display
4. **Testing**: Test notification flow

## 📞 Emergency Procedures

### **Critical Bug Fix**

```bash
# Create hotfix branch
git checkout -b hotfix/critical-bug-fix

# Make minimal fix
# Test thoroughly
# Deploy immediately to production

# Merge back to main and staging
git checkout main
git merge hotfix/critical-bug-fix
```

### **Security Issue**

1. **Immediate**: Take affected feature offline if necessary
2. **Fix**: Implement security patch
3. **Test**: Verify fix resolves issue
4. **Deploy**: Emergency deployment
5. **Monitor**: Watch for any issues

## 📋 Deployment Checklist

- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Database migrations tested
- [ ] Staging deployment successful
- [ ] Performance impact assessed
- [ ] Rollback plan prepared
- [ ] Monitoring alerts configured
- [ ] Documentation updated
- [ ] Team notified of deployment

## 🎯 Conclusion

Following this guide ensures that SkillGlide remains stable and reliable while allowing for continuous improvement and feature additions. Always prioritize user experience and system stability when making changes.

Remember: **"Move fast, but don't break things!"**
# 🚀 Production Setup Guide for Y Combinator
# Munus - gomunuc.com

## ⚠️ CRITICAL: Complete These Steps Before Deployment

### 1. **Supabase Database Setup** (REQUIRED)
```bash
# Go to https://supabase.com
# Create new project: "munus-production"
# Get these credentials and update .env.production:

VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Database URLs (from Supabase dashboard)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres
ASYNC_DATABASE_URL=postgresql+asyncpg://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres
```

### 2. **Generate Secure Secret Keys** (REQUIRED)
```bash
# Generate a strong secret key (run this command):
openssl rand -hex 32

# Update in .env.production:
SECRET_KEY=your-generated-secret-key-here
```

### 3. **Domain Configuration** (REQUIRED)
```bash
# Update CORS origins in .env.production:
BACKEND_CORS_ORIGINS=["https://www.gomunuc.com","https://gomunuc.com","https://api.gomunuc.com"]

# Update API base URL:
VITE_API_BASE_URL=https://api.gomunuc.com
```

### 4. **Email Service Setup** (RECOMMENDED)
```bash
# Use Gmail or SendGrid
MAIL_USERNAME=noreply@gomunuc.com
MAIL_PASSWORD=your-app-specific-password
MAIL_FROM=noreply@gomunuc.com
```

### 5. **File Storage Setup** (RECOMMENDED)
```bash
# AWS S3 or Supabase Storage
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_BUCKET_NAME=munus-uploads
```

## 🚀 Deployment Platforms

### Frontend (Vercel - RECOMMENDED)
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod

# 3. Set environment variables in Vercel dashboard
```

### Backend (Railway - RECOMMENDED)
```bash
# 1. Go to railway.app
# 2. Connect your GitHub repo
# 3. Set environment variables
# 4. Deploy
```

## ✅ Pre-Deployment Checklist

- [ ] Supabase project created and configured
- [ ] Database URLs updated in .env.production
- [ ] Secret keys generated and updated
- [ ] CORS origins configured for gomunuc.com
- [ ] API base URL set to production domain
- [ ] Email service configured
- [ ] File storage configured
- [ ] Environment variables set in deployment platform
- [ ] SSL certificates configured
- [ ] Domain DNS configured

## 🔧 Quick Fix Commands

### Update Environment Variables
```bash
# Copy production config
cp .env.production .env

# Test configuration
npm run build
```

### Database Migration
```bash
# Run migrations on production database
cd backend
alembic upgrade head
```

## 🚨 Emergency Contacts

- **Supabase Support**: https://supabase.com/support
- **Vercel Support**: https://vercel.com/support
- **Railway Support**: https://railway.app/support

## 📞 Y Combinator Ready Checklist

- [ ] All features working in production
- [ ] Database properly configured
- [ ] Authentication working
- [ ] File uploads working
- [ ] Email notifications working
- [ ] Mobile responsive
- [ ] Performance optimized
- [ ] Security hardened
- [ ] Monitoring set up
- [ ] Backup strategy in place

---

**⚠️ IMPORTANT**: Do NOT deploy until all items above are completed! 
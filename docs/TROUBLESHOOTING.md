# SkillGlide Troubleshooting Guide

## 🐛 Common Issues & Solutions

### Frontend Issues

#### **1. Build Errors**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

#### **2. API Connection Issues**
```bash
# Check environment variables
cat .env

# Verify API is running
curl http://localhost:8000/health

# Check CORS settings in backend
```

#### **3. TypeScript Errors**
```bash
# Regenerate types
npm run type-check

# Clear TypeScript cache
rm -rf .tsbuildinfo
```

### Backend Issues

#### **1. Database Connection**
```bash
# Check database is running
pg_isready -h localhost -p 5432

# Test connection
psql -h localhost -U username -d skillglide_db

# Check environment variables
cat backend/.env
```

#### **2. Migration Issues**
```bash
# Check current migration
cd backend
alembic current

# Reset migrations (CAUTION: Development only)
alembic downgrade base
alembic upgrade head
```

#### **3. Import Errors**
```bash
# Reinstall dependencies
cd backend
pip install -r requirements.txt

# Check Python path
python -c "import sys; print(sys.path)"
```

### Production Issues

#### **1. 500 Internal Server Error**
```bash
# Check application logs
tail -f /var/log/skillglide/app.log

# Check database connectivity
psql $DATABASE_URL

# Verify environment variables
env | grep SKILLGLIDE
```

#### **2. Database Performance**
```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check database connections
SELECT count(*) FROM pg_stat_activity;
```

#### **3. Memory Issues**
```bash
# Check memory usage
free -h
ps aux | grep python

# Check for memory leaks
top -p $(pgrep -f "python main.py")
```

## 🔧 Debug Mode

### Enable Debug Logging
```python
# backend/app/main.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Frontend Debug Mode
```typescript
// Add to .env
VITE_DEBUG=true

// In code
if (import.meta.env.VITE_DEBUG) {
  console.log('Debug info:', data);
}
```

## 📞 Getting Help

1. Check logs first
2. Verify environment variables
3. Test individual components
4. Check network connectivity
5. Review recent changes

## 🚨 Emergency Contacts

- **System Admin**: admin@skillglide.com
- **Database Issues**: db-admin@skillglide.com
- **Security Issues**: security@skillglide.com
# SkillGlide Development Environment Setup

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL 15+
- Git

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd skillglide
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your settings
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Update .env with your database settings
DATABASE_URL=postgresql://username:password@localhost:5432/skillglide_db
```

### 4. Database Setup
```bash
# Create database
createdb skillglide_db

# Run migrations
cd backend
alembic upgrade head
```

### 5. Start Development Servers
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend
python main.py
```

## 🔧 Development Tools

### Code Quality
```bash
# Frontend linting
npm run lint

# Backend linting
cd backend
flake8 .
black .
```

### Testing
```bash
# Frontend tests
npm test

# Backend tests
cd backend
pytest
```

## 📁 Project Structure

```
skillglide/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── services/          # API services
│   └── types/             # TypeScript types
├── backend/               # Backend source
│   ├── app/              # FastAPI application
│   ├── alembic/          # Database migrations
│   └── tests/            # Backend tests
└── docs/                 # Documentation
```

## 🌐 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_ENVIRONMENT=development
```

### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/skillglide_db
SECRET_KEY=your-secret-key
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## 🚀 Ready to Develop!

Your development environment is now ready. You can start making changes and see them reflected immediately in your local environment.
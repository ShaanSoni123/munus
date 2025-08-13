#!/bin/bash

# Start Backend Script for Local Development
echo "🚀 Starting Munus Backend Server locally..."

# Set environment variables
export ENVIRONMENT=development
export DEBUG=True
export MONGODB_URI="mongodb+srv://shaansoni21:L7H0k0nER4DjEM1D@munusdb.f8c3gzf.mongodb.net/?retryWrites=true&w=majority&appName=Munusdb"
export MONGODB_DB_NAME=jobify
export OPENAI_API_KEY="your-openai-api-key-here"
export PYTHONPATH="${PYTHONPATH}:$(pwd)/backend"

# Change to backend directory
cd backend

# Check if dependencies are installed
if [ ! -d "venv" ]; then
    echo "📦 Installing dependencies..."
    pip3 install -r requirements.txt
fi

# Start the server
echo "🌟 Starting FastAPI server on http://localhost:8000"
echo "📊 Health check available at: http://localhost:8000/health"
echo "📚 API docs available at: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start with uvicorn for better development experience
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

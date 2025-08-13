#!/bin/bash

# Start Frontend Script for Local Development
echo "🎨 Starting Munus Frontend with local backend connection..."

# Set environment variables for local development
export VITE_API_BASE_URL=http://localhost:8000
export VITE_ENVIRONMENT=development
export VITE_DEBUG=true

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start the development server
echo "🌟 Starting Vite development server..."
echo "🌐 Frontend will be available at: http://localhost:5174"
echo "🔗 Backend API: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev

#!/usr/bin/env python3
"""
Production startup script for Munus backend
Optimized for Render deployment
"""

import uvicorn
import os
from app.main import app

if __name__ == "__main__":
    # Get port from environment variable (Render sets this)
    port = int(os.environ.get("PORT", 8000))
    
    # Get host from environment variable
    host = os.environ.get("HOST", "0.0.0.0")
    
    # Production settings
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=False,  # Disable reload in production
        workers=1,     # Single worker for free tier
        log_level="info"
    ) 
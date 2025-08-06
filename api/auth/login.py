from http.server import BaseHTTPRequestHandler
import json
import os
import bcrypt
from datetime import datetime
from pymongo import MongoClient
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB Configuration
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "munus")

def get_db():
    """Get MongoDB database connection"""
    try:
        client = MongoClient(MONGODB_URI)
        db = client[MONGODB_DB_NAME]
        return db
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return None

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Get request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            user_data = json.loads(post_data.decode('utf-8'))
            
            logger.info(f"Login attempt for email: {user_data.get('email')}")
            
            # Get database connection
            db = get_db()
            if not db:
                self.send_error_response(500, "Database connection failed")
                return
            
            # Find user by email
            user = db.users.find_one({"email": user_data["email"]})
            if not user:
                self.send_error_response(401, "Incorrect email or password")
                return
            
            # Verify password
            if not bcrypt.checkpw(user_data["password"].encode("utf-8"), user["password"].encode("utf-8")):
                self.send_error_response(401, "Incorrect email or password")
                return
            
            # Check if user is active
            if not user.get("is_active", True):
                self.send_error_response(401, "Account is deactivated")
                return
            
            # Remove password from response and convert ObjectId to string
            user_response = user.copy()
            user_response.pop("password", None)
            user_response["_id"] = str(user_response["_id"])
            
            # Create simple access token (in production, use JWT)
            access_token = f"token_{user_response['_id']}_{datetime.utcnow().timestamp()}"
            
            # Update last active
            db.users.update_one(
                {"_id": user["_id"]},
                {"$set": {"last_active": datetime.utcnow()}}
            )
            
            response_data = {
                "user": user_response,
                "access_token": access_token,
                "message": "Login successful"
            }
            
            self.send_success_response(response_data)
            
        except Exception as e:
            logger.error(f"Login error: {e}")
            self.send_error_response(500, f"Login failed: {str(e)}")
    
    def send_success_response(self, data):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps({"detail": message}).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers() 
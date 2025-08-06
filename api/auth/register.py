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
            
            logger.info(f"Registration attempt for email: {user_data.get('email')}")
            
            # Get database connection
            db = get_db()
            if not db:
                self.send_error_response(500, "Database connection failed")
                return
            
            # Check if user already exists
            existing_user = db.users.find_one({"email": user_data["email"]})
            if existing_user:
                self.send_error_response(400, "Email already registered")
                return
            
            # Hash password
            hashed_password = bcrypt.hashpw(user_data["password"].encode("utf-8"), bcrypt.gensalt())
            
            # Prepare user document
            user_doc = {
                "email": user_data["email"],
                "name": user_data.get("name"),
                "role": user_data.get("role", "jobseeker"),
                "password": hashed_password.decode("utf-8"),
                "phone": user_data.get("phone"),
                "location": user_data.get("location"),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "last_active": datetime.utcnow(),
                "is_active": True,
                "is_verified": False,
                "email_verified": False,
            }
            
            # Add employer-specific fields
            if user_data.get("role") == "employer":
                user_doc["company"] = user_data.get("company")
                user_doc["company_size"] = user_data.get("company_size")
                user_doc["industry"] = user_data.get("industry")
            
            # Insert user
            result = db.users.insert_one(user_doc)
            
            # Remove password from response
            user_response = user_doc.copy()
            user_response.pop("password", None)
            user_response["_id"] = str(result.inserted_id)
            
            # Create simple access token (in production, use JWT)
            access_token = f"token_{result.inserted_id}_{datetime.utcnow().timestamp()}"
            
            response_data = {
                "user": user_response,
                "access_token": access_token,
                "message": "User registered successfully"
            }
            
            self.send_success_response(response_data)
            
        except Exception as e:
            logger.error(f"Registration error: {e}")
            self.send_error_response(500, f"Registration failed: {str(e)}")
    
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
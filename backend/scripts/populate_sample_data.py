import requests

API_URL = "http://127.0.0.1:8000/api"

# 1. Register a user
user_data = {
    "email": "sampleuser@example.com",
    "password": "samplepass123",
    "firstName": "Sample",
    "lastName": "User",
    "role": "jobseeker"
}
print("Registering user...")
r = requests.post(f"{API_URL}/auth/register", json=user_data)
print("Register response:", r.status_code, r.json())
access_token = r.json().get("access_token")
headers = {"Authorization": f"Bearer {access_token}"}

# 2. Add a company (if endpoint exists)
company_data = {
    "name": "Sample Company",
    "industry": "Technology",
    "size": "51-200",
    "description": "A sample tech company."
}
print("Adding company...")
r = requests.post(f"{API_URL}/companies/", json=company_data, headers=headers)
print("Company response:", r.status_code, r.text)

# 3. Add a job (if endpoint exists)
job_data = {
    "title": "Sample Software Engineer",
    "description": "Develop and maintain software.",
    "location": "Remote",
    "salary": 100000,
    "required_skills": ["python", "fastapi"],
    "company_id": 1,
    "is_active": True
}
print("Adding job...")
r = requests.post(f"{API_URL}/jobs/", json=job_data, headers=headers)
print("Job response:", r.status_code, r.text)

# 4. Add a resume (if endpoint exists)
resume_data = {
    "title": "Sample Resume",
    "summary": "Experienced developer.",
    "skills": ["python", "fastapi"],
    "experience": [
        {"company": "Sample Company", "role": "Developer", "years": 2}
    ]
}
print("Adding resume...")
r = requests.post(f"{API_URL}/resumes/", json=resume_data, headers=headers)
print("Resume response:", r.status_code, r.text) 
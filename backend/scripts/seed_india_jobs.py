import asyncio
import os
from datetime import datetime, timedelta
from random import randint, choice
from motor.motor_asyncio import AsyncIOMotorClient


# MongoDB configuration (falls back to local if env not set)
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "jobify")


CITIES = [
    {"name": "Surat", "state": "Gujarat"},
    {"name": "Mumbai", "state": "Maharashtra"},
    {"name": "Delhi", "state": "Delhi"},
]

LOW_SKILL_ROLES = [
    ("Delivery Boy", ["Driving", "Maps Navigation", "Customer Handling"], "on_site"),
    ("Office Peon", ["Filing", "Cleaning", "Basic Errands"], "on_site"),
    ("Shop Helper", ["Stocking", "Billing Support", "Cleaning"], "on_site"),
    ("Security Guard", ["Patrolling", "Visitor Entry", "CCTV Monitoring"], "on_site"),
    ("Housekeeping Staff", ["Cleaning", "Dusting", "Mopping"], "on_site"),
    ("Receptionist", ["Front Desk", "Phone Handling", "Basic Computer"], "on_site"),
    ("Warehouse Helper", ["Loading", "Unloading", "Inventory"], "on_site"),
    ("Cook", ["Veg Cooking", "Hygiene", "Kitchen Management"], "on_site"),
    ("Driver", ["LMV Driving", "Route Knowledge", "Vehicle Care"], "on_site"),
    ("Electrician Helper", ["Wiring", "Tools Handling", "Safety"], "on_site"),
]

IT_JUNIOR_ROLES = [
    ("Junior Web Developer", ["HTML", "CSS", "JavaScript"], "hybrid"),
    ("IT Support Engineer", ["Windows", "Networking", "Troubleshooting"], "on_site"),
    ("QA Tester", ["Manual Testing", "Bug Reporting"], "hybrid"),
    ("Helpdesk Associate", ["Ticketing", "Customer Support"], "on_site"),
    ("Junior Python Developer", ["Python", "APIs"], "hybrid"),
]


def inr(min_lakh: float, max_lakh: float) -> tuple[int, int]:
    """Return salary min/max in INR given lakh ranges."""
    base = 100_000
    mn = int(min_lakh * base)
    mx = int(max_lakh * base)
    if mn > mx:
        mn, mx = mx, mn
    return mn, mx


def generate_jobs() -> list[dict]:
    """Generate ~60 published Indian local jobs across Surat/Mumbai/Delhi."""
    jobs: list[dict] = []

    # create 15 low-skill + 5 IT per city = 20 per city x 3 = 60
    for city in CITIES:
        city_label = f"{city['name']}, {city['state']}"

        # Low-skill jobs (15)
        for idx in range(15):
            title, skills, work_mode = choice(LOW_SKILL_ROLES)
            s_min, s_max = inr(1.2, 3.0)  # 1.2L to 3.0L
            company = choice([
                "Local Services", "City Mart", "SecureGuard", "QuickShip",
                "Urban Helpers", "Metro Hospitality", "FreshFoods"
            ])

            jobs.append({
                "title": f"{title}",
                "description": f"Hiring {title.lower()} for our {city['name']} location. Immediate joining preferred.",
                "location": city_label,
                "job_type": "full-time",
                "work_mode": work_mode,
                "experience_level": "0-2",
                "salary_min": s_min,
                "salary_max": s_max,
                "salary_currency": "INR",
                "required_skills": skills,
                "company_name": company,
                "employer_name": company,
                "status": "published",
                "is_featured": False,
                "applications_count": 0,
                "views_count": 0,
                "created_at": datetime.utcnow() - timedelta(days=randint(0, 20)),
                "updated_at": datetime.utcnow(),
                "published_at": datetime.utcnow() - timedelta(days=randint(0, 10)),
            })

        # Junior IT jobs (5)
        for idx in range(5):
            title, skills, work_mode = choice(IT_JUNIOR_ROLES)
            s_min, s_max = inr(2.4, 6.0)  # 2.4L to 6.0L
            company = choice([
                "City Tech Labs", "Metro IT Solutions", "Digital Works", "Innovate Hub"
            ])

            jobs.append({
                "title": title,
                "description": f"Looking for {title.lower()} to join our team in {city['name']}.",
                "location": city_label,
                "job_type": "full-time",
                "work_mode": work_mode,
                "experience_level": "0-3",
                "salary_min": s_min,
                "salary_max": s_max,
                "salary_currency": "INR",
                "required_skills": skills,
                "company_name": company,
                "employer_name": company,
                "status": "published",
                "is_featured": False,
                "applications_count": 0,
                "views_count": 0,
                "created_at": datetime.utcnow() - timedelta(days=randint(0, 20)),
                "updated_at": datetime.utcnow(),
                "published_at": datetime.utcnow() - timedelta(days=randint(0, 10)),
            })

    return jobs


async def seed_jobs() -> None:
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[MONGODB_DB_NAME]
    try:
        jobs = generate_jobs()

        # Ensure index on created_at for sorting and text search for title/description
        try:
            await db.jobs.create_index([("created_at", -1)])
            await db.jobs.create_index([("title", "text"), ("description", "text")])
        except Exception:
            pass

        # Insert only if not already seeded (check a marker doc)
        marker = await db.jobs.find_one({"_seed": "india-local-1"})
        if marker:
            print("Seed already applied: india-local-1")
            return

        for job in jobs:
            job["_seed"] = "india-local-1"

        result = await db.jobs.insert_many(jobs)
        print(f"✅ Inserted {len(result.inserted_ids)} Indian local jobs (10-per-page ready)")
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(seed_jobs())



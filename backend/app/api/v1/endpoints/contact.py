from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter()

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str

@router.post('/contact')
async def submit_contact(form: ContactForm):
    # Here you could store in DB or send an email
    print(f"Contact message from {form.name} <{form.email}>: {form.message}")
    return {"success": True, "message": "Your message has been received!"} 
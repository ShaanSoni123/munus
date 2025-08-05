from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import httpx
import os
from ..deps import get_current_user
from app.schemas.mongodb_schemas import MongoDBUser as User

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    response: str
    error: Optional[str] = None

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        # Get OpenAI API key from environment
        api_key = os.getenv("VITE_OPENAI_API_KEY") or os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        # Prepare the request to OpenAI
        openai_url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        
        payload = {
            "model": os.getenv("VITE_OPENAI_MODEL", "gpt-3.5-turbo"),
            "messages": [
                {
                    "role": "system",
                    "content": "You are Opusnex AI, a helpful and friendly career assistant for job seekers. You help users with resume building, interview preparation, job search strategies, salary negotiation, application guidance, and general career advice. Always introduce yourself as 'Opusnex AI' and be encouraging, professional, and supportive. Keep responses concise but helpful."
                }
            ] + [{"role": msg.role, "content": msg.content} for msg in request.messages],
            "max_tokens": 500,
            "temperature": 0.7
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(openai_url, headers=headers, json=payload, timeout=30.0)
            
            if response.status_code != 200:
                error_detail = response.json() if response.content else "OpenAI API error"
                raise HTTPException(status_code=response.status_code, detail=f"OpenAI API error: {error_detail}")
            
            data = response.json()
            ai_response = data.get("choices", [{}])[0].get("message", {}).get("content", "Sorry, I could not generate a response.")
            
            return ChatResponse(response=ai_response)
            
    except httpx.TimeoutException:
        raise HTTPException(status_code=408, detail="Request timeout")
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}") 
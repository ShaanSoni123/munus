import openai
from app.core.config import settings

openai.api_key = settings.OPENAI_API_KEY
# Embedding function
def get_embedding(text: str, model: str = "text-embedding-3-small"):
    response = openai.embeddings.create(
        input=text,
        model=model
    )
    return response.data[0].embedding

# GPT-4 completion function
def gpt4_completion(prompt: str, model: str = "gpt-4o"):
    response = openai.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=512
    )
    return response.choices[0].message.content 
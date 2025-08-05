from sentence_transformers import SentenceTransformer, util
import numpy as np
from app.services import openai_service
from app.core.config import settings

# Load a pre-trained model (can be replaced with a more advanced one)
model = SentenceTransformer('all-MiniLM-L6-v2')

# Simple in-memory feedback store (for demo purposes)
feedback_store = []

def get_embedding(text: str) -> np.ndarray:
    """Get the embedding for a given text."""
    return model.encode(text, convert_to_numpy=True)


def match_score(resume_text: str, job_text: str) -> float:
    """Compute a similarity score between a resume and a job description."""
    emb_resume = get_embedding(resume_text)
    emb_job = get_embedding(job_text)
    score = float(util.cos_sim(emb_resume, emb_job)[0][0])
    return score


def batch_match_scores(resume_texts: list, job_texts: list) -> np.ndarray:
    """Compute a matrix of similarity scores for batches of resumes and jobs."""
    emb_resumes = model.encode(resume_texts, convert_to_numpy=True)
    emb_jobs = model.encode(job_texts, convert_to_numpy=True)
    scores = util.cos_sim(emb_resumes, emb_jobs)
    return scores.numpy()


def add_feedback(resume_id: int, job_id: int, score: float, feedback: int):
    """Store user feedback for a match (1=good, 0=bad)."""
    feedback_store.append({
        'resume_id': resume_id,
        'job_id': job_id,
        'score': score,
        'feedback': feedback
    })
    return True


def openai_match_score(resume_text: str, job_text: str) -> float:
    if not settings.OPENAI_API_KEY:
        return match_score(resume_text, job_text)
    emb_resume = openai_service.get_embedding(resume_text)
    emb_job = openai_service.get_embedding(job_text)
    # Cosine similarity
    score = float(np.dot(emb_resume, emb_job) / (np.linalg.norm(emb_resume) * np.linalg.norm(emb_job)))
    return score 
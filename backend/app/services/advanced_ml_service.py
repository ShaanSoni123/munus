import numpy as np
import pandas as pd
from typing import List, Dict, Tuple, Optional, Any
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.cluster import KMeans, DBSCAN
from sklearn.decomposition import PCA, LatentDirichletAllocation
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier, MLPRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
import joblib
import pickle
import json
from datetime import datetime, timedelta
import re
from collections import Counter
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import WordNetLemmatizer, PorterStemmer
from nltk.sentiment import SentimentIntensityAnalyzer
import spacy
from textblob import TextBlob
import warnings
warnings.filterwarnings('ignore')

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')
try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')
try:
    nltk.data.find('sentiment/vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon')

class AdvancedMLService:
    def __init__(self):
        self.models = {}
        self.vectorizers = {}
        self.scalers = {}
        self.encoders = {}
        self.nlp = None
        self.lemmatizer = WordNetLemmatizer()
        self.stemmer = PorterStemmer()
        self.sentiment_analyzer = SentimentIntensityAnalyzer()
        self.stop_words = set(stopwords.words('english'))
        
        # Try to load spaCy model
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("spaCy model not found. Install with: python -m spacy download en_core_web_sm")
        
        # Initialize models
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize all ML models"""
        # Text vectorizers
        self.vectorizers['tfidf'] = TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 3),
            stop_words='english',
            min_df=2,
            max_df=0.95
        )
        
        self.vectorizers['count'] = CountVectorizer(
            max_features=3000,
            ngram_range=(1, 2),
            stop_words='english'
        )
        
        # Classification models
        self.models['random_forest'] = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        
        self.models['gradient_boosting'] = GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        
        self.models['svm'] = SVC(
            kernel='rbf',
            probability=True,
            random_state=42
        )
        
        self.models['neural_network'] = MLPClassifier(
            hidden_layer_sizes=(100, 50),
            max_iter=500,
            random_state=42
        )
        
        # Regression models
        self.models['linear_regression'] = LinearRegression()
        self.models['neural_regression'] = MLPRegressor(
            hidden_layer_sizes=(100, 50),
            max_iter=500,
            random_state=42
        )
        
        # Ensemble model
        self.models['ensemble'] = VotingClassifier(
            estimators=[
                ('rf', self.models['random_forest']),
                ('gb', self.models['gradient_boosting']),
                ('svm', self.models['svm'])
            ],
            voting='soft'
        )
        
        # Clustering models
        self.models['kmeans'] = KMeans(n_clusters=10, random_state=42)
        self.models['dbscan'] = DBSCAN(eps=0.5, min_samples=5)
        
        # Topic modeling
        self.models['lda'] = LatentDirichletAllocation(
            n_components=10,
            random_state=42
        )
        
        # Scaler
        self.scalers['standard'] = StandardScaler()
    
    def preprocess_text(self, text: str) -> str:
        """Advanced text preprocessing"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters but keep important ones
        text = re.sub(r'[^a-zA-Z0-9\s\.\,\!\?\-\_]', ' ', text)
        
        # Tokenize
        tokens = word_tokenize(text)
        
        # Remove stopwords and lemmatize
        tokens = [self.lemmatizer.lemmatize(token) for token in tokens 
                 if token not in self.stop_words and len(token) > 2]
        
        return ' '.join(tokens)
    
    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from text using NLP and pattern matching"""
        skills = []
        
        # Common technical skills
        technical_skills = [
            'python', 'java', 'javascript', 'react', 'angular', 'vue', 'node.js',
            'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'docker', 'kubernetes',
            'aws', 'azure', 'gcp', 'machine learning', 'ai', 'deep learning',
            'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'matplotlib',
            'git', 'jenkins', 'ci/cd', 'rest api', 'graphql', 'microservices',
            'agile', 'scrum', 'kanban', 'jira', 'confluence', 'figma', 'sketch'
        ]
        
        # Extract skills using pattern matching
        text_lower = text.lower()
        for skill in technical_skills:
            if skill in text_lower:
                skills.append(skill)
        
        # Use spaCy for named entity recognition
        if self.nlp:
            doc = self.nlp(text)
            for ent in doc.ents:
                if ent.label_ in ['ORG', 'PRODUCT', 'GPE']:
                    skills.append(ent.text.lower())
        
        return list(set(skills))
    
    def analyze_sentiment(self, text: str) -> Dict[str, float]:
        """Analyze sentiment of text"""
        blob = TextBlob(text)
        vader_scores = self.sentiment_analyzer.polarity_scores(text)
        
        return {
            'textblob_polarity': blob.sentiment.polarity,
            'textblob_subjectivity': blob.sentiment.subjectivity,
            'vader_compound': vader_scores['compound'],
            'vader_positive': vader_scores['pos'],
            'vader_negative': vader_scores['neg'],
            'vader_neutral': vader_scores['neu']
        }
    
    def extract_features(self, text: str) -> Dict[str, Any]:
        """Extract comprehensive features from text"""
        features = {}
        
        # Basic text features
        features['word_count'] = len(text.split())
        features['char_count'] = len(text)
        features['sentence_count'] = len(sent_tokenize(text))
        features['avg_word_length'] = np.mean([len(word) for word in text.split()]) if text.split() else 0
        
        # Sentiment features
        sentiment = self.analyze_sentiment(text)
        features.update(sentiment)
        
        # Skills
        features['skills'] = self.extract_skills(text)
        features['skill_count'] = len(features['skills'])
        
        # Readability scores
        features['flesch_reading_ease'] = self._calculate_flesch_reading_ease(text)
        
        return features
    
    def _calculate_flesch_reading_ease(self, text: str) -> float:
        """Calculate Flesch Reading Ease score"""
        sentences = sent_tokenize(text)
        words = word_tokenize(text)
        syllables = sum(self._count_syllables(word) for word in words)
        
        if len(sentences) == 0 or len(words) == 0:
            return 0
        
        return 206.835 - 1.015 * (len(words) / len(sentences)) - 84.6 * (syllables / len(words))
    
    def _count_syllables(self, word: str) -> int:
        """Count syllables in a word"""
        word = word.lower()
        count = 0
        vowels = "aeiouy"
        on_vowel = False
        
        for char in word:
            is_vowel = char in vowels
            if is_vowel and not on_vowel:
                count += 1
            on_vowel = is_vowel
        
        if word.endswith('e'):
            count -= 1
        if count == 0:
            count = 1
        return count
    
    def advanced_job_matching(self, resume_text: str, job_text: str) -> Dict[str, float]:
        """Advanced job matching with multiple algorithms"""
        results = {}
        
        # Preprocess texts
        resume_processed = self.preprocess_text(resume_text)
        job_processed = self.preprocess_text(job_text)
        
        # TF-IDF similarity
        tfidf_matrix = self.vectorizers['tfidf'].fit_transform([resume_processed, job_processed])
        results['tfidf_similarity'] = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
        
        # Count vectorizer similarity
        count_matrix = self.vectorizers['count'].fit_transform([resume_processed, job_processed])
        results['count_similarity'] = float(cosine_similarity(count_matrix[0:1], count_matrix[1:2])[0][0])
        
        # Skills matching
        resume_skills = set(self.extract_skills(resume_text))
        job_skills = set(self.extract_skills(job_text))
        
        if job_skills:
            skill_overlap = len(resume_skills.intersection(job_skills))
            results['skill_match_ratio'] = skill_overlap / len(job_skills)
        else:
            results['skill_match_ratio'] = 0.0
        
        # Sentiment compatibility
        resume_sentiment = self.analyze_sentiment(resume_text)
        job_sentiment = self.analyze_sentiment(job_text)
        results['sentiment_compatibility'] = 1 - abs(resume_sentiment['vader_compound'] - job_sentiment['vader_compound']) / 2
        
        # Weighted ensemble score
        weights = {
            'tfidf_similarity': 0.3,
            'count_similarity': 0.2,
            'skill_match_ratio': 0.4,
            'sentiment_compatibility': 0.1
        }
        
        results['ensemble_score'] = sum(results[key] * weights[key] for key in weights.keys())
        
        return results
    
    def recommend_jobs(self, user_profile: Dict[str, Any], available_jobs: List[Dict[str, Any]], 
                      top_k: int = 10) -> List[Dict[str, Any]]:
        """Recommend jobs based on user profile"""
        recommendations = []
        
        for job in available_jobs:
            # Calculate multiple similarity scores
            matching_scores = self.advanced_job_matching(
                user_profile.get('resume_text', ''),
                job.get('description', '')
            )
            
            # Additional factors
            experience_match = self._calculate_experience_match(
                user_profile.get('experience_years', 0),
                job.get('required_experience', 0)
            )
            
            location_match = self._calculate_location_match(
                user_profile.get('location', ''),
                job.get('location', '')
            )
            
            # Weighted score
            final_score = (
                matching_scores['ensemble_score'] * 0.5 +
                experience_match * 0.3 +
                location_match * 0.2
            )
            
            recommendations.append({
                'job_id': job.get('id'),
                'job_title': job.get('title'),
                'company': job.get('company'),
                'score': final_score,
                'matching_details': matching_scores
            })
        
        # Sort by score and return top_k
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:top_k]
    
    def recommend_candidates(self, job_description: str, candidates: List[Dict[str, Any]], 
                           top_k: int = 10) -> List[Dict[str, Any]]:
        """Recommend candidates for a job"""
        recommendations = []
        
        for candidate in candidates:
            matching_scores = self.advanced_job_matching(
                candidate.get('resume_text', ''),
                job_description
            )
            
            # Additional candidate factors
            experience_bonus = min(candidate.get('experience_years', 0) / 10, 0.2)
            education_bonus = self._calculate_education_bonus(candidate.get('education_level', ''))
            
            final_score = (
                matching_scores['ensemble_score'] * 0.6 +
                experience_bonus * 0.2 +
                education_bonus * 0.2
            )
            
            recommendations.append({
                'candidate_id': candidate.get('id'),
                'candidate_name': candidate.get('name'),
                'score': final_score,
                'matching_details': matching_scores
            })
        
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:top_k]
    
    def predict_salary(self, job_features: Dict[str, Any]) -> Dict[str, float]:
        """Predict salary range for a job"""
        # This would typically use a trained model
        # For now, using a simple heuristic
        base_salary = 50000
        
        # Experience multiplier
        experience_multiplier = 1 + (job_features.get('experience_years', 0) * 0.1)
        
        # Skills multiplier
        skill_bonus = len(job_features.get('required_skills', [])) * 2000
        
        # Location multiplier
        location_multiplier = self._get_location_multiplier(job_features.get('location', ''))
        
        predicted_salary = (base_salary * experience_multiplier + skill_bonus) * location_multiplier
        
        return {
            'predicted_salary': predicted_salary,
            'salary_range_low': predicted_salary * 0.8,
            'salary_range_high': predicted_salary * 1.2
        }
    
    def analyze_job_market(self, jobs_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze job market trends"""
        if not jobs_data:
            return {}
        
        df = pd.DataFrame(jobs_data)
        
        # Use direct column access with fallback to Series if column is missing
        salary_col = df['salary'] if 'salary' in df.columns else pd.Series([0])
        location_col = df['location'] if 'location' in df.columns else pd.Series([''])
        experience_col = df['experience_years'] if 'experience_years' in df.columns else pd.Series([0])
        company_col = df['company'] if 'company' in df.columns else pd.Series([''])
        
        analysis = {
            'total_jobs': len(jobs_data),
            'avg_salary': salary_col.mean(),
            'salary_distribution': salary_col.describe().to_dict(),
            'top_skills': self._get_top_skills(jobs_data),
            'top_locations': location_col.value_counts().head(10).to_dict(),
            'experience_distribution': experience_col.value_counts().to_dict(),
            'company_distribution': company_col.value_counts().head(10).to_dict()
        }
        
        return analysis
    
    def _calculate_experience_match(self, user_exp: int, required_exp: int) -> float:
        """Calculate experience match score"""
        if user_exp >= required_exp:
            return 1.0
        elif user_exp >= required_exp * 0.7:
            return 0.8
        elif user_exp >= required_exp * 0.5:
            return 0.6
        else:
            return 0.3
    
    def _calculate_location_match(self, user_location: str, job_location: str) -> float:
        """Calculate location match score"""
        if not user_location or not job_location:
            return 0.5
        
        user_loc_lower = user_location.lower()
        job_loc_lower = job_location.lower()
        
        if user_loc_lower == job_loc_lower:
            return 1.0
        elif user_loc_lower in job_loc_lower or job_loc_lower in user_loc_lower:
            return 0.8
        else:
            return 0.3
    
    def _calculate_education_bonus(self, education_level: str) -> float:
        """Calculate education bonus"""
        education_bonuses = {
            'phd': 0.2,
            'masters': 0.15,
            'bachelors': 0.1,
            'associate': 0.05,
            'high school': 0.0
        }
        return education_bonuses.get(education_level.lower(), 0.0)
    
    def _get_location_multiplier(self, location: str) -> float:
        """Get salary multiplier based on location"""
        high_cost_locations = ['new york', 'san francisco', 'los angeles', 'seattle', 'boston']
        medium_cost_locations = ['chicago', 'denver', 'austin', 'atlanta', 'dallas']
        
        location_lower = location.lower()
        
        if any(loc in location_lower for loc in high_cost_locations):
            return 1.3
        elif any(loc in location_lower for loc in medium_cost_locations):
            return 1.1
        else:
            return 1.0
    
    def _get_top_skills(self, jobs_data: List[Dict[str, Any]]) -> List[str]:
        """Get top skills from job data"""
        all_skills = []
        for job in jobs_data:
            skills = job.get('required_skills', [])
            if isinstance(skills, str):
                skills = skills.split(',')
            all_skills.extend(skills)
        
        skill_counts = Counter(all_skills)
        return [skill for skill, count in skill_counts.most_common(20)]
    
    def save_models(self, filepath: str):
        """Save trained models"""
        model_data = {
            'models': self.models,
            'vectorizers': self.vectorizers,
            'scalers': self.scalers,
            'encoders': self.encoders
        }
        with open(filepath, 'wb') as f:
            pickle.dump(model_data, f)
    
    def load_models(self, filepath: str):
        """Load trained models"""
        with open(filepath, 'rb') as f:
            model_data = pickle.load(f)
        
        self.models = model_data['models']
        self.vectorizers = model_data['vectorizers']
        self.scalers = model_data['scalers']
        self.encoders = model_data['encoders']

    def get_live_suggestions(
        self,
        query: str,
        candidates: Optional[List[Dict[str, Any]]] = None,
        jobs: Optional[List[Dict[str, Any]]] = None,
        skills: Optional[List[str]] = None,
        top_k: int = 5
    ) -> Dict[str, List[str]]:
        """
        Provide live search suggestions for skills, job titles, and candidate names based on partial input.
        Returns a dict with keys: 'skills', 'jobs', 'candidates'.
        """
        query_lower = query.lower().strip()
        suggestions = {"skills": [], "jobs": [], "candidates": []}

        # Skills suggestions
        if skills:
            suggestions["skills"] = [s for s in skills if query_lower in s.lower()][:top_k]

        # Job title suggestions
        if jobs:
            job_titles = [j.get("title", "") for j in jobs]
            suggestions["jobs"] = [t for t in job_titles if query_lower in t.lower()][:top_k]

        # Candidate name suggestions
        if candidates:
            candidate_names = [c.get("name", "") for c in candidates]
            suggestions["candidates"] = [n for n in candidate_names if query_lower in n.lower()][:top_k]

        return suggestions

# Global instance
advanced_ml_service = AdvancedMLService() 
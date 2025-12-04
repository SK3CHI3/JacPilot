"""
Gemini API Client for Jaseci Backend
Provides HTTP client for calling Gemini API from JAC walkers
"""

import os
import json
import requests
from typing import Dict, Any, Optional

# Get API key from environment, with fallback
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '') or 'AIzaSyCH5gYFaTRPkCvI92Rlp--TgVgdR9aW-C0'
# Use v1beta API with gemini-2.5-flash (available for free API keys)
GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

class GeminiClient:
    """HTTP client for Gemini API"""
    
    @staticmethod
    def generate_content(prompt: str, temperature: float = 0.7) -> str:
        """Generate content using Gemini API"""
        if not GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not set in environment")
        
        headers = {
            'Content-Type': 'application/json',
        }
        
        data = {
            'contents': [{
                'parts': [{
                    'text': prompt
                }]
            }]
        }
        
        try:
            response = requests.post(
                f'{GEMINI_API_URL}?key={GEMINI_API_KEY}',
                headers=headers,
                json=data,
                timeout=30
            )
            
            if not response.ok:
                error_text = response.text
                print(f"[gemini_client] API error {response.status_code}: {error_text}")
                raise Exception(f"Gemini API error {response.status_code}: {error_text}")
            
            result = response.json()
            text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
            
            if not text:
                print(f"[gemini_client] Warning: Empty response from API. Full result: {result}")
                raise Exception("Empty response from Gemini API")
            
            return text
        except requests.exceptions.RequestException as e:
            print(f"[gemini_client] Request error: {str(e)}")
            raise Exception(f"Request failed: {str(e)}")
        except Exception as e:
            print(f"[gemini_client] Error: {str(e)}")
            raise
    
    @staticmethod
    def generate_quiz(lesson_content: str, difficulty: int, topics: list) -> Dict[str, Any]:
        """Generate quiz questions"""
        prompt = f"""Generate a {difficulty} level quiz about Jaseci/Jac programming.

Lesson Content: {lesson_content[:1000]}
Topics: {', '.join(topics)}

Include:
- 5 multiple choice questions
- 2 free-text questions  
- 1 coding exercise

Format as JSON with this structure:
{{
    "questions": [
        {{
            "id": "q1",
            "type": "multiple_choice",
            "question": "...",
            "options": ["...", "...", "...", "..."],
            "correct_answer": 0,
            "explanation": "..."
        }},
        {{
            "id": "q2",
            "type": "free_text",
            "question": "...",
            "max_score": 10,
            "explanation": "..."
        }},
        {{
            "id": "q3",
            "type": "coding",
            "question": "...",
            "starter_code": "...",
            "test_cases": [...]
        }}
    ]
}}"""
        
        response = GeminiClient.generate_content(prompt, temperature=0.7)
        
        # Try to parse JSON from response
        try:
            json_match = response[response.find('{'):response.rfind('}')+1]
            return json.loads(json_match)
        except:
            # Fallback: return empty structure
            return {"questions": []}
    
    @staticmethod
    def evaluate_answer(user_answer: str, correct_answer: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate user answer using AI"""
        prompt = f"""Evaluate this answer for correctness and quality:

User Answer: '{user_answer}'
Correct Answer: '{correct_answer}'
Question Context: {json.dumps(context)}

Provide:
1. Score (0.0 to 1.0)
2. Correctness (true/false)
3. Detailed feedback
4. Strengths identified
5. Areas for improvement

Format as JSON:
{{
    "score": 0.85,
    "correct": true,
    "feedback": "...",
    "strengths": ["..."],
    "improvements": ["..."]
}}"""
        
        response = GeminiClient.generate_content(prompt, temperature=0.3)
        
        try:
            json_match = response[response.find('{'):response.rfind('}')+1]
            return json.loads(json_match)
        except:
            return {
                "score": 0.5,
                "correct": False,
                "feedback": "Unable to evaluate answer",
                "strengths": [],
                "improvements": []
            }


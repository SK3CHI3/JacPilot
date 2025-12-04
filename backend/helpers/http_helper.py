"""
HTTP Helper Module for Jaclang
Provides HTTP request functions that can be called from Jac code
"""

import urllib.request
import urllib.parse
import json
from typing import Dict, Any, Optional


def http_get(url: str, headers: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
    """
    Make an HTTP GET request
    
    Args:
        url: The URL to request
        headers: Optional dictionary of headers
        
    Returns:
        Dictionary with 'status_code' and 'body' keys
    """
    try:
        req = urllib.request.Request(url)
        
        if headers:
            for key, value in headers.items():
                req.add_header(key, value)
        
        with urllib.request.urlopen(req) as response:
            status_code = response.getcode()
            body_data = response.read().decode('utf-8')
            
            # Try to parse as JSON, fallback to raw string
            try:
                body = json.loads(body_data)
            except json.JSONDecodeError:
                body = body_data
            
            return {
                "status_code": status_code,
                "body": body,
                "success": True
            }
    except urllib.error.HTTPError as e:
        return {
            "status_code": e.code,
            "body": e.read().decode('utf-8') if e.fp else None,
            "success": False,
            "error": str(e)
        }
    except Exception as e:
        return {
            "status_code": 0,
            "body": None,
            "success": False,
            "error": str(e)
        }


def generate_quiz_via_proxy(lesson_content: str, difficulty: int, num_questions: int, topics: list) -> list:
    """
    Generate quiz questions via gemini_proxy and return the questions list directly
    This is a convenience function for Jaclang walkers
    """
    try:
        result = http_post(
            url='http://localhost:8001/generate_quiz_questions',
            headers={'Content-Type': 'application/json'},
            body={
                'lesson_content': lesson_content,
                'difficulty': difficulty,
                'num_questions': num_questions,
                'topics': topics
            }
        )
        if result and result.get('status_code') == 200:
            return result.get('body', {}).get('questions', [])
        return []
    except Exception as e:
        print(f"Error generating quiz: {e}")
        return []


def http_post(url: str, headers: Optional[Dict[str, str]] = None, 
              body: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Make an HTTP POST request
    
    Args:
        url: The URL to request
        headers: Optional dictionary of headers
        body: Optional dictionary to send as JSON body
        
    Returns:
        Dictionary with 'status_code' and 'body' keys
    """
    try:
        data = None
        if body:
            data = json.dumps(body).encode('utf-8')
        
        req = urllib.request.Request(url, data=data, method='POST')
        
        if headers:
            for key, value in headers.items():
                req.add_header(key, value)
        else:
            req.add_header('Content-Type', 'application/json')
        
        with urllib.request.urlopen(req) as response:
            status_code = response.getcode()
            body_data = response.read().decode('utf-8')
            
            # Try to parse as JSON, fallback to raw string
            try:
                response_body = json.loads(body_data)
            except json.JSONDecodeError:
                response_body = body_data
            
            return {
                "status_code": status_code,
                "body": response_body,
                "success": True
            }
    except urllib.error.HTTPError as e:
        return {
            "status_code": e.code,
            "body": e.read().decode('utf-8') if e.fp else None,
            "success": False,
            "error": str(e)
        }
    except Exception as e:
        return {
            "status_code": 0,
            "body": None,
            "success": False,
            "error": str(e)
        }


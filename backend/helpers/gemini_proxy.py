"""
Gemini API Proxy Service
HTTP endpoint for JAC walkers to call Gemini API
Run this as a separate service: python gemini_proxy.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from gemini_client import GeminiClient
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for localhost

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/evaluate_answer', methods=['POST'])
def evaluate_answer():
    """Evaluate a user answer using Gemini"""
    try:
        data = request.get_json()
        user_answer = data.get('user_answer', '')
        correct_answer = data.get('correct_answer', '')
        context = data.get('context', {})
        
        result = GeminiClient.evaluate_answer(user_answer, correct_answer, context)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "score": 0.5,
            "correct": False,
            "feedback": f"Error evaluating answer: {str(e)}",
            "strengths": [],
            "improvements": []
        }), 500

@app.route('/evaluate_code', methods=['POST'])
def evaluate_code():
    """Evaluate code correctness using Gemini"""
    try:
        data = request.get_json()
        user_code = data.get('user_code', '')
        expected_behavior = data.get('expected_behavior', '')
        context = data.get('context', {})
        
        # Use evaluate_answer with code-specific prompt
        code_context = {
            **context,
            "type": "coding",
            "expected_behavior": expected_behavior
        }
        result = GeminiClient.evaluate_answer(user_code, expected_behavior, code_context)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "score": 0.5,
            "correct": False,
            "feedback": f"Error evaluating code: {str(e)}",
            "strengths": [],
            "improvements": []
        }), 500

@app.route('/generate_quiz_questions', methods=['POST'])
def generate_quiz():
    """Generate quiz questions using Gemini"""
    try:
        data = request.get_json()
        lesson_content = data.get('lesson_content', '')
        difficulty = data.get('difficulty', 2)
        num_questions = data.get('num_questions', 8)
        topics = data.get('topics', [])
        
        result = GeminiClient.generate_quiz(lesson_content, difficulty, topics)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "questions": [],
            "error": str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('GEMINI_PROXY_PORT', 8001))
    print(f"Starting Gemini Proxy on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)


"""
Supabase REST API Proxy
HTTP endpoint for JAC walkers to query Supabase database
Run this as a separate service: python supabase_proxy.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)

SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://lrqtbfnpuzetqcvphycz.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXRiZm5wdXpldHFjdnBoeWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NDk5ODIsImV4cCI6MjA3OTEyNTk4Mn0.J4TGZrHpTYwLz64MUT6zQtXM114PoUsaGVii6Hbmw7Q')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "supabase_url": SUPABASE_URL})

@app.route('/query', methods=['POST'])
def query_supabase():
    """Execute a Supabase query"""
    try:
        data = request.get_json()
        table = data.get('table')
        select = data.get('select', '*')
        filters = data.get('filters', {})
        order_by = data.get('order_by')
        
        url = f"{SUPABASE_URL}/rest/v1/{table}"
        params = {"select": select}
        
        if order_by:
            params["order"] = order_by
        
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json"
        }
        
        # Apply filters
        for key, value in filters.items():
            params[f"{key}"] = f"eq.{value}"
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/user_progress/<user_id>', methods=['GET'])
def get_user_progress(user_id):
    """Get user lesson progress"""
    try:
        url = f"{SUPABASE_URL}/rest/v1/user_lesson_progress"
        params = {
            "select": "*",
            "user_id": f"eq.{user_id}",
            "order": "completed_at.desc"
        }
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json"
        }
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/quiz_attempts/<user_id>', methods=['GET'])
def get_quiz_attempts(user_id):
    """Get user quiz attempts"""
    try:
        url = f"{SUPABASE_URL}/rest/v1/quiz_attempts"
        params = {
            "select": "score",
            "user_id": f"eq.{user_id}"
        }
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json"
        }
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/lesson/<lesson_id>', methods=['GET'])
def get_lesson(lesson_id):
    """Get a single lesson by ID"""
    try:
        url = f"{SUPABASE_URL}/rest/v1/lessons"
        params = {
            "select": "*",
            "id": f"eq.{lesson_id}"
        }
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json"
        }
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        return jsonify(data[0] if data else {})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/lessons', methods=['GET'])
def get_lessons():
    """Get all lessons"""
    try:
        url = f"{SUPABASE_URL}/rest/v1/lessons"
        params = {"select": "*", "order": "order_index"}
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json"
        }
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/concepts', methods=['GET'])
def get_concepts():
    """Get all concepts"""
    try:
        url = f"{SUPABASE_URL}/rest/v1/concepts"
        params = {"select": "*"}
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json"
        }
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/lesson_concepts/<lesson_id>', methods=['GET'])
def get_lesson_concepts(lesson_id):
    """Get concepts for a lesson"""
    try:
        url = f"{SUPABASE_URL}/rest/v1/lesson_concepts"
        params = {
            "select": "concept_id,concepts(*)",
            "lesson_id": f"eq.{lesson_id}"
        }
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json"
        }
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/mastery/<user_id>', methods=['GET'])
def get_user_mastery(user_id):
    """Get user mastery data"""
    try:
        url = f"{SUPABASE_URL}/rest/v1/user_concept_mastery"
        params = {
            "select": "*",
            "user_id": f"eq.{user_id}"
        }
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json"
        }
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return jsonify(response.json() if response.json() else [])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('SUPABASE_PROXY_PORT', 8002))
    print(f"Starting Supabase Proxy on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)


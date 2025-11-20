#!/usr/bin/env python3
"""
Generate comprehensive lesson content using Gemini API
Instructs AI to reference official Jaseci/Jac documentation for accuracy
"""

import os
import json
import requests
from typing import Dict, List, Any
import time

# Configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

# Official Jaseci/Jac documentation references
OFFICIAL_DOCS_REFERENCES = """
IMPORTANT: When generating content, you MUST reference the official Jaseci/Jac documentation:
- Official Jaseci Documentation: https://docs.jaseci.org
- Official Jac Language Reference: https://docs.jaseci.org/jac/
- GitHub Repository: https://github.com/Jaseci-Labs/jaseci

Ensure all code examples, syntax, and concepts are accurate according to the official documentation.
"""

# Lesson metadata - mapped from JAC_LEARNING_PATH.md
LESSON_METADATA = [
    # Module 1: Jac Language Fundamentals (1-6)
    {"order": 1, "title": "Introduction to Jaseci & Jac", "module": "Jac Language Fundamentals", "concepts": ["Jac Language", "Jaseci Framework"]},
    {"order": 2, "title": "Basic Syntax & Types", "module": "Jac Language Fundamentals", "concepts": ["Variables", "Data Types"]},
    {"order": 3, "title": "Operators & Expressions", "module": "Jac Language Fundamentals", "concepts": ["Operators", "Expressions"]},
    {"order": 4, "title": "Control Flow", "module": "Jac Language Fundamentals", "concepts": ["if/elif/else", "Loops"]},
    {"order": 5, "title": "Functions & Abilities", "module": "Jac Language Fundamentals", "concepts": ["can abilities", "Functions"]},
    {"order": 6, "title": "Practice: Building a Calculator", "module": "Jac Language Fundamentals", "concepts": ["Practice", "Integration"]},
    
    # Module 2: Nodes - The Foundation (7-11)
    {"order": 7, "title": "Understanding Nodes", "module": "Nodes - The Foundation", "concepts": ["Nodes", "Node Definition"]},
    {"order": 8, "title": "Node Attributes", "module": "Nodes - The Foundation", "concepts": ["Node Attributes", "has fields"]},
    {"order": 9, "title": "Node Relationships", "module": "Nodes - The Foundation", "concepts": ["Node Relationships", "Node Connections"]},
    {"order": 10, "title": "Built-in Node Types", "module": "Nodes - The Foundation", "concepts": ["Standard Library", "Node Types"]},
    {"order": 11, "title": "Practice: Building a Data Model", "module": "Nodes - The Foundation", "concepts": ["Practice", "Data Modeling"]},
    
    # Module 3: Edges - Connecting Nodes (12-16)
    {"order": 12, "title": "Introduction to Edges", "module": "Edges - Connecting Nodes", "concepts": ["Edges", "Graph Relationships"]},
    {"order": 13, "title": "Creating and Traversing Edges", "module": "Edges - Connecting Nodes", "concepts": ["Edge Syntax", "Graph Traversal"]},
    {"order": 14, "title": "Edge Types and Patterns", "module": "Edges - Connecting Nodes", "concepts": ["Edge Types", "Edge Patterns"]},
    {"order": 15, "title": "Bidirectional Edges", "module": "Edges - Connecting Nodes", "concepts": ["Bidirectional Edges", "Edge Directions"]},
    {"order": 16, "title": "Practice: Building a Graph", "module": "Edges - Connecting Nodes", "concepts": ["Practice", "Graph Construction"]},
    
    # Module 4: Walkers - Computation Agents (17-22)
    {"order": 17, "title": "Understanding Walkers", "module": "Walkers - Computation Agents", "concepts": ["Walkers", "Computation Agents"]},
    {"order": 18, "title": "Walker Parameters", "module": "Walkers - Computation Agents", "concepts": ["has fields", "Walker Parameters"]},
    {"order": 19, "title": "Walker Execution", "module": "Walkers - Computation Agents", "concepts": ["Spawn", "Walker Execution"]},
    {"order": 20, "title": "Walker Control Flow", "module": "Walkers - Computation Agents", "concepts": ["Control Flow", "Walker Logic"]},
    {"order": 21, "title": "Walker Abilities", "module": "Walkers - Computation Agents", "concepts": ["can abilities", "Walker Abilities"]},
    {"order": 22, "title": "Practice: Building a Traversal Walker", "module": "Walkers - Computation Agents", "concepts": ["Practice", "Graph Traversal"]},
    
    # Module 5: Graph Traversal (23-28)
    {"order": 23, "title": "Graph Traversal Basics", "module": "Graph Traversal", "concepts": ["Graph Traversal", "visit keyword"]},
    {"order": 24, "title": "Advanced Edge Patterns", "module": "Graph Traversal", "concepts": ["Edge Patterns", "Complex Traversals"]},
    {"order": 25, "title": "Conditional Traversals", "module": "Graph Traversal", "concepts": ["Conditional Logic", "Filtered Traversals"]},
    {"order": 26, "title": "Multi-hop Traversals", "module": "Graph Traversal", "concepts": ["Multi-hop", "Depth Traversal"]},
    {"order": 27, "title": "Traversal Optimization", "module": "Graph Traversal", "concepts": ["Performance", "Optimization"]},
    {"order": 28, "title": "Practice: Complex Graph Queries", "module": "Graph Traversal", "concepts": ["Practice", "Query Patterns"]},
    
    # Module 6: Object-Spatial Programming (29-34)
    {"order": 29, "title": "Introduction to OSP", "module": "Object-Spatial Programming", "concepts": ["OSP", "Paradigm"]},
    {"order": 30, "title": "Spatial Relationships", "module": "Object-Spatial Programming", "concepts": ["Spatial Concepts", "Relationships"]},
    {"order": 31, "title": "Graph Contexts", "module": "Object-Spatial Programming", "concepts": ["Context", "Graph Scope"]},
    {"order": 32, "title": "Node Context Switching", "module": "Object-Spatial Programming", "concepts": ["Context Switching", "Node Context"]},
    {"order": 33, "title": "OSP Patterns", "module": "Object-Spatial Programming", "concepts": ["Design Patterns", "OSP Patterns"]},
    {"order": 34, "title": "Practice: OSP Application", "module": "Object-Spatial Programming", "concepts": ["Practice", "OSP Design"]},
    
    # Module 7: Advanced Features (35-40)
    {"order": 35, "title": "Standard Library", "module": "Advanced Features", "concepts": ["std library", "Built-in Functions"]},
    {"order": 36, "title": "File Operations", "module": "Advanced Features", "concepts": ["File I/O", "std.file"]},
    {"order": 37, "title": "HTTP Operations", "module": "Advanced Features", "concepts": ["std.http", "HTTP Requests"]},
    {"order": 38, "title": "JSON Operations", "module": "Advanced Features", "concepts": ["std.json", "JSON Handling"]},
    {"order": 39, "title": "Error Handling", "module": "Advanced Features", "concepts": ["Error Handling", "try/catch"]},
    {"order": 40, "title": "Practice: Building an API Client", "module": "Advanced Features", "concepts": ["Practice", "Integration"]},
    
    # Module 8: AI Integration (41-48)
    {"order": 41, "title": "Introduction to byLLM", "module": "AI Integration", "concepts": ["byLLM", "AI Integration"]},
    {"order": 42, "title": "Using byLLM in Walkers", "module": "AI Integration", "concepts": ["byLLM", "AI Walkers"]},
    {"order": 43, "title": "AI-Powered Content Generation", "module": "AI Integration", "concepts": ["Content Generation", "AI"]},
    {"order": 44, "title": "AI Analysis and Evaluation", "module": "AI Integration", "concepts": ["AI Analysis", "Evaluation"]},
    {"order": 45, "title": "Advanced AI Patterns", "module": "AI Integration", "concepts": ["AI Patterns", "Advanced AI"]},
    {"order": 46, "title": "Real-world AI Applications", "module": "AI Integration", "concepts": ["AI Applications", "Use Cases"]},
    {"order": 47, "title": "Practice: Building an AI Walker", "module": "AI Integration", "concepts": ["Practice", "AI Walker"]},
    {"order": 48, "title": "Final Project: Complete Application", "module": "AI Integration", "concepts": ["Final Project", "Integration"]},
]

def call_gemini_api(prompt: str, temperature: float = 0.7) -> str:
    """Call Gemini API with a prompt"""
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
    
    response = requests.post(
        f'{GEMINI_API_URL}?key={GEMINI_API_KEY}',
        headers=headers,
        json=data
    )
    
    if not response.ok:
        raise Exception(f"Gemini API error: {response.status_text}")
    
    result = response.json()
    return result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')

def generate_lesson_content(lesson: Dict[str, Any]) -> str:
    """Generate comprehensive lesson content using Gemini"""
    
    prompt = f"""
{OFFICIAL_DOCS_REFERENCES}

Generate comprehensive, accurate lesson content for Jaseci/Jac programming language.

**Lesson Information:**
- Title: {lesson['title']}
- Module: {lesson['module']}
- Order: {lesson['order']}
- Related Concepts: {', '.join(lesson['concepts'])}

**IMPORTANT REQUIREMENTS:**
1. Reference official Jaseci/Jac documentation at https://docs.jaseci.org for all syntax, concepts, and code examples
2. Ensure all Jac code examples are syntactically correct and follow official documentation
3. Use accurate syntax from the official Jac language reference
4. Include real, working code examples (not placeholders)

**Content Structure:**
Generate HTML content with the following structure:

<h2>[Lesson Title]</h2>

<h3>Introduction</h3>
[Clear explanation of what this lesson covers, why it matters, 100-150 words]

<h3>Learning Objectives</h3>
<ul>
  <li>[Specific, measurable objective 1]</li>
  <li>[Specific, measurable objective 2]</li>
  <li>[Specific, measurable objective 3]</li>
</ul>

<h3>Core Concepts</h3>
[Detailed explanation, 200-300 words, covering:
- What it is (according to official docs)
- How it works
- Why it's useful
- When to use it]

<h3>Code Examples</h3>
[2-3 working Jac code examples with explanations. IMPORTANT: Use accurate syntax from official documentation]

Example format:
<pre><code>
[Actual working Jac code here]
</code></pre>
<p>[Explanation of what this code does and how it works]</p>

<h3>Key Points to Remember</h3>
<ul>
  <li>[Important point 1]</li>
  <li>[Important point 2]</li>
  <li>[Important point 3]</li>
</ul>

<h3>Practice Exercise</h3>
<p><strong>Exercise:</strong> [Clear exercise description]</p>
<p><strong>Requirements:</strong></p>
<ul>
  <li>[Requirement 1]</li>
  <li>[Requirement 2]</li>
</ul>
<p><strong>Starter Code:</strong></p>
<pre><code>
[Starter code template]
</code></pre>

<h3>Next Steps</h3>
<p>[What comes next in the learning path, 50-100 words]</p>

**CRITICAL:** 
- All code must be valid Jac syntax per official documentation
- Do NOT use placeholder code like "Example code will be added here"
- Verify syntax accuracy against https://docs.jaseci.org/jac/
- Use proper Jac keywords: node, walker, has, can, with entry, visit, spawn, etc.

Generate the complete HTML content now:
"""
    
    print(f"Generating content for lesson {lesson['order']}: {lesson['title']}...")
    content = call_gemini_api(prompt, temperature=0.7)
    
    # Try to extract JSON or clean up the response
    # Sometimes Gemini returns markdown, sometimes plain text
    # We want just the HTML content
    
    # Remove markdown code blocks if present
    if content.startswith('```html'):
        content = content[7:]  # Remove ```html
    if content.startswith('```'):
        content = content[3:]  # Remove ```
    if content.endswith('```'):
        content = content[:-3]  # Remove trailing ```
    
    content = content.strip()
    
    return content

def generate_practice_exercise(lesson: Dict[str, Any]) -> Dict[str, Any]:
    """Generate a practice exercise for the lesson"""
    
    prompt = f"""
{OFFICIAL_DOCS_REFERENCES}

Generate a practice exercise for this Jac/Jaseci lesson:

**Lesson:** {lesson['title']}
**Module:** {lesson['module']}
**Concepts:** {', '.join(lesson['concepts'])}

**Requirements:**
1. Exercise should be appropriate for lesson order {lesson['order']}
2. Must use accurate Jac syntax from official documentation
3. Include clear instructions
4. Provide starter code template
5. Include 2-3 test cases with inputs and expected outputs

**Output Format (JSON):**
{{
    "title": "Exercise title",
    "instructions": "Clear exercise description (200-300 words)",
    "starter_code": "// Jac starter code here\\nwalker exercise {{\\n    // Your code here\\n}}",
    "test_cases": [
        {{
            "input": "description of input or scenario",
            "expected_output": "expected output description",
            "description": "What this test case validates"
        }}
    ],
    "difficulty": 1-5,
    "hints": ["Hint 1", "Hint 2"]
}}

Generate ONLY valid JSON, no markdown, no explanation:
"""
    
    print(f"Generating exercise for lesson {lesson['order']}...")
    response = call_gemini_api(prompt, temperature=0.5)
    
    # Extract JSON from response
    try:
        # Remove markdown code blocks if present
        if '```json' in response:
            json_start = response.find('```json') + 7
            json_end = response.find('```', json_start)
            response = response[json_start:json_end].strip()
        elif '```' in response:
            json_start = response.find('```') + 3
            json_end = response.find('```', json_start)
            response = response[json_start:json_end].strip()
        
        exercise = json.loads(response)
        return exercise
    except json.JSONDecodeError as e:
        print(f"Warning: Failed to parse exercise JSON: {e}")
        print(f"Response: {response[:500]}")
        # Return default exercise
        return {
            "title": f"{lesson['title']} Exercise",
            "instructions": "Complete this exercise based on the lesson content.",
            "starter_code": "walker exercise {\n    with entry {\n        // Your code here\n    }\n}",
            "test_cases": [
                {
                    "input": "Default input",
                    "expected_output": "Expected output",
                    "description": "Test case"
                }
            ],
            "difficulty": 2,
            "hints": []
        }

def escape_sql_string(text: str) -> str:
    """Escape single quotes for SQL"""
    return text.replace("'", "''")

def generate_sql_updates():
    """Generate SQL UPDATE statements for lessons"""
    sql_statements = []
    exercises = []
    
    print("=" * 60)
    print("JAC LESSON CONTENT GENERATION")
    print("Using Official Jaseci/Jac Documentation")
    print("=" * 60)
    print()
    
    for i, lesson in enumerate(LESSON_METADATA):
        try:
            # Generate lesson content
            content = generate_lesson_content(lesson)
            
            # Generate practice exercise
            exercise = generate_practice_exercise(lesson)
            
            # Create SQL UPDATE statement
            content_escaped = escape_sql_string(content)
            sql_update = f"""UPDATE lessons 
SET content = '{content_escaped}'
WHERE title = '{escape_sql_string(lesson['title'])}'
  AND order_index = {lesson['order']};"""
            
            sql_statements.append(sql_update)
            
            # Store exercise for later
            exercise['lesson_order'] = lesson['order']
            exercise['lesson_title'] = lesson['title']
            exercises.append(exercise)
            
            # Rate limiting - be nice to API
            if i < len(LESSON_METADATA) - 1:
                time.sleep(2)  # Wait 2 seconds between requests
            
            print(f"✓ Generated lesson {lesson['order']}: {lesson['title']}")
            
        except Exception as e:
            print(f"✗ Error generating lesson {lesson['order']}: {e}")
            continue
    
    # Write SQL file
    sql_file = 'backend/data/generated_lesson_content.sql'
    with open(sql_file, 'w', encoding='utf-8') as f:
        f.write("-- Generated lesson content using Gemini API\n")
        f.write("-- References official Jaseci/Jac documentation\n")
        f.write("-- Generated: " + time.strftime("%Y-%m-%d %H:%M:%S") + "\n\n")
        f.write('\n'.join(sql_statements))
    
    # Write exercises JSON file
    exercises_file = 'backend/data/generated_exercises.json'
    with open(exercises_file, 'w', encoding='utf-8') as f:
        json.dump(exercises, f, indent=2)
    
    print()
    print("=" * 60)
    print(f"✓ Generated {len(sql_statements)} lesson updates")
    print(f"✓ Generated {len(exercises)} exercises")
    print(f"✓ SQL file: {sql_file}")
    print(f"✓ Exercises file: {exercises_file}")
    print("=" * 60)

if __name__ == '__main__':
    if not GEMINI_API_KEY:
        print("ERROR: GEMINI_API_KEY environment variable not set!")
        print("Set it with: export GEMINI_API_KEY=your_key_here")
        exit(1)
    
    generate_sql_updates()


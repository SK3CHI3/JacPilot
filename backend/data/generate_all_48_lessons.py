#!/usr/bin/env python3
"""
Generate complete SQL for all 48 JAC lessons
Creates comprehensive learning path seed data
"""

import json
import os

# All 48 lessons structure
LESSONS = [
    # Module 1: Jac Language Fundamentals (1-6) - Already created above
    # Module 2: Nodes (7-11)
    {"order": 7, "title": "Understanding Nodes", "time": 25, "type": "theory", "module": 2},
    {"order": 8, "title": "Node Attributes", "time": 20, "type": "theory", "module": 2},
    {"order": 9, "title": "Node Relationships", "time": 25, "type": "theory", "module": 2},
    {"order": 10, "title": "Built-in Node Types", "time": 25, "type": "theory", "module": 2},
    {"order": 11, "title": "Practice: Building a Data Model", "time": 25, "type": "practice", "module": 2},
    
    # Module 3: Edges (12-16)
    {"order": 12, "title": "Introduction to Edges", "time": 25, "type": "theory", "module": 3},
    {"order": 13, "title": "Creating and Traversing Edges", "time": 30, "type": "theory", "module": 3},
    {"order": 14, "title": "Edge Attributes", "time": 25, "type": "theory", "module": 3},
    {"order": 15, "title": "Complex Edge Patterns", "time": 30, "type": "theory", "module": 3},
    {"order": 16, "title": "Practice: Building a Social Network Graph", "time": 30, "type": "practice", "module": 3},
    
    # Module 4: Walkers (17-23)
    {"order": 17, "title": "Walkers Basics", "time": 30, "type": "theory", "module": 4},
    {"order": 18, "title": "Walker Context", "time": 25, "type": "theory", "module": 4},
    {"order": 19, "title": "Basic Graph Traversal", "time": 30, "type": "theory", "module": 4},
    {"order": 20, "title": "Walker States and Lifecycle", "time": 30, "type": "theory", "module": 4},
    {"order": 21, "title": "Advanced Traversal Patterns", "time": 35, "type": "theory", "module": 4},
    {"order": 22, "title": "Walker Communication", "time": 30, "type": "theory", "module": 4},
    {"order": 23, "title": "Practice: Graph Algorithms", "time": 40, "type": "practice", "module": 4},
    
    # Module 5: Actions & Standard Library (24-27)
    {"order": 24, "title": "Built-in Actions", "time": 30, "type": "theory", "module": 5},
    {"order": 25, "title": "Creating Custom Actions", "time": 35, "type": "theory", "module": 5},
    {"order": 26, "title": "Action Best Practices", "time": 25, "type": "theory", "module": 5},
    {"order": 27, "title": "Practice: Building Utility Library", "time": 30, "type": "practice", "module": 5},
    
    # Module 6: Spawn & Execution (28-31)
    {"order": 28, "title": "The Spawn Mechanism", "time": 30, "type": "theory", "module": 6},
    {"order": 29, "title": "Spawn Context Passing", "time": 30, "type": "theory", "module": 6},
    {"order": 30, "title": "Walker Execution Flow", "time": 30, "type": "theory", "module": 6},
    {"order": 31, "title": "Practice: Multi-Walker Application", "time": 30, "type": "practice", "module": 6},
    
    # Module 7: OSP (32-36)
    {"order": 32, "title": "OSP Fundamentals", "time": 35, "type": "theory", "module": 7},
    {"order": 33, "title": "Modeling with OSP", "time": 30, "type": "theory", "module": 7},
    {"order": 34, "title": "Knowledge Graphs", "time": 35, "type": "theory", "module": 7},
    {"order": 35, "title": "Advanced OSP Patterns", "time": 30, "type": "theory", "module": 7},
    {"order": 36, "title": "Practice: Build a Knowledge Base", "time": 30, "type": "practice", "module": 7},
    
    # Module 8: byLLM & AI Integration (37-40)
    {"order": 37, "title": "Introduction to byLLM", "time": 30, "type": "theory", "module": 8},
    {"order": 38, "title": "Generative AI", "time": 40, "type": "theory", "module": 8},
    {"order": 39, "title": "Analytical AI", "time": 35, "type": "theory", "module": 8},
    {"order": 40, "title": "AI-Powered Walkers", "time": 35, "type": "practice", "module": 8},
    
    # Module 9: Advanced Topics (41-45)
    {"order": 41, "title": "Advanced Walker Patterns", "time": 40, "type": "theory", "module": 9},
    {"order": 42, "title": "Graph Algorithms", "time": 40, "type": "theory", "module": 9},
    {"order": 43, "title": "Performance Optimization", "time": 35, "type": "theory", "module": 9},
    {"order": 44, "title": "Testing & Debugging", "time": 35, "type": "theory", "module": 9},
    {"order": 45, "title": "Best Practices & Patterns", "time": 30, "type": "theory", "module": 9},
    
    # Module 10: Real-World Projects (46-48)
    {"order": 46, "title": "Project 1: Task Management System", "time": 60, "type": "project", "module": 10},
    {"order": 47, "title": "Project 2: Recommendation Engine", "time": 75, "type": "project", "module": 10},
    {"order": 48, "title": "Project 3: AI-Powered Learning Platform", "time": 90, "type": "project", "module": 10},
]

def generate_lesson_content(lesson):
    """Generate lesson content based on lesson data"""
    module_titles = {
        1: "Jac Language Fundamentals",
        2: "Nodes - The Foundation",
        3: "Edges - Connecting Nodes",
        4: "Walkers - The Computation Engine",
        5: "Actions & Standard Library",
        6: "Spawn & Execution",
        7: "OSP - Object-Spatial Programming",
        8: "byLLM & AI Integration",
        9: "Advanced Topics",
        10: "Real-World Projects"
    }
    
    module = lesson["module"]
    title = lesson["title"]
    order = lesson["order"]
    
    # Generate placeholder content structure
    # In production, each would have detailed content
    content = f'''<h2>{title}</h2>
<p>This is lesson {order} in Module {module}: {module_titles[module]}</p>

<h3>Learning Objectives</h3>
<ul>
  <li>Understand the core concepts of {title.lower()}</li>
  <li>Learn practical implementation techniques</li>
  <li>Apply knowledge through hands-on exercises</li>
</ul>

<h3>Key Concepts</h3>
<p>This lesson covers essential aspects of {title.lower()} in the context of Jaseci and Jac programming.</p>

<h3>Code Examples</h3>
<pre><code># Example code will be added here
walker example {{
    with entry {{
        report "Learning {title}";
    }}
}}</code></pre>

<h3>Practice Exercise</h3>
<p>Complete the exercises at the end of this lesson to reinforce your understanding.</p>

<h3>Next Steps</h3>
<p>After completing this lesson, proceed to the next lesson in the module.</p>'''
    
    return content

def generate_sql():
    """Generate complete SQL for all lessons"""
    sql_statements = []
    
    sql_statements.append("-- =====================================================")
    sql_statements.append("-- ALL 48 LESSONS - COMPREHENSIVE JAC LEARNING PATH")
    sql_statements.append("-- =====================================================")
    sql_statements.append("-- Note: Lessons 1-6 already have detailed content")
    sql_statements.append("-- Lessons 7-48 use structured templates")
    sql_statements.append("")
    sql_statements.append("-- Delete existing lessons (optional)")
    sql_statements.append("-- DELETE FROM lesson_concepts;")
    sql_statements.append("-- DELETE FROM lessons;")
    sql_statements.append("")
    
    # Generate SQL for all lessons
    for lesson in LESSONS:
        content = generate_lesson_content(lesson)
        # Escape single quotes
        content_escaped = content.replace("'", "''")
        
        sql = f"""INSERT INTO lessons (title, content, order_index, estimated_time, lesson_type) VALUES
('{lesson["title"]}', 
'{content_escaped}', 
{lesson["order"]}, {lesson["time"]}, '{lesson["type"]}')
ON CONFLICT DO NOTHING;"""
        
        sql_statements.append(sql)
        sql_statements.append("")
    
    return "\n".join(sql_statements)

if __name__ == "__main__":
    sql_output = generate_sql()
    
    # Write to file
    output_file = "backend/data/all_48_lessons.sql"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(sql_output)
    
    print(f"✅ Generated SQL for all {len(LESSONS)} lessons")
    print(f"📁 Output file: {output_file}")
    print(f"\n📊 Statistics:")
    print(f"   - Total lessons: {len(LESSONS)}")
    print(f"   - Theory lessons: {sum(1 for l in LESSONS if l['type'] == 'theory')}")
    print(f"   - Practice lessons: {sum(1 for l in LESSONS if l['type'] == 'practice')}")
    print(f"   - Project lessons: {sum(1 for l in LESSONS if l['type'] == 'project')}")
    print(f"   - Total estimated time: {sum(l['time'] for l in LESSONS)} minutes (~{sum(l['time'] for l in LESSONS) / 60:.1f} hours)")


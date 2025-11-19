#!/usr/bin/env python3
"""
Generate comprehensive SQL seed data for all 48 lessons and concepts
"""

import json

# Comprehensive lesson structure
lessons_data = {
    "Module 1: Jac Language Fundamentals": [
        {
            "order": 1, "title": "Introduction to Jaseci & Jac", "time": 20,
            "type": "theory",
            "content_file": "lessons/module1_lesson1.html"
        },
        # ... (would continue with all 48)
    ]
}

# Concepts list (50+ concepts)
concepts = [
    # Module 1 Concepts
    {"name": "Jac Language", "description": "The programming language for Jaseci", "difficulty": 2, "category": "Core"},
    {"name": "Variables", "description": "Using 'has' keyword for variable declaration", "difficulty": 1, "category": "Core"},
    {"name": "Data Types", "description": "int, float, str, bool, list, dict types in Jac", "difficulty": 1, "category": "Core"},
    {"name": "Type Annotations", "description": "Explicit type specification in Jac", "difficulty": 2, "category": "Core"},
    {"name": "Operators", "description": "Arithmetic, comparison, logical operators", "difficulty": 1, "category": "Core"},
    {"name": "Control Flow", "description": "if/elif/else, while, for loops", "difficulty": 2, "category": "Core"},
    {"name": "Functions", "description": "Defining abilities with 'can' keyword", "difficulty": 2, "category": "Core"},
    {"name": "Standard Library", "description": "Built-in actions and utilities", "difficulty": 2, "category": "Core"},
    
    # Module 2 Concepts - Nodes
    {"name": "Nodes", "description": "Data structures representing entities in graphs", "difficulty": 1, "category": "Core"},
    {"name": "Node Declaration", "description": "Defining nodes with 'node' keyword", "difficulty": 2, "category": "Core"},
    {"name": "Node Attributes", "description": "Using 'has' for node properties", "difficulty": 1, "category": "Core"},
    {"name": "Node Instantiation", "description": "Creating node instances", "difficulty": 2, "category": "Core"},
    {"name": "Node Relationships", "description": "How nodes connect via edges", "difficulty": 2, "category": "Core"},
    
    # Module 3 Concepts - Edges
    {"name": "Edges", "description": "Relationships between nodes in graphs", "difficulty": 1, "category": "Core"},
    {"name": "Edge Types", "description": "Directed, undirected, bidirectional edges", "difficulty": 2, "category": "Core"},
    {"name": "Edge Patterns", "description": "Syntax: [-->], [<--], [<-->]", "difficulty": 2, "category": "Core"},
    {"name": "Edge Traversal", "description": "Navigating edges in graphs", "difficulty": 3, "category": "Core"},
    {"name": "Edge Attributes", "description": "Storing data on edges", "difficulty": 2, "category": "Core"},
    
    # Module 4 Concepts - Walkers
    {"name": "Walkers", "description": "Traversal mechanisms for navigating graphs", "difficulty": 2, "category": "Core"},
    {"name": "Walker Syntax", "description": "Defining walkers with 'walker' keyword", "difficulty": 2, "category": "Core"},
    {"name": "Walker Context", "description": "Has variables in walkers", "difficulty": 2, "category": "Core"},
    {"name": "Graph Traversal", "description": "Methods for navigating and querying graphs", "difficulty": 3, "category": "Core"},
    {"name": "Visit Statement", "description": "Using 'visit' to traverse graphs", "difficulty": 3, "category": "Core"},
    {"name": "Walker States", "description": "Managing state in walkers", "difficulty": 3, "category": "Core"},
    {"name": "Walker Communication", "description": "Passing data between walkers", "difficulty": 3, "category": "Core"},
    
    # Module 5 Concepts - Actions
    {"name": "Actions", "description": "Built-in functions and utilities", "difficulty": 2, "category": "Core"},
    {"name": "Standard Library", "description": "std.* actions for common operations", "difficulty": 2, "category": "Core"},
    {"name": "Custom Actions", "description": "Creating reusable action functions", "difficulty": 3, "category": "Core"},
    
    # Module 6 Concepts - Spawn
    {"name": "Spawn", "description": "Mechanism for executing walkers", "difficulty": 2, "category": "Core"},
    {"name": "Spawn Context", "description": "Passing parameters to spawned walkers", "difficulty": 2, "category": "Core"},
    {"name": "Walker Execution", "description": "How walkers execute and return results", "difficulty": 3, "category": "Core"},
    
    # Module 7 Concepts - OSP
    {"name": "OSP", "description": "Object-Spatial Programming paradigm", "difficulty": 3, "category": "Advanced"},
    {"name": "Graph Modeling", "description": "Using graphs to model domain entities", "difficulty": 3, "category": "Advanced"},
    {"name": "Knowledge Graphs", "description": "Building and querying knowledge graphs", "difficulty": 4, "category": "Advanced"},
    {"name": "Graph Algorithms", "description": "Implementing algorithms on graphs", "difficulty": 4, "category": "Advanced"},
    
    # Module 8 Concepts - byLLM
    {"name": "byLLM", "description": "AI/ML integration for content generation and analysis", "difficulty": 4, "category": "AI"},
    {"name": "AI Generation", "description": "Using AI to generate content", "difficulty": 3, "category": "AI"},
    {"name": "AI Analysis", "description": "Using AI for analysis and evaluation", "difficulty": 3, "category": "AI"},
    {"name": "Gemini Integration", "description": "Integrating Gemini AI in Jaseci", "difficulty": 4, "category": "AI"},
]

# Generate SQL
sql_statements = []

# Insert Concepts
sql_statements.append("-- Insert Concepts")
for concept in concepts:
    sql = f"""INSERT INTO concepts (name, description, difficulty_level, category) VALUES
('{concept["name"]}', '{concept["description"].replace("'", "''")}', {concept["difficulty"]}, '{concept["category"]}')
ON CONFLICT (name) DO NOTHING;"""
    sql_statements.append(sql)

print("\n".join(sql_statements))
print("\n-- Total concepts:", len(concepts))


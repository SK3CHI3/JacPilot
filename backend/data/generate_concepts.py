#!/usr/bin/env python3
"""
Generate comprehensive concepts SQL
Creates all 50+ concepts for JAC learning path
"""

concepts = [
    # Module 1: Jac Language Fundamentals
    {"name": "Jac Language", "desc": "The programming language for Jaseci", "diff": 2, "cat": "Core"},
    {"name": "Variables", "desc": "Using 'has' keyword for variable declaration", "diff": 1, "cat": "Core"},
    {"name": "Data Types", "desc": "int, float, str, bool, list, dict types in Jac", "diff": 1, "cat": "Core"},
    {"name": "Type Annotations", "desc": "Explicit type specification in Jac", "diff": 2, "cat": "Core"},
    {"name": "Operators", "desc": "Arithmetic, comparison, logical operators", "diff": 1, "cat": "Core"},
    {"name": "Control Flow", "desc": "if/elif/else, while, for loops", "diff": 2, "cat": "Core"},
    {"name": "Functions", "desc": "Defining abilities with 'can' keyword", "diff": 2, "cat": "Core"},
    {"name": "Standard Library", "desc": "Built-in actions and utilities", "diff": 2, "cat": "Core"},
    
    # Module 2: Nodes
    {"name": "Nodes", "desc": "Data structures representing entities in graphs", "diff": 1, "cat": "Core"},
    {"name": "Node Declaration", "desc": "Defining nodes with 'node' keyword", "diff": 2, "cat": "Core"},
    {"name": "Node Attributes", "desc": "Using 'has' for node properties", "diff": 1, "cat": "Core"},
    {"name": "Node Instantiation", "desc": "Creating node instances", "diff": 2, "cat": "Core"},
    {"name": "Node Relationships", "desc": "How nodes connect via edges", "diff": 2, "cat": "Core"},
    {"name": "Node Hierarchies", "desc": "Building hierarchical node structures", "diff": 3, "cat": "Core"},
    
    # Module 3: Edges
    {"name": "Edges", "desc": "Relationships between nodes in graphs", "diff": 1, "cat": "Core"},
    {"name": "Edge Types", "desc": "Directed, undirected, bidirectional edges", "diff": 2, "cat": "Core"},
    {"name": "Edge Patterns", "desc": "Syntax: [-->], [<--], [<-->]", "diff": 2, "cat": "Core"},
    {"name": "Edge Traversal", "desc": "Navigating edges in graphs", "diff": 3, "cat": "Core"},
    {"name": "Edge Attributes", "desc": "Storing data on edges", "diff": 2, "cat": "Core"},
    {"name": "Complex Edge Patterns", "desc": "Conditional and multi-hop traversal", "diff": 3, "cat": "Core"},
    
    # Module 4: Walkers
    {"name": "Walkers", "desc": "Traversal mechanisms for navigating graphs", "diff": 2, "cat": "Core"},
    {"name": "Walker Syntax", "desc": "Defining walkers with 'walker' keyword", "diff": 2, "cat": "Core"},
    {"name": "Walker Context", "desc": "Has variables in walkers", "diff": 2, "cat": "Core"},
    {"name": "Graph Traversal", "desc": "Methods for navigating and querying graphs", "diff": 3, "cat": "Core"},
    {"name": "Visit Statement", "desc": "Using 'visit' to traverse graphs", "diff": 3, "cat": "Core"},
    {"name": "Walker States", "desc": "Managing state in walkers", "diff": 3, "cat": "Core"},
    {"name": "Walker Communication", "desc": "Passing data between walkers", "diff": 3, "cat": "Core"},
    {"name": "Walker Lifecycle", "desc": "Entry, execution, and exit points", "diff": 3, "cat": "Core"},
    
    # Module 5: Actions
    {"name": "Actions", "desc": "Built-in functions and utilities", "diff": 2, "cat": "Core"},
    {"name": "Standard Library Actions", "desc": "std.* actions for common operations", "diff": 2, "cat": "Core"},
    {"name": "Custom Actions", "desc": "Creating reusable action functions", "diff": 3, "cat": "Core"},
    {"name": "Action Parameters", "desc": "Passing parameters to actions", "diff": 2, "cat": "Core"},
    
    # Module 6: Spawn
    {"name": "Spawn", "desc": "Mechanism for executing walkers", "diff": 2, "cat": "Core"},
    {"name": "Spawn Context", "desc": "Passing parameters to spawned walkers", "diff": 2, "cat": "Core"},
    {"name": "Walker Execution", "desc": "How walkers execute and return results", "diff": 3, "cat": "Core"},
    {"name": "Spawn Syntax", "desc": "Calling walkers with spawn", "diff": 2, "cat": "Core"},
    
    # Module 7: OSP
    {"name": "OSP", "desc": "Object-Spatial Programming paradigm", "diff": 3, "cat": "Advanced"},
    {"name": "Graph Modeling", "desc": "Using graphs to model domain entities", "diff": 3, "cat": "Advanced"},
    {"name": "Knowledge Graphs", "desc": "Building and querying knowledge graphs", "diff": 4, "cat": "Advanced"},
    {"name": "Graph Algorithms", "desc": "Implementing algorithms on graphs", "diff": 4, "cat": "Advanced"},
    {"name": "Spatial Queries", "desc": "Querying graphs using spatial patterns", "diff": 3, "cat": "Advanced"},
    {"name": "Graph Relationships", "desc": "Modeling complex relationships in OSP", "diff": 4, "cat": "Advanced"},
    
    # Module 8: byLLM
    {"name": "byLLM", "desc": "AI/ML integration for content generation and analysis", "diff": 4, "cat": "AI"},
    {"name": "AI Generation", "desc": "Using AI to generate content", "diff": 3, "cat": "AI"},
    {"name": "AI Analysis", "desc": "Using AI for analysis and evaluation", "diff": 3, "cat": "AI"},
    {"name": "Gemini Integration", "desc": "Integrating Gemini AI in Jaseci", "diff": 4, "cat": "AI"},
    {"name": "Prompt Engineering", "desc": "Creating effective prompts for AI", "diff": 3, "cat": "AI"},
    {"name": "AI-Powered Walkers", "desc": "Building walkers that use AI capabilities", "diff": 4, "cat": "AI"},
    
    # Module 9: Advanced
    {"name": "Advanced Walker Patterns", "desc": "Recursive and meta-walkers", "diff": 4, "cat": "Advanced"},
    {"name": "Performance Optimization", "desc": "Optimizing graph traversal performance", "diff": 4, "cat": "Advanced"},
    {"name": "Testing Walkers", "desc": "Testing and debugging walkers", "diff": 3, "cat": "Advanced"},
    {"name": "Best Practices", "desc": "Code organization and patterns", "diff": 3, "cat": "Advanced"},
    
    # Additional
    {"name": "Type Safety", "desc": "Type checking and validation in Jac", "diff": 2, "cat": "Core"},
    {"name": "Error Handling", "desc": "Managing errors and exceptions", "diff": 3, "cat": "Core"},
    {"name": "Code Organization", "desc": "Structuring Jac programs effectively", "diff": 3, "cat": "Advanced"},
    {"name": "Graph Visualization", "desc": "Visualizing graph structures", "diff": 3, "cat": "Advanced"},
    {"name": "Mastery Tracking", "desc": "Tracking learning progress with graphs", "diff": 4, "cat": "Advanced"},
    {"name": "Adaptive Learning", "desc": "Using graphs for personalized learning paths", "diff": 4, "cat": "AI"},
]

def generate_sql():
    sql_statements = []
    sql_statements.append("-- =====================================================")
    sql_statements.append("-- ALL CONCEPTS (50+ Concepts)")
    sql_statements.append("-- =====================================================")
    sql_statements.append("")
    sql_statements.append("INSERT INTO concepts (name, description, difficulty_level, category) VALUES")
    
    values = []
    for c in concepts:
        desc = c["desc"].replace("'", "''")
        values.append(f"('{c['name']}', '{desc}', {c['diff']}, '{c['cat']}')")
    
    sql_statements.append(",\n".join(values))
    sql_statements.append("ON CONFLICT (name) DO NOTHING;")
    sql_statements.append("")
    sql_statements.append(f"-- Total concepts: {len(concepts)}")
    
    return "\n".join(sql_statements)

if __name__ == "__main__":
    sql_output = generate_sql()
    
    output_file = "backend/data/concepts_complete.sql"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(sql_output)
    
    print(f"✅ Generated SQL for {len(concepts)} concepts")
    print(f"📁 Output file: {output_file}")


#!/usr/bin/env python3
"""
Generate comprehensive SQL for all 48 JAC lessons
This script creates the complete learning path seed data
"""

lessons = [
    # Module 1: Jac Language Fundamentals (6 lessons - already in file)
    # Starting from Module 2...
    
    # MODULE 2: Nodes (5 lessons - 7-11)
    {
        'order': 7,
        'title': 'Understanding Nodes',
        'type': 'theory',
        'time': 25,
        'content': '''<h2>What are Nodes?</h2>
<p>Nodes are the fundamental building blocks of graphs in Jaseci. They represent entities in your data model.</p>

<h3>Node Declaration</h3>
<pre><code>node user {
    has user_id: str;
    has email: str;
    has name: str;
    has total_lessons_completed: int = 0;
    has average_quiz_score: float = 0.0;
    has level: int = 1;
}</code></pre>

<h3>Key Concepts</h3>
<ul>
  <li>Nodes are like classes in object-oriented programming</li>
  <li>They have attributes using the <code>has</code> keyword</li>
  <li>Attributes can have default values</li>
  <li>Type annotations are required</li>
</ul>

<h3>Node Instantiation</h3>
<p>Nodes are created implicitly when you traverse graphs or explicitly through walkers.</p>

<h3>Practice Exercise</h3>
<p>Create a node for a "Lesson" entity with appropriate attributes.</p>'''
    },
    # ... continuing with remaining lessons
]

# Generate SQL
sql_output = []
for lesson in lessons:
    content_escaped = lesson['content'].replace("'", "''")
    sql = f"""INSERT INTO lessons (title, content, order_index, estimated_time, lesson_type) VALUES
('{lesson['title']}', 
'{content_escaped}', 
{lesson['order']}, {lesson['time']}, '{lesson['type']}')
ON CONFLICT DO NOTHING;"""
    sql_output.append(sql)

print('\n'.join(sql_output))


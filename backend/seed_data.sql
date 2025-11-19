-- Seed Data for JacPilot
-- Run this in Supabase SQL Editor to populate initial data

-- Insert Concepts
INSERT INTO concepts (name, description, difficulty_level, category) VALUES
('Walkers', 'Traversal mechanisms in Jaseci for navigating graphs', 2, 'Core'),
('Nodes', 'Data structures representing entities in the graph', 1, 'Core'),
('Edges', 'Relationships between nodes in the graph', 1, 'Core'),
('OSP', 'Object-Spatial Programming paradigm', 3, 'Advanced'),
('byLLM', 'AI/ML integration for content generation and analysis', 4, 'AI'),
('Graph Traversal', 'Methods for navigating and querying graphs', 3, 'Core'),
('Jac Language', 'The programming language for Jaseci', 2, 'Core'),
('Spawn', 'Mechanism for executing walkers', 2, 'Core')
ON CONFLICT (name) DO NOTHING;

-- Insert Lessons
INSERT INTO lessons (title, content, order_index, estimated_time, lesson_type) VALUES
('Introduction to Jaseci', 
'<h2>Welcome to Jaseci!</h2>
<p>Jaseci is a powerful framework for building AI applications using graph-based computation.</p>
<h3>Key Concepts:</h3>
<ul>
  <li>Graph-based data modeling</li>
  <li>Walker-based computation</li>
  <li>Object-Spatial Programming</li>
</ul>
<p>In this lesson, you will learn the fundamentals of Jaseci and how it differs from traditional programming paradigms.</p>', 
1, 15, 'theory'),

('Understanding Walkers', 
'<h2>What are Walkers?</h2>
<p>Walkers are the core computation mechanism in Jaseci. They traverse graphs and perform operations.</p>
<h3>Walker Syntax:</h3>
<pre><code>walker example {
    has count = 0;
    can start {
        visit [-->](`?node);
    }
}</code></pre>
<p>Walkers can traverse edges, access node data, and perform complex graph operations.</p>', 
2, 20, 'theory'),

('Object-Spatial Programming', 
'<h2>OSP: A New Paradigm</h2>
<p>Object-Spatial Programming combines object-oriented concepts with spatial graph relationships.</p>
<h3>Key Features:</h3>
<ul>
  <li>Nodes represent entities</li>
  <li>Edges represent relationships</li>
  <li>Spatial queries enable powerful traversals</li>
</ul>
<p>This paradigm allows for intuitive modeling of complex systems.</p>', 
3, 25, 'theory'),

('byLLM Integration', 
'<h2>AI-Powered Features</h2>
<p>byLLM enables AI capabilities in your Jaseci applications.</p>
<h3>Use Cases:</h3>
<ul>
  <li>Content generation</li>
  <li>Answer evaluation</li>
  <li>Pattern analysis</li>
</ul>
<p>Learn how to integrate AI into your walkers for intelligent applications.</p>', 
4, 30, 'practice'),

('Advanced Graph Traversals', 
'<h2>Mastering Graph Navigation</h2>
<p>Advanced techniques for traversing and querying graphs efficiently.</p>
<h3>Topics Covered:</h3>
<ul>
  <li>Complex edge patterns</li>
  <li>Conditional traversals</li>
  <li>Performance optimization</li>
</ul>
<p>Build sophisticated graph-based applications with these advanced techniques.</p>', 
5, 35, 'practice')
ON CONFLICT DO NOTHING;

-- Link lessons to concepts
INSERT INTO lesson_concepts (lesson_id, concept_id, weight)
SELECT l.id, c.id, 1.0
FROM lessons l, concepts c
WHERE (l.title = 'Introduction to Jaseci' AND c.name IN ('Jac Language', 'Nodes', 'Edges'))
   OR (l.title = 'Understanding Walkers' AND c.name IN ('Walkers', 'Spawn'))
   OR (l.title = 'Object-Spatial Programming' AND c.name IN ('OSP', 'Graph Traversal'))
   OR (l.title = 'byLLM Integration' AND c.name = 'byLLM')
   OR (l.title = 'Advanced Graph Traversals' AND c.name IN ('Graph Traversal', 'Walkers'))
ON CONFLICT DO NOTHING;

-- Set up concept prerequisites
INSERT INTO concept_prerequisites (prerequisite_id, dependent_id, strength)
SELECT p.id, d.id, 1.0
FROM concepts p, concepts d
WHERE (p.name = 'Nodes' AND d.name = 'Walkers')
   OR (p.name = 'Edges' AND d.name = 'Walkers')
   OR (p.name = 'Walkers' AND d.name = 'Graph Traversal')
   OR (p.name = 'Graph Traversal' AND d.name = 'OSP')
ON CONFLICT DO NOTHING;



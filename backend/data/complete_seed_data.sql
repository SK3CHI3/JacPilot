-- =====================================================
-- COMPLETE SEED DATA FOR JACPILOT
-- =====================================================
-- This file contains:
-- 1. All 48 lessons (from all_lessons_complete.sql)
-- 2. All 50+ concepts
-- 3. Lesson-concept relationships
-- 4. Concept prerequisites
-- =====================================================

-- Step 1: Import lessons from all_lessons_complete.sql first
-- Then run the concepts and relationships below

-- =====================================================
-- ALL CONCEPTS (50+ Concepts)
-- =====================================================

INSERT INTO concepts (name, description, difficulty_level, category) VALUES

-- Module 1: Jac Language Fundamentals
('Jac Language', 'The programming language for Jaseci', 2, 'Core'),
('Variables', 'Using ''has'' keyword for variable declaration', 1, 'Core'),
('Data Types', 'int, float, str, bool, list, dict types in Jac', 1, 'Core'),
('Type Annotations', 'Explicit type specification in Jac', 2, 'Core'),
('Operators', 'Arithmetic, comparison, logical operators', 1, 'Core'),
('Control Flow', 'if/elif/else, while, for loops', 2, 'Core'),
('Functions', 'Defining abilities with ''can'' keyword', 2, 'Core'),
('Standard Library', 'Built-in actions and utilities', 2, 'Core'),

-- Module 2: Nodes
('Nodes', 'Data structures representing entities in graphs', 1, 'Core'),
('Node Declaration', 'Defining nodes with ''node'' keyword', 2, 'Core'),
('Node Attributes', 'Using ''has'' for node properties', 1, 'Core'),
('Node Instantiation', 'Creating node instances', 2, 'Core'),
('Node Relationships', 'How nodes connect via edges', 2, 'Core'),
('Node Hierarchies', 'Building hierarchical node structures', 3, 'Core'),

-- Module 3: Edges
('Edges', 'Relationships between nodes in graphs', 1, 'Core'),
('Edge Types', 'Directed, undirected, bidirectional edges', 2, 'Core'),
('Edge Patterns', 'Syntax: [-->], [<--], [<-->]', 2, 'Core'),
('Edge Traversal', 'Navigating edges in graphs', 3, 'Core'),
('Edge Attributes', 'Storing data on edges', 2, 'Core'),
('Complex Edge Patterns', 'Conditional and multi-hop traversal', 3, 'Core'),

-- Module 4: Walkers
('Walkers', 'Traversal mechanisms for navigating graphs', 2, 'Core'),
('Walker Syntax', 'Defining walkers with ''walker'' keyword', 2, 'Core'),
('Walker Context', 'Has variables in walkers', 2, 'Core'),
('Graph Traversal', 'Methods for navigating and querying graphs', 3, 'Core'),
('Visit Statement', 'Using ''visit'' to traverse graphs', 3, 'Core'),
('Walker States', 'Managing state in walkers', 3, 'Core'),
('Walker Communication', 'Passing data between walkers', 3, 'Core'),
('Walker Lifecycle', 'Entry, execution, and exit points', 3, 'Core'),

-- Module 5: Actions
('Actions', 'Built-in functions and utilities', 2, 'Core'),
('Standard Library Actions', 'std.* actions for common operations', 2, 'Core'),
('Custom Actions', 'Creating reusable action functions', 3, 'Core'),
('Action Parameters', 'Passing parameters to actions', 2, 'Core'),

-- Module 6: Spawn
('Spawn', 'Mechanism for executing walkers', 2, 'Core'),
('Spawn Context', 'Passing parameters to spawned walkers', 2, 'Core'),
('Walker Execution', 'How walkers execute and return results', 3, 'Core'),
('Spawn Syntax', 'Calling walkers with spawn', 2, 'Core'),

-- Module 7: OSP
('OSP', 'Object-Spatial Programming paradigm', 3, 'Advanced'),
('Graph Modeling', 'Using graphs to model domain entities', 3, 'Advanced'),
('Knowledge Graphs', 'Building and querying knowledge graphs', 4, 'Advanced'),
('Graph Algorithms', 'Implementing algorithms on graphs', 4, 'Advanced'),
('Spatial Queries', 'Querying graphs using spatial patterns', 3, 'Advanced'),
('Graph Relationships', 'Modeling complex relationships in OSP', 4, 'Advanced'),

-- Module 8: byLLM
('byLLM', 'AI/ML integration for content generation and analysis', 4, 'AI'),
('AI Generation', 'Using AI to generate content', 3, 'AI'),
('AI Analysis', 'Using AI for analysis and evaluation', 3, 'AI'),
('Gemini Integration', 'Integrating Gemini AI in Jaseci', 4, 'AI'),
('Prompt Engineering', 'Creating effective prompts for AI', 3, 'AI'),
('AI-Powered Walkers', 'Building walkers that use AI capabilities', 4, 'AI'),

-- Module 9: Advanced Topics
('Advanced Walker Patterns', 'Recursive and meta-walkers', 4, 'Advanced'),
('Graph Algorithms', 'BFS, DFS, shortest path, etc.', 4, 'Advanced'),
('Performance Optimization', 'Optimizing graph traversal performance', 4, 'Advanced'),
('Testing Walkers', 'Testing and debugging walkers', 3, 'Advanced'),
('Best Practices', 'Code organization and patterns', 3, 'Advanced'),

-- Additional Concepts
('Type Safety', 'Type checking and validation in Jac', 2, 'Core'),
('Error Handling', 'Managing errors and exceptions', 3, 'Core'),
('Code Organization', 'Structuring Jac programs effectively', 3, 'Advanced'),
('Graph Visualization', 'Visualizing graph structures', 3, 'Advanced'),
('Mastery Tracking', 'Tracking learning progress with graphs', 4, 'Advanced'),
('Adaptive Learning', 'Using graphs for personalized learning paths', 4, 'AI')

ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- LESSON-CONCEPT RELATIONSHIPS
-- =====================================================
-- Links each lesson to the concepts it covers

INSERT INTO lesson_concepts (lesson_id, concept_id, weight)
SELECT l.id, c.id, 1.0
FROM lessons l, concepts c
WHERE 
    -- Module 1: Jac Language Fundamentals
    (l.title = 'Introduction to Jaseci & Jac' AND c.name IN ('Jac Language', 'Nodes', 'Edges')) OR
    (l.title = 'Basic Syntax & Types' AND c.name IN ('Variables', 'Data Types', 'Type Annotations', 'Type Safety')) OR
    (l.title = 'Operators & Expressions' AND c.name IN ('Operators', 'Data Types')) OR
    (l.title = 'Control Flow' AND c.name = 'Control Flow') OR
    (l.title = 'Functions & Abilities' AND c.name IN ('Functions', 'Standard Library')) OR
    (l.title = 'Practice: Building a Calculator' AND c.name IN ('Functions', 'Control Flow', 'Operators', 'Type Safety')) OR
    
    -- Module 2: Nodes
    (l.title LIKE '%Understanding Nodes%' AND c.name IN ('Nodes', 'Node Declaration', 'Node Instantiation')) OR
    (l.title LIKE '%Node Attributes%' AND c.name IN ('Node Attributes', 'Node Declaration')) OR
    (l.title LIKE '%Node Relationships%' AND c.name IN ('Node Relationships', 'Nodes', 'Edges')) OR
    (l.title LIKE '%Built-in Node Types%' AND c.name IN ('Nodes', 'Standard Library')) OR
    (l.title LIKE '%Building a Data Model%' AND c.name IN ('Nodes', 'Node Attributes', 'Node Relationships')) OR
    
    -- Module 3: Edges
    (l.title LIKE '%Introduction to Edges%' AND c.name IN ('Edges', 'Edge Types')) OR
    (l.title LIKE '%Creating and Traversing Edges%' AND c.name IN ('Edge Patterns', 'Edge Traversal')) OR
    (l.title LIKE '%Edge Attributes%' AND c.name = 'Edge Attributes') OR
    (l.title LIKE '%Complex Edge Patterns%' AND c.name = 'Complex Edge Patterns') OR
    (l.title LIKE '%Social Network Graph%' AND c.name IN ('Edges', 'Edge Patterns', 'Graph Modeling')) OR
    
    -- Module 4: Walkers
    (l.title LIKE '%Walkers Basics%' AND c.name IN ('Walkers', 'Walker Syntax')) OR
    (l.title LIKE '%Walker Context%' AND c.name = 'Walker Context') OR
    (l.title LIKE '%Basic Graph Traversal%' AND c.name IN ('Graph Traversal', 'Visit Statement')) OR
    (l.title LIKE '%Walker States%' AND c.name IN ('Walker States', 'Walker Lifecycle')) OR
    (l.title LIKE '%Advanced Traversal%' AND c.name IN ('Complex Edge Patterns', 'Graph Traversal')) OR
    (l.title LIKE '%Walker Communication%' AND c.name = 'Walker Communication') OR
    (l.title LIKE '%Graph Algorithms%' AND c.name IN ('Graph Algorithms', 'Graph Traversal')) OR
    
    -- Module 5: Actions
    (l.title LIKE '%Built-in Actions%' AND c.name IN ('Actions', 'Standard Library Actions')) OR
    (l.title LIKE '%Creating Custom Actions%' AND c.name IN ('Custom Actions', 'Action Parameters')) OR
    (l.title LIKE '%Action Best Practices%' AND c.name IN ('Custom Actions', 'Best Practices')) OR
    
    -- Module 6: Spawn
    (l.title LIKE '%Spawn Mechanism%' AND c.name IN ('Spawn', 'Spawn Syntax')) OR
    (l.title LIKE '%Spawn Context%' AND c.name = 'Spawn Context') OR
    (l.title LIKE '%Walker Execution%' AND c.name = 'Walker Execution') OR
    
    -- Module 7: OSP
    (l.title LIKE '%OSP Fundamentals%' AND c.name IN ('OSP', 'Graph Modeling')) OR
    (l.title LIKE '%Modeling with OSP%' AND c.name IN ('Graph Modeling', 'Graph Relationships')) OR
    (l.title LIKE '%Knowledge Graphs%' AND c.name = 'Knowledge Graphs') OR
    (l.title LIKE '%Advanced OSP%' AND c.name IN ('OSP', 'Graph Algorithms', 'Spatial Queries')) OR
    
    -- Module 8: byLLM
    (l.title LIKE '%Introduction to byLLM%' AND c.name = 'byLLM') OR
    (l.title LIKE '%Generative AI%' AND c.name IN ('AI Generation', 'Prompt Engineering')) OR
    (l.title LIKE '%Analytical AI%' AND c.name = 'AI Analysis') OR
    (l.title LIKE '%AI-Powered Walkers%' AND c.name IN ('AI-Powered Walkers', 'Gemini Integration')) OR
    
    -- Module 9: Advanced
    (l.title LIKE '%Advanced Walker Patterns%' AND c.name = 'Advanced Walker Patterns') OR
    (l.title LIKE '%Graph Algorithms%' AND c.name IN ('Graph Algorithms', 'Performance Optimization')) OR
    (l.title LIKE '%Performance Optimization%' AND c.name = 'Performance Optimization') OR
    (l.title LIKE '%Testing%' AND c.name = 'Testing Walkers') OR
    (l.title LIKE '%Best Practices%' AND c.name IN ('Best Practices', 'Code Organization')) OR
    
    -- Module 10: Projects (cover multiple concepts)
    (l.title LIKE '%Task Management%' AND c.name IN ('Nodes', 'Edges', 'Walkers', 'Graph Modeling')) OR
    (l.title LIKE '%Recommendation Engine%' AND c.name IN ('Knowledge Graphs', 'Graph Algorithms', 'AI Analysis')) OR
    (l.title LIKE '%AI-Powered Learning%' AND c.name IN ('AI-Powered Walkers', 'Adaptive Learning', 'Mastery Tracking'))

ON CONFLICT DO NOTHING;

-- =====================================================
-- CONCEPT PREREQUISITES
-- =====================================================
-- Defines which concepts must be learned before others

INSERT INTO concept_prerequisites (prerequisite_id, dependent_id, strength)
SELECT p.id, d.id, 1.0
FROM concepts p, concepts d
WHERE 
    -- Fundamentals first
    (p.name = 'Variables' AND d.name IN ('Functions', 'Node Attributes', 'Walker Context')) OR
    (p.name = 'Data Types' AND d.name IN ('Type Annotations', 'Node Attributes')) OR
    (p.name = 'Control Flow' AND d.name IN ('Functions', 'Walker Syntax')) OR
    
    -- Nodes before Edges
    (p.name = 'Nodes' AND d.name IN ('Edges', 'Node Relationships')) OR
    (p.name = 'Node Declaration' AND d.name = 'Node Attributes') OR
    (p.name = 'Node Attributes' AND d.name = 'Node Relationships') OR
    
    -- Edges before Walkers
    (p.name = 'Edges' AND d.name IN ('Walkers', 'Edge Traversal')) OR
    (p.name = 'Edge Patterns' AND d.name = 'Edge Traversal') OR
    
    -- Walkers before Spawn
    (p.name = 'Walkers' AND d.name IN ('Spawn', 'Walker Execution')) OR
    (p.name = 'Walker Syntax' AND d.name = 'Spawn') OR
    
    -- Fundamentals before OSP
    (p.name = 'Nodes' AND d.name = 'OSP') OR
    (p.name = 'Edges' AND d.name = 'OSP') OR
    (p.name = 'Walkers' AND d.name = 'OSP') OR
    (p.name = 'Graph Traversal' AND d.name IN ('OSP', 'Graph Modeling')) OR
    
    -- OSP before Knowledge Graphs
    (p.name = 'OSP' AND d.name = 'Knowledge Graphs') OR
    (p.name = 'Graph Modeling' AND d.name = 'Knowledge Graphs') OR
    
    -- Fundamentals before byLLM
    (p.name = 'Walkers' AND d.name = 'byLLM') OR
    (p.name = 'Functions' AND d.name = 'AI-Powered Walkers') OR
    
    -- byLLM before AI features
    (p.name = 'byLLM' AND d.name IN ('AI Generation', 'AI Analysis')) OR
    (p.name = 'AI Generation' AND d.name = 'AI-Powered Walkers') OR
    
    -- Graph Traversal before Algorithms
    (p.name = 'Graph Traversal' AND d.name = 'Graph Algorithms') OR
    (p.name = 'Graph Algorithms' AND d.name = 'Performance Optimization')

ON CONFLICT DO NOTHING;

-- =====================================================
-- SEED DATA COMPLETE
-- =====================================================
-- Next steps:
-- 1. Run this SQL in Supabase
-- 2. Verify all lessons, concepts, and relationships
-- 3. Test learning path recommendations
-- 4. Populate OSP graph with concepts


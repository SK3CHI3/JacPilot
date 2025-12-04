-- Generated exercises SQL from JSON
-- Run this after loading lesson content

INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Create a Lesson Node',
    'Define a node type called ''lesson'' with the specified attributes. Use proper type annotations and default values where appropriate.',
    'node lesson {
    // Your code here
}',
    '[{"input": "Node definition", "expected_output": "Node with all required attributes", "description": "Verify node has all required attributes"}]'::jsonb,
    1,
    ARRAY[]::text[]
FROM lessons l
WHERE l.order_index = 7
  AND l.title = 'Understanding Nodes'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Node Attributes Exercise',
    'Complete this exercise to practice node attributes. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 8
  AND l.title = 'Node Attributes'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Node Relationships Exercise',
    'Complete this exercise to practice node relationships. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 9
  AND l.title = 'Node Relationships'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Built-in Node Types Exercise',
    'Complete this exercise to practice built-in node types. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 10
  AND l.title = 'Built-in Node Types'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Practice: Building a Data Model Exercise',
    'Complete this exercise to practice practice: building a data model. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 11
  AND l.title = 'Practice: Building a Data Model'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Introduction to Edges Exercise',
    'Complete this exercise to practice introduction to edges. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 12
  AND l.title = 'Introduction to Edges'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Creating and Traversing Edges Exercise',
    'Complete this exercise to practice creating and traversing edges. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 13
  AND l.title = 'Creating and Traversing Edges'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Edge Types and Patterns Exercise',
    'Complete this exercise to practice edge types and patterns. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 14
  AND l.title = 'Edge Types and Patterns'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Bidirectional Edges Exercise',
    'Complete this exercise to practice bidirectional edges. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 15
  AND l.title = 'Bidirectional Edges'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Practice: Building a Graph Exercise',
    'Complete this exercise to practice practice: building a graph. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 16
  AND l.title = 'Practice: Building a Graph'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Understanding Walkers Exercise',
    'Complete this exercise to practice understanding walkers. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 17
  AND l.title = 'Understanding Walkers'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Walker Parameters Exercise',
    'Complete this exercise to practice walker parameters. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 18
  AND l.title = 'Walker Parameters'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Walker Execution Exercise',
    'Complete this exercise to practice walker execution. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 19
  AND l.title = 'Walker Execution'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Walker Control Flow Exercise',
    'Complete this exercise to practice walker control flow. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 20
  AND l.title = 'Walker Control Flow'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Walker Abilities Exercise',
    'Complete this exercise to practice walker abilities. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 21
  AND l.title = 'Walker Abilities'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Practice: Building a Traversal Walker Exercise',
    'Complete this exercise to practice practice: building a traversal walker. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 22
  AND l.title = 'Practice: Building a Traversal Walker'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Graph Traversal Basics Exercise',
    'Complete this exercise to practice graph traversal basics. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 23
  AND l.title = 'Graph Traversal Basics'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Advanced Edge Patterns Exercise',
    'Complete this exercise to practice advanced edge patterns. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 24
  AND l.title = 'Advanced Edge Patterns'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Conditional Traversals Exercise',
    'Complete this exercise to practice conditional traversals. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 25
  AND l.title = 'Conditional Traversals'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Multi-hop Traversals Exercise',
    'Complete this exercise to practice multi-hop traversals. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 26
  AND l.title = 'Multi-hop Traversals'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Traversal Optimization Exercise',
    'Complete this exercise to practice traversal optimization. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 27
  AND l.title = 'Traversal Optimization'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Practice: Complex Graph Queries Exercise',
    'Complete this exercise to practice practice: complex graph queries. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 28
  AND l.title = 'Practice: Complex Graph Queries'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Introduction to OSP Exercise',
    'Complete this exercise to practice introduction to osp. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 29
  AND l.title = 'Introduction to OSP'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Spatial Relationships Exercise',
    'Complete this exercise to practice spatial relationships. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 30
  AND l.title = 'Spatial Relationships'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Graph Contexts Exercise',
    'Complete this exercise to practice graph contexts. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 31
  AND l.title = 'Graph Contexts'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Node Context Switching Exercise',
    'Complete this exercise to practice node context switching. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 32
  AND l.title = 'Node Context Switching'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'OSP Patterns Exercise',
    'Complete this exercise to practice osp patterns. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 33
  AND l.title = 'OSP Patterns'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Practice: OSP Application Exercise',
    'Complete this exercise to practice practice: osp application. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 34
  AND l.title = 'Practice: OSP Application'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Standard Library Exercise',
    'Complete this exercise to practice standard library. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 35
  AND l.title = 'Standard Library'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'File Operations Exercise',
    'Complete this exercise to practice file operations. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 36
  AND l.title = 'File Operations'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'HTTP Operations Exercise',
    'Complete this exercise to practice http operations. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 37
  AND l.title = 'HTTP Operations'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'JSON Operations Exercise',
    'Complete this exercise to practice json operations. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 38
  AND l.title = 'JSON Operations'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Error Handling Exercise',
    'Complete this exercise to practice error handling. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 39
  AND l.title = 'Error Handling'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Practice: Building an API Client Exercise',
    'Complete this exercise to practice practice: building an api client. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 40
  AND l.title = 'Practice: Building an API Client'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Introduction to byLLM Exercise',
    'Complete this exercise to practice introduction to byllm. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 41
  AND l.title = 'Introduction to byLLM'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Using byLLM in Walkers Exercise',
    'Complete this exercise to practice using byllm in walkers. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 42
  AND l.title = 'Using byLLM in Walkers'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'AI-Powered Content Generation Exercise',
    'Complete this exercise to practice ai-powered content generation. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 43
  AND l.title = 'AI-Powered Content Generation'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'AI Analysis and Evaluation Exercise',
    'Complete this exercise to practice ai analysis and evaluation. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 44
  AND l.title = 'AI Analysis and Evaluation'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Advanced AI Patterns Exercise',
    'Complete this exercise to practice advanced ai patterns. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 45
  AND l.title = 'Advanced AI Patterns'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Real-world AI Applications Exercise',
    'Complete this exercise to practice real-world ai applications. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 46
  AND l.title = 'Real-world AI Applications'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Practice: Building an AI Walker Exercise',
    'Complete this exercise to practice practice: building an ai walker. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 47
  AND l.title = 'Practice: Building an AI Walker'
ON CONFLICT DO NOTHING;
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    'Final Project: Complete Application Exercise',
    'Complete this exercise to practice final project: complete application. Follow the lesson content and implement the required functionality.',
    'walker exercise {
    with entry {
        // Your code here
        report "Complete this exercise";
    }
}',
    '[{"input": "Default input", "expected_output": "Expected output based on exercise requirements", "description": "Test case to verify exercise completion"}]'::jsonb,
    2,
    ARRAY['Review the lesson content for guidance', 'Check the official Jaseci documentation if needed']
FROM lessons l
WHERE l.order_index = 48
  AND l.title = 'Final Project: Complete Application'
ON CONFLICT DO NOTHING;
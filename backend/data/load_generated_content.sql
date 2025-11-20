-- Script to load generated lesson content and exercises
-- Run this AFTER running generate_lesson_content.py

-- First, load the updated lesson content
\i backend/data/generated_lesson_content.sql

-- Then, load practice exercises from JSON
-- Note: You'll need to convert the JSON exercises to SQL INSERT statements
-- or create a separate Python script to do this

-- Example structure for exercises (will be populated):
/*
INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    e.title,
    e.instructions,
    e.starter_code,
    e.test_cases::jsonb,
    e.difficulty,
    e.hints::text[]
FROM lessons l,
     json_populate_recordset(NULL::record, '[
         {
             "title": "Exercise 1",
             "instructions": "...",
             "starter_code": "...",
             "test_cases": [...],
             "difficulty": 2,
             "hints": ["Hint 1"]
         }
     ]'::json) AS e
WHERE l.order_index = [lesson_order];
*/


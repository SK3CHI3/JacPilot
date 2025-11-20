#!/usr/bin/env python3
"""
Convert generated exercises JSON to SQL INSERT statements
"""

import json
import os

def escape_sql_string(text: str) -> str:
    """Escape single quotes for SQL"""
    return text.replace("'", "''")

def convert_exercises_to_sql(json_file: str, output_file: str):
    """Convert exercises JSON to SQL"""
    
    with open(json_file, 'r', encoding='utf-8') as f:
        exercises = json.load(f)
    
    sql_statements = []
    
    for exercise in exercises:
        lesson_order = exercise['lesson_order']
        lesson_title = escape_sql_string(exercise['lesson_title'])
        
        # Convert test_cases to JSON string
        test_cases_json = json.dumps(exercise['test_cases'])
        test_cases_escaped = escape_sql_string(test_cases_json)
        
        # Convert hints to PostgreSQL array
        hints_array = "ARRAY[" + ", ".join([f"'{escape_sql_string(h)}'" for h in exercise.get('hints', [])]) + "]"
        if not exercise.get('hints'):
            hints_array = "ARRAY[]::text[]"
        
        sql = f"""INSERT INTO code_exercises (lesson_id, title, instructions, starter_code, test_cases, difficulty, hints)
SELECT 
    l.id,
    '{escape_sql_string(exercise['title'])}',
    '{escape_sql_string(exercise['instructions'])}',
    '{escape_sql_string(exercise['starter_code'])}',
    '{test_cases_escaped}'::jsonb,
    {exercise.get('difficulty', 2)},
    {hints_array}
FROM lessons l
WHERE l.order_index = {lesson_order}
  AND l.title = '{lesson_title}'
ON CONFLICT DO NOTHING;"""
        
        sql_statements.append(sql)
    
    # Write SQL file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("-- Generated exercises SQL from JSON\n")
        f.write("-- Run this after loading lesson content\n\n")
        f.write('\n'.join(sql_statements))
    
    print(f"✓ Converted {len(sql_statements)} exercises to SQL")
    print(f"✓ Output: {output_file}")

if __name__ == '__main__':
    json_file = 'backend/data/generated_exercises.json'
    output_file = 'backend/data/generated_exercises.sql'
    
    if not os.path.exists(json_file):
        print(f"ERROR: {json_file} not found!")
        print("Run generate_lesson_content.py first to generate exercises.")
        exit(1)
    
    convert_exercises_to_sql(json_file, output_file)


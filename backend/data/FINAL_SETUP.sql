-- =====================================================
-- FINAL SETUP - Complete JacPilot Database
-- =====================================================
-- This script loads all lesson content and exercises
-- Run this in Supabase SQL Editor after initial setup
--
-- Prerequisites:
-- 1. All 48 lessons should already exist (from all_48_lessons.sql)
-- 2. All 58 concepts should already exist (from concepts_complete.sql)
-- 3. Relationships should be set up (from complete_seed_data.sql)
--
-- =====================================================

-- Step 1: Update lesson content for lessons 7-48
-- (Lessons 1-6 already have detailed content)
\i complete_lesson_content.sql

-- Step 2: Load practice exercises
-- Make sure code_exercises table exists first
-- If hints column doesn't exist, you may need to modify the SQL
\i complete_exercises.sql

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check lesson content is updated
SELECT 
    order_index,
    title,
    CASE 
        WHEN LENGTH(content) > 500 THEN 'Has detailed content'
        ELSE 'Needs content'
    END as content_status,
    LENGTH(content) as content_length
FROM lessons
WHERE order_index >= 7
ORDER BY order_index;

-- Check exercises are loaded
SELECT 
    COUNT(*) as total_exercises,
    COUNT(DISTINCT lesson_id) as lessons_with_exercises
FROM code_exercises;

-- Check exercises per lesson
SELECT 
    l.order_index,
    l.title,
    COUNT(e.id) as exercise_count
FROM lessons l
LEFT JOIN code_exercises e ON l.id = e.lesson_id
WHERE l.order_index >= 7
GROUP BY l.order_index, l.title
ORDER BY l.order_index;

-- =====================================================
-- Success Criteria
-- =====================================================
-- After running this script:
-- ✅ All 48 lessons should have content (length > 500 chars)
-- ✅ All lessons 7-48 should have at least 1 exercise
-- ✅ Total exercises should be 42+
-- =====================================================


-- =====================================================
-- COMPLETE SEED DATA - LOAD INTO SUPABASE
-- =====================================================
-- Run this ENTIRE file in Supabase SQL Editor
-- URL: https://lrqtbfnpuzetqcvphycz.supabase.co
-- 
-- Steps:
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Click "New Query"
-- 3. Paste this entire file
-- 4. Click "Run" (or press Ctrl+Enter)
-- =====================================================

-- =====================================================
-- PART 1: LOAD ALL 48 LESSONS
-- =====================================================

-- First 6 detailed lessons (from all_lessons_complete.sql)
-- [Content from all_lessons_complete.sql would go here]

-- Then 42 template lessons (from all_48_lessons.sql)
-- [Content from all_48_lessons.sql would go here]

-- =====================================================
-- PART 2: LOAD ALL 58 CONCEPTS
-- =====================================================

-- [Content from concepts_complete.sql would go here]

-- =====================================================
-- PART 3: CREATE RELATIONSHIPS
-- =====================================================

-- [Content from complete_seed_data.sql would go here]

-- =====================================================
-- VERIFY DATA LOADED
-- =====================================================

SELECT 
    'Lessons' as table_name, 
    COUNT(*) as count 
FROM lessons
UNION ALL
SELECT 
    'Concepts' as table_name, 
    COUNT(*) as count 
FROM concepts
UNION ALL
SELECT 
    'Lesson-Concept Links' as table_name, 
    COUNT(*) as count 
FROM lesson_concepts
UNION ALL
SELECT 
    'Concept Prerequisites' as table_name, 
    COUNT(*) as count 
FROM concept_prerequisites;


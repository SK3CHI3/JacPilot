# 🚀 How to Load Data into Supabase

## Quick Steps

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `lrqtbfnpuzetqcvphycz`

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Load Data in Order:**

### Step 1: Load Lessons (48 lessons)
1. Open `backend/data/all_lessons_complete.sql` in your editor
2. Copy ALL content (Ctrl+A, Ctrl+C)
3. Paste into Supabase SQL Editor
4. Click "Run" (or press Ctrl+Enter)
5. ✅ Verify: Should insert 6 detailed lessons

6. Open `backend/data/all_48_lessons.sql` in your editor
7. Copy ALL content (Ctrl+A, Ctrl+C)
8. Paste into Supabase SQL Editor
9. Click "Run"
10. ✅ Verify: Should insert 42 template lessons

**Total: 48 lessons**

### Step 2: Load Concepts (58 concepts)
1. Open `backend/data/concepts_complete.sql` in your editor
2. Copy ALL content
3. Paste into Supabase SQL Editor
4. Click "Run"
5. ✅ Verify: Should insert 58 concepts

### Step 3: Create Relationships
1. Open `backend/data/complete_seed_data.sql` in your editor
2. Copy ALL content
3. Paste into Supabase SQL Editor
4. Click "Run"
5. ✅ Verify: Should create lesson-concept links and prerequisites

## ✅ Verify Everything Loaded

Run this in Supabase SQL Editor:

```sql
-- Check counts
SELECT 'Lessons' as type, COUNT(*) as count FROM lessons
UNION ALL
SELECT 'Concepts', COUNT(*) FROM concepts
UNION ALL
SELECT 'Lesson-Concept Links', COUNT(*) FROM lesson_concepts
UNION ALL
SELECT 'Prerequisites', COUNT(*) FROM concept_prerequisites;

-- View lessons
SELECT order_index, title, lesson_type, estimated_time 
FROM lessons 
ORDER BY order_index;

-- View concepts
SELECT name, category, difficulty_level 
FROM concepts 
ORDER BY category, difficulty_level;
```

**Expected Results:**
- ✅ Lessons: 48
- ✅ Concepts: 58
- ✅ Lesson-Concept Links: 200+ (varies)
- ✅ Prerequisites: 30+ (varies)

## 🎯 After Loading

1. **Refresh your frontend**
   - Lessons should now appear in the learning path
   - Concepts should be available

2. **Test the platform**
   - Navigate to Dashboard
   - Check Learning Path component
   - View lessons list

3. **Verify in frontend:**
   - Go to `/dashboard`
   - You should see all 48 lessons
   - Learning path should show lesson progression

## 🔧 Troubleshooting

**If SQL fails:**
- Check for syntax errors
- Make sure tables exist (run schema setup first)
- Check for duplicate key errors (ignore if using ON CONFLICT)

**If data doesn't appear:**
- Refresh Supabase dashboard
- Clear browser cache
- Restart frontend dev server
- Check browser console for errors

## 📝 Note

- First 6 lessons have **detailed content**
- Lessons 7-48 have **structured templates** (can be enhanced later)
- All concepts are **complete and ready**
- Relationships are **fully configured**

---

**Ready to load!** 🚀


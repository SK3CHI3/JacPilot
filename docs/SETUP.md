# JacPilot - Setup Guide

## 🎯 Quick Start

This guide will help you set up and run the JacPilot learning platform.

---

## ✅ Prerequisites

1. **Node.js** (v18+) and npm
2. **Python** (v3.8+) with pip
3. **Jaseci** installed (`pip install jaseci jaseci-serv`)
4. **Supabase Account** with a project created
5. **Gemini API Key** (for AI features)

---

## 📋 Step 1: Database Setup

### 1.1 Create Supabase Tables

All tables should already be created. If not, use the schema from `backend/seed_data.sql`.

### 1.2 Load Initial Data

**File**: `backend/data/FINAL_SETUP.sql`

1. Open Supabase SQL Editor
2. Copy and paste the entire contents of `FINAL_SETUP.sql`
3. Run the SQL script

This loads:
- 48 lessons
- 58 concepts
- Lesson-concept relationships
- Concept prerequisites

### 1.3 Load Lesson Content

**File**: `backend/data/complete_lesson_content.sql`

1. Open Supabase SQL Editor
2. Copy and paste the entire contents
3. Run the SQL script

This updates content for all 48 lessons.

### 1.4 Load Practice Exercises

**File**: `backend/data/complete_exercises.sql`

1. Open Supabase SQL Editor
2. Copy and paste the entire contents
3. Run the SQL script

This creates 42 practice exercises (one for each lesson 7-48).

### 1.5 Verify Database

```sql
-- Check lessons
SELECT COUNT(*) FROM lessons; -- Should be 48

-- Check concepts
SELECT COUNT(*) FROM concepts; -- Should be 58

-- Check exercises
SELECT COUNT(*) FROM code_exercises; -- Should be 42+

-- Check content
SELECT order_index, title, LENGTH(content) as content_length
FROM lessons
ORDER BY order_index;
```

---

## 🔑 Step 2: Environment Variables

### Frontend Environment

Create `frontend/.env`:

```env
# Jaseci API Configuration
VITE_JASECI_API_URL=http://localhost:8000
VITE_JASECI_API_KEY=

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend Environment

Create `backend/.env`:

```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
```

---

## 🚀 Step 3: Start Services

### 3.1 Start Jaseci Server (Port 8000)

```bash
cd backend
jsctl serv
```

Or use the batch file:
```bash
backend\start_server.bat
```

### 3.2 Start Gemini Proxy (Port 8001)

```bash
cd backend/helpers
python gemini_proxy.py
```

Or use the batch file:
```bash
backend\start_gemini_proxy.bat
```

### 3.3 Start Supabase Proxy (Port 8002)

```bash
cd backend/helpers
python supabase_proxy.py
```

### 3.4 Start Frontend (Port 5173)

```bash
cd frontend
npm install
npm run dev
```

### 3.5 Load Jaseci Files

```bash
cd backend
.\load_jac_files.bat
```

Or manually:
```bash
jsctl jac build backend/jac/main.jac
```

---

## ✅ Step 4: Testing Checklist

After starting all services, test:

- [ ] **Login/Signup** - Create a new user account
- [ ] **View Lessons** - Navigate to lessons page, verify all 48 lessons show
- [ ] **Lesson Content** - Click a lesson, verify content displays properly
- [ ] **Quiz Generation** - Generate a quiz for a lesson, verify AI generates questions
- [ ] **Answer Evaluation** - Submit an answer, verify AI evaluation works
- [ ] **Progress Tracking** - Complete a lesson, verify progress updates
- [ ] **Skill Map** - View skill map, verify concepts display
- [ ] **Code Exercises** - Navigate to code exercises, verify exercises load

---

## 🐛 Troubleshooting

### Issue: "code_exercises table doesn't exist"
**Solution**: Run the CREATE TABLE statement:
```sql
CREATE TABLE IF NOT EXISTS code_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(id),
    title TEXT NOT NULL,
    instructions TEXT,
    starter_code TEXT,
    test_cases JSONB,
    difficulty INTEGER DEFAULT 2,
    hints TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Issue: Services won't start
**Solution**: 
- Check ports 8000, 8001, 8002, 5173 are available
- Check environment variables are set
- Check Python dependencies: `pip install flask flask-cors`

### Issue: Gemini API errors
**Solution**:
- Verify `GEMINI_API_KEY` is set in environment
- Check API key is valid
- Check API quota/limits

### Issue: Database connection errors
**Solution**:
- Verify Supabase credentials in `.env` files
- Check Supabase project is active
- Verify RLS policies allow access

---

## 📊 Final Status

After completing setup:

✅ **48 Lessons** - All with detailed content  
✅ **58 Concepts** - All loaded  
✅ **42+ Exercises** - One per lesson (7-48)  
✅ **All Services** - Running and connected  
✅ **AI Integration** - Gemini API working  
✅ **Progress Tracking** - Functional  
✅ **Quiz Generation** - AI-powered  
✅ **Answer Evaluation** - AI-powered  

---

## 🎉 You're Done!

The project is now **100% complete** and ready to use!

**Next Steps**:
1. Test all features
2. Customize content as needed
3. Deploy to production (optional)

---

**Happy Learning! 🚀**


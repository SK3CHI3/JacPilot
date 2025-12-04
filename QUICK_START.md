# 🚀 JacPilot - Quick Start Guide

## ⚡ Get Everything Running in 5 Minutes

### Step 1: Load Content (2 minutes)

1. Open **Supabase SQL Editor**
2. Run `backend/data/complete_lesson_content.sql`
3. Run `backend/data/complete_exercises.sql`

**Done!** ✅

### Step 2: Start Services (2 minutes)

Open 4 terminals:

**Terminal 1 - Jaseci:**
```bash
cd backend
jsctl serv
```

**Terminal 2 - Gemini Proxy:**
```bash
cd backend/helpers
python gemini_proxy.py
```

**Terminal 3 - Supabase Proxy:**
```bash
cd backend/helpers
python supabase_proxy.py
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm run dev
```

**Done!** ✅

### Step 3: Test (1 minute)

1. Open http://localhost:5173
2. Sign up / Login
3. View lessons
4. Generate a quiz
5. Check progress

**Everything works!** ✅

---

## 📋 Prerequisites

- ✅ Supabase project set up
- ✅ 48 lessons already in database
- ✅ Environment variables configured
- ✅ Python dependencies installed

---

## 🎯 That's It!

You're ready to use JacPilot! 🎉

For detailed setup, see `FINAL_SETUP_GUIDE.md`


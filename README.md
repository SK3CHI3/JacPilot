# JacPilot - Interactive Learning Platform for Jaseci (Jac Lang
g)

A modern, gamified learning platform for mastering the Jac programming language and Jaseci framework. Built with React, TypeScript, Jaseci, and Supabase.

## 🎯 Features

- **Interactive Lessons**: Self-paced lessons on Jac/Jaseci concepts
- **Adaptive Quizzes**: AI-generated quizzes with difficulty adjustment
- **Code Editor**: In-browser coding exercises with real-time feedback
- **Skill Map**: Visual representation of learning progress
- **Personalized Learning**: AI-driven recommendations based on mastery
- **Progress Tracking**: Comprehensive analytics and statistics

## 🏗️ Architecture

```
Frontend (React + Vite + TypeScript)
    ↓ Spawn() calls via Jac Client
Backend (Jaseci + OSP + byLLM)
    ↓ Graph operations    ↓ Data persistence
OSP Graph              Supabase
```
 
## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+ (for Jaseci backend)
- Supabase account (for database)

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```env
VITE_JASECI_API_URL=http://localhost:8000
VITE_JASECI_API_KEY=your_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

5. Start development server:
```bash
npm run dev
```

### Backend Setup

1. Install Jaseci:
```bash
pip install jaseci jaseci-serv
```

2. Start Jaseci server:
```bash
jsctl serv
```

3. Load Jac files:
```bash
jsctl jac build backend/jac/main.jac
```

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migrations from `database/migrations/` (to be created)
3. Update your `.env` file with Supabase credentials

## 📁 Project Structure

```
JacPilot/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services (Jac Client, Supabase)
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── types/         # TypeScript types
│   └── package.json
├── backend/               # Jaseci/Jac backend
│   ├── jac/
│   │   ├── models/        # Data models
│   │   ├── walkers/       # Walker agents
│   │   └── graphs/        # OSP graph
│   └── config/
├── docs/                  # Documentation
└── README.md
```

## 🤖 Agents (Walkers)

1. **Learning Planner** - Recommends next lessons based on mastery
2. **Quiz Generator** - Creates adaptive quizzes using byLLM
3. **Answer Evaluator** - Evaluates answers and updates mastery graph
4. **Progress Tracker** - Tracks user progress and statistics
5. **Skill Analyzer** - Analyzes mastery graph for skill map

## 🎨 Design

- **Brand Colors**: Orange (#FF6B35) to Yellow (#FFD23F) gradient
- **Dark Theme**: Professional dark interface for dashboard
- **Light Theme**: Clean, modern homepage design
- **Gamification**: Progress bars, achievements, interactive elements

## 🛠️ Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Monaco Editor
- Recharts
- Supabase Client
- Zustand

### Backend
- Jaseci/Jac
- OSP (Object-Spatial Programming)
- byLLM

### Database
- Supabase (PostgreSQL)

## 📚 Documentation

See the `docs/` folder for detailed documentation:
- `PROJECT_PLAN.md` - Comprehensive project plan
- `FRONTEND_DESIGN_PLAN.md` - Frontend design specifications
- `AGENT_SPECIFICATIONS.md` - Agent implementation details
- `ARCHITECTURE_DECISIONS.md` - Design decisions


## 📝 License

CC0 1.0 Universal

## 🤝 Contributing

This is a hackathon project. Contributions welcome!

---

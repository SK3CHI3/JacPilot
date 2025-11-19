# JacPilot - Quick Reference Guide

## 🎯 Project Summary
Interactive Learning Platform for Jaseci using OSP graphs, byLLM agents, and Jac Client.

## 🏗️ Tech Stack at a Glance

| Component | Technology |
|-----------|-----------|
| **Backend Core** | Jac Language (Jaseci) |
| **Graph Database** | OSP (Object-Spatial Programming) |
| **AI/ML** | byLLM |
| **External DB** | Supabase (PostgreSQL) |
| **Frontend** | React + TypeScript + Vite |
| **Jac Integration** | Jac Client |
| **Code Editor** | Monaco Editor |
| **Graph Viz** | D3.js or vis.js |

## 🤖 Agents Overview

| Agent | Walker Name | byLLM Usage | Primary Function |
|-------|-------------|-------------|------------------|
| **Learning Planner** | `learning_planner` | Analytical | Recommends next lessons based on mastery |
| **Quiz Generator** | `quiz_generator` | Generative | Creates adaptive quizzes |
| **Answer Evaluator** | `answer_evaluator` | Analytical | Evaluates answers, updates mastery |
| **Progress Tracker** | `progress_tracker` | None | Records user progress |
| **Skill Analyzer** | `skill_analyzer` | Analytical | Generates skill map data |

## 🕸️ OSP Graph - Key Nodes

- **`user`** - User accounts
- **`concept`** - Learning concepts (Walkers, OSP, byLLM, etc.)
- **`lesson`** - Lesson content
- **`mastery`** - User proficiency scores per concept
- **`quiz`** - Generated quizzes

## 🔗 OSP Graph - Key Edges

- **`has_mastery`** - user → mastery
- **`mastery_of`** - mastery → concept
- **`covers`** - lesson → concept (with weight)
- **`prerequisite`** - concept → concept (dependency)
- **`completed`** - user → lesson
- **`recommends`** - concept → concept (AI recommendations)

## 🧠 byLLM Use Cases

### Generative
1. **Quiz Generation** - Create questions from lesson content
2. **Explanations** - Generate concept explanations
3. **Code Exercises** - Create coding challenges

### Analytical
1. **Answer Evaluation** - Score free-text answers
2. **Concept Classification** - Classify user input
3. **Learning Style Detection** - Analyze user patterns

## 📁 Key Directories

```
backend/jac/          - Jac source files
  ├── models/         - Data models
  ├── walkers/        - Agent walkers
  └── graphs/         - OSP initialization

frontend/src/
  ├── components/     - React components
  ├── services/       - Jac Client integration
  └── hooks/          - Custom hooks

database/             - Supabase migrations
```

## 🔄 Common Workflows

### Start Lesson
```
Frontend → spawn('learning_planner') → Check prerequisites → Return lesson
```

### Complete Quiz
```
Frontend → spawn('quiz_generator') → byLLM generates → User answers → 
spawn('answer_evaluator') → byLLM evaluates → Update OSP graph → 
Update skill map
```

### View Skill Map
```
Frontend → spawn('skill_analyzer') → Traverse mastery graph → 
Calculate scores → Return visualization data
```

## 📊 Evaluation Metrics

- Quiz score improvement
- Time to mastery
- Recommendation accuracy
- User engagement metrics
- byLLM output quality

## 🚀 Development Phases

1. **Foundation** (Days 1-2) - Setup
2. **Core Backend** (Days 3-4) - Models & basic walkers
3. **Multi-Agent** (Days 5-6) - All agents with byLLM
4. **Frontend Core** (Days 7-8) - Main components
5. **Advanced Features** (Days 9-10) - Skill map, dashboard
6. **Integration** (Days 11-12) - Testing & fixes
7. **Demo Prep** (Day 13) - Final polish

## ✅ Mandatory Requirements Checklist

- [x] Jac language core framework
- [x] OSP integration (non-trivial graph usage)
- [x] byLLM integration (generative + analytical)
- [x] Jac Client integration (Spawn() calls)
- [x] Multi-agent design (5 agents)
- [x] Clean code structure
- [x] README with setup
- [x] Demo video plan

## 🔑 Key Design Decisions

1. **OSP Graph** models mastery, not just stores data
2. **byLLM** used for both content generation AND evaluation
3. **Jac Client** enables direct walker calls from frontend
4. **Supabase** handles persistent user data, OSP handles reasoning
5. **Adaptive learning** driven by graph traversal and byLLM analysis


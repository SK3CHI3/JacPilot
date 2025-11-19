# JacPilot Backend

Jaseci/Jac backend for the JacPilot learning platform.

## Structure

```
backend/
├── jac/
│   ├── models/          # Data models (nodes, edges)
│   ├── walkers/         # Walker agents
│   └── graphs/          # OSP graph initialization
├── config/              # Configuration files
└── data/                # Seed data
```

## Setup

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

## Walkers

- `learning_planner` - Recommends next lessons
- `quiz_generator` - Generates adaptive quizzes
- `answer_evaluator` - Evaluates answers and updates mastery
- `progress_tracker` - Tracks user progress
- `skill_analyzer` - Analyzes mastery graph

## API Endpoints

The Jaseci server exposes REST API endpoints at `http://localhost:8000`

Key endpoint: `/js/walker_spawn` - Spawn walkers from frontend


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

1. Install Jaseci (if not already installed):
```bash
pip install jaseci jaseci-serv jaclang
```

2. Start Jaseci server:
```bash
# Windows
cd backend
start_server.bat

# Or manually:
jac serve jac/main.jac --host 0.0.0.0 --port 8000
```

The server will start on `http://localhost:8000`

## Walkers

- `learning_planner` - Recommends next lessons based on mastery
- `quiz_generator` - Generates adaptive quizzes using byLLM (Gemini)
- `answer_evaluator` - Evaluates answers and updates mastery
- `progress_tracker` - Tracks user progress
- `skill_analyzer` - Analyzes mastery graph

## API Endpoints

The Jaseci server (jaclang/jac_cloud) exposes REST API endpoints at `http://localhost:8000`

**Key Endpoints:**
- `/walker/{walker_name}` - Execute a walker (POST)
- `/walker/{walker_name}/{node_id}` - Execute walker from specific node (POST)
- `/docs` - Interactive API documentation (Swagger UI)
- `/openapi.json` - OpenAPI specification

**Example:**
```bash
POST http://localhost:8000/walker/learning_planner
Content-Type: application/json

{
  "user_id": "user123",
  "action": "plan_next_lesson"
}
```

**Note:** The new jaclang API format is different from the old Jaseci format:
- Old: `/js/walker_spawn` with `{"walker": "name", "ctx": {...}}`
- New: `/walker/{walker_name}` with context as request body directly

## Environment Variables

Set these in your `.env` file or environment:
- `VITE_JASECI_API_URL=http://localhost:8000` (frontend)
- `VITE_GEMINI_API_KEY=your_gemini_api_key` (for byLLM)

## Notes

- The server uses `jac serve` (from jaclang) which is the modern way to run Jaseci
- All walkers are configured to use Gemini Pro via byLLM
- The OSP graph is initialized when the server starts

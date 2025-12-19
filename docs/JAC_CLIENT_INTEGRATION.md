# Jac Client Integration

This document demonstrates how JacPilot uses Jac Client for frontend-backend interaction, as required by the Jaseci Hackathon.

## Overview

Jac Client is a mandatory part of the Jaseci stack that enables seamless communication between frontend and backend using the spawn/walker pattern. All frontend-backend interactions in JacPilot use Jac Client.

**Official Documentation**: https://docs.jaseci.org/jac-client/

## Implementation

### Frontend: Jac Client Service

**Location**: `frontend/src/services/jacClient.ts`

The Jac Client implementation provides the `jacSpawn()` function, which is the primary method for frontend-backend communication:

```typescript
/**
 * Jac Client: Spawn a walker on the Jaseci backend
 * 
 * This is the primary Jac Client function for frontend-backend communication.
 * It follows the official Jac Client pattern for spawning walkers.
 */
export async function jacSpawn<T = any>(
  walkerName: string,
  ctx: Record<string, any> = {},
  nodeId?: string
): Promise<WalkerResponse<T>>
```

### API Pattern

Jac Client uses the jaclang/jac_cloud API format:
- **Endpoint**: `/walker/{walker_name}`
- **Method**: POST
- **Body**: Context object passed directly as JSON
- **Authentication**: Bearer token via Authorization header

### Usage Examples

#### 1. Quiz Generation

```typescript
// Frontend calls Jac Client
const result = await jacSpawn('quiz_generator', {
  lesson_id: 'lesson-1',
  user_id: 'user-123'
})

// Backend walker executes and uses byLLM internally
// See: backend/jac/main.jac - quiz_generator walker
```

#### 2. Answer Evaluation

```typescript
// Frontend calls Jac Client
const result = await jacSpawn('answer_evaluator', {
  question_id: 'q1',
  user_answer: 'A walker traverses the graph',
  correct_answer: 'A walker is a graph traversal agent',
  question_context: { type: 'free_text' }
})

// Backend walker executes and uses byLLM for evaluation
// See: backend/jac/main.jac - answer_evaluator walker
```

#### 3. Learning Planning

```typescript
// Frontend calls Jac Client
const result = await jacSpawn('learning_planner', {
  user_id: 'user-123',
  action: 'plan_next_lesson'
})

// Backend walker analyzes mastery graph and recommends next lesson
// See: backend/jac/main.jac - learning_planner walker
```

## Walker Functions Using Jac Client

All of these functions use `jacSpawn()` internally:

| Function | Walker | Purpose |
|----------|--------|---------|
| `getNextLesson()` | `learning_planner` | Recommends next lesson based on mastery |
| `generateQuiz()` | `quiz_generator` | Generates adaptive quizzes (uses byLLM) |
| `evaluateAnswer()` | `answer_evaluator` | Evaluates answers (uses byLLM) |
| `getProgressSummary()` | `progress_tracker` | Tracks user progress |
| `getSkillMap()` | `skill_analyzer` | Generates skill map visualization |
| `recordLessonCompletion()` | `progress_tracker` | Records lesson completion |

## Backend Integration

### Walker Endpoints

The backend exposes walkers at:
- `POST /walker/{walker_name}` - Execute walker with context
- `POST /walker/{walker_name}/{node_id}` - Execute walker from specific node

### Example Request

```bash
POST http://localhost:8000/walker/quiz_generator
Content-Type: application/json
Authorization: Bearer {token}

{
  "lesson_id": "lesson-1",
  "user_id": "user-123"
}
```

### Example Response

```json
{
  "success": true,
  "quiz_id": "quiz-lesson-1-user-123",
  "difficulty": 2,
  "questions": [...],
  "raw_response": "{...byLLM generated content...}"
}
```

## Key Points

1. ✅ **All frontend-backend communication uses Jac Client** (`jacSpawn()`)
2. ✅ **No direct API calls** - Everything goes through walkers
3. ✅ **byLLM integration** - Walkers use byLLM internally for AI operations
4. ✅ **OSP Graph usage** - Walkers traverse and manipulate the graph
5. ✅ **Multi-agent design** - Each walker is a distinct agent with specific responsibilities

## Configuration

Set environment variables for Jac Client:

```env
# Frontend .env
VITE_JASECI_API_URL=http://localhost:8000
VITE_JASECI_API_KEY=your_api_key_here
```

## Compliance

✅ **Hackathon Requirement Met**: Jac Client is integrated and used for all frontend-backend interactions, following the official pattern documented at https://docs.jaseci.org/jac-client/


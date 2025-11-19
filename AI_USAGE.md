# AI Usage in JacPilot

This document describes where and how AI is used in the JacPilot application.

## Overview

JacPilot uses **Google's Gemini API** (via `byLLM` integration) for AI-powered features in both the frontend and backend.

## Backend AI Integration

### 1. Quiz Generator Walker (`backend/jac/main.jac`)
- **Location**: `backend/jac/main.jac` - `quiz_generator` walker
- **Purpose**: Generates quiz questions based on lesson content
- **AI Usage**: Calls Gemini API via HTTP proxy (`gemini_proxy.py`)
- **Endpoint**: `POST http://localhost:8001/generate_quiz_questions`
- **Input**: Lesson content, difficulty level, topics list
- **Output**: JSON with quiz questions, options, and correct answers

**Code Flow**:
```jac
walker quiz_generator {
    // Calls Gemini proxy via std.http.post
    response = std.http.post(
        url="http://localhost:8001/generate_quiz_questions",
        body={
            "lesson_content": lesson_content,
            "difficulty": difficulty,
            "topics": topics_list
        }
    );
}
```

### 2. Answer Evaluator Walker (`backend/jac/main.jac`)
- **Location**: `backend/jac/main.jac` - `answer_evaluator` walker
- **Purpose**: Evaluates user answers to quiz questions
- **AI Usage**: Calls Gemini API via HTTP proxy (`gemini_proxy.py`)
- **Endpoint**: `POST http://localhost:8001/evaluate_answer`
- **Input**: User answer, correct answer, question context
- **Output**: Score, correctness, feedback, strengths, improvements

**Code Flow**:
```jac
walker answer_evaluator {
    // Calls Gemini proxy via std.http.post
    response = std.http.post(
        url="http://localhost:8001/evaluate_answer",
        body={
            "user_answer": user_answer,
            "correct_answer": correct_answer,
            "context": question_context
        }
    );
}
```

### 3. Gemini Proxy (`backend/helpers/gemini_proxy.py`)
- **Location**: `backend/helpers/gemini_proxy.py`
- **Purpose**: Flask proxy service that mediates between Jac walkers and Gemini API
- **Port**: 8001
- **Endpoints**:
  - `POST /generate_quiz_questions` - Generates quiz questions
  - `POST /evaluate_answer` - Evaluates answers
  - `POST /evaluate_code` - Evaluates code (for future use)

## Frontend AI Integration

### 1. Code Evaluation (`frontend/src/services/gemini.ts`)
- **Location**: `frontend/src/services/gemini.ts`
- **Function**: `evaluateCode()`
- **Purpose**: Directly calls Gemini API to evaluate user code
- **Used In**: `frontend/src/components/lesson/LessonCard.tsx`
- **Input**: User code, expected behavior, context
- **Output**: Correctness, score, feedback, suggestions

**Usage**:
```typescript
import { evaluateCode } from '../../services/gemini'

const evaluation = await evaluateCode(
  code,
  expectedOutput,
  description
)
```

### 2. Quiz Generation (`frontend/src/services/gemini.ts`)
- **Location**: `frontend/src/services/gemini.ts`
- **Function**: `generateQuiz()`
- **Purpose**: Generates quiz questions directly from frontend
- **Status**: Available but currently not actively used (backend walker is preferred)

## AI Configuration

### Environment Variables
- **Frontend**: `VITE_GEMINI_API_KEY` in `frontend/.env`
- **Backend**: `GEMINI_API_KEY` in environment or `backend/helpers/gemini_proxy.py`

### API Endpoint
- **Gemini API**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`

## AI Use Cases

### 1. **Quiz Generation**
- Generates multiple-choice questions from lesson content
- Adapts difficulty based on user level
- Includes explanations for correct answers

### 2. **Answer Evaluation**
- Analyzes free-text answers (not just multiple-choice)
- Provides detailed feedback on correctness
- Identifies strengths and areas for improvement
- Scores answers on a 0.0-1.0 scale

### 3. **Code Evaluation**
- Evaluates user-submitted Jac code
- Checks for correctness and best practices
- Provides suggestions for improvement
- Supports both syntax and logic checking

## Current Status

✅ **Working**:
- Backend quiz generation via walker
- Backend answer evaluation via walker
- Frontend code evaluation
- Gemini proxy service

⚠️ **Partial**:
- Quiz generation may fall back to empty questions if Gemini proxy is down
- Code evaluation works but may need better integration with Jaseci backend

## Future Enhancements

1. **Learning Path Recommendations**: Use AI to suggest personalized learning paths
2. **Concept Explanations**: Generate explanations tailored to user level
3. **Code Exercise Generation**: Generate practice exercises automatically
4. **Adaptive Difficulty**: Adjust difficulty based on user performance patterns

## Notes

- All AI calls require a valid `GEMINI_API_KEY`
- The backend proxy (`gemini_proxy.py`) must be running on port 8001 for backend AI features
- Frontend can call Gemini directly or via backend walkers
- Backend walkers are preferred for consistency and to leverage Jaseci graph context


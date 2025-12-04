# Agent Interaction Diagram

## Overview

This document describes how the different agents (walkers) in JacPilot interact with each other and with external systems.

## Visual Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                        │
│                                                                 │
│  User Actions:                                                  │
│  • View Lesson                                                  │
│  • Complete Lesson                                              │
│  • Take Quiz                                                    │
│  • Submit Answer                                                │
│  • View Progress                                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ spawnWalker() calls
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Jaseci Backend (Jac)                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │             1. Learning Planner Agent                     │ │
│  │  Walker: learning_planner                                 │ │
│  │  Responsibility: Plan optimal learning path              │ │
│  │                                                           │ │
│  │  Input: user_id                                           │ │
│  │  Process:                                                 │ │
│  │    • Traverse user → mastery → concept graph             │ │
│  │    • Identify weak concepts (< 0.7 proficiency)           │ │
│  │    • Check prerequisites via reverse traversal            │ │
│  │    • Find eligible lessons                                │ │
│  │  Output: next_lesson_id, reason, estimated_time          │ │
│  │                                                           │ │
│  │  Called by: Frontend (getNextLesson)                     │ │
│  │  Calls: None (pure graph traversal)                      │ │
│  └──────────────────────────────────────────────────────────┘ │
│                         │                                       │
│                         │ (when quiz needed)                    │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │           2. Quiz Generator Agent                         │ │
│  │  Walker: quiz_generator                                   │ │
│  │  Responsibility: Generate adaptive quizzes               │ │
│  │                                                           │ │
│  │  Input: lesson_id, user_id                                │ │
│  │  Process:                                                 │ │
│  │    • Traverse lesson → concept graph                     │ │
│  │    • Analyze user → mastery for related concepts         │ │
│  │    • Calculate difficulty based on mastery               │ │
│  │    • Use byLLM.generate() to create quiz questions       │ │
│  │  Output: quiz_id, questions[], difficulty                │ │
│  │                                                           │ │
│  │  Called by: Frontend (generateQuiz)                      │ │
│  │  Calls: byLLM.generate() (generative AI)                  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                         │                                       │
│                         │ (when answer submitted)               │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │           3. Answer Evaluator Agent                       │ │
│  │  Walker: answer_evaluator                                 │ │
│  │  Responsibility: Evaluate answers & update mastery        │ │
│  │                                                           │ │
│  │  Input: question_id, user_answer, correct_answer, context │ │
│  │  Process:                                                 │ │
│  │    • Use byLLM.analyze() to evaluate answer              │ │
│  │    • Get score, feedback, strengths, improvements        │ │
│  │    • Update mastery graph (user → mastery → concept)     │ │
│  │    • Update proficiency_score, attempts_count, streak     │ │
│  │  Output: score, correct, feedback, strengths, improvements│ │
│  │                                                           │ │
│  │  Called by: Frontend (evaluateAnswer, submitQuiz)        │ │
│  │  Calls: byLLM.analyze() (analytical AI)                   │ │
│  │         Updates: mastery nodes in OSP graph               │ │
│  └──────────────────────────────────────────────────────────┘ │
│                         │                                       │
│                         │ (after evaluation)                   │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │           4. Progress Tracker Agent                      │ │
│  │  Walker: progress_tracker                                 │ │
│  │  Responsibility: Aggregate progress statistics           │ │
│  │                                                           │ │
│  │  Input: user_id, action                                   │ │
│  │  Process:                                                 │ │
│  │    • Traverse user → lesson (completed edges)           │ │
│  │    • Traverse user → quiz (attempted edges)              │ │
│  │    • Traverse user → mastery nodes                       │ │
│  │    • Aggregate statistics:                               │ │
│  │      - lessons_completed                                  │ │
│  │      - average_quiz_score                                 │ │
│  │      - mastered_concepts                                  │ │
│  │      - total_hours                                        │ │
│  │  Output: progress_summary                                 │ │
│  │                                                           │ │
│  │  Called by: Frontend (getProgressSummary)                │ │
│  │  Calls: None (pure graph aggregation)                    │ │
│  └──────────────────────────────────────────────────────────┘ │
│                         │                                       │
│                         │ (for skill map visualization)        │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │           5. Skill Analyzer Agent                         │ │
│  │  Walker: skill_analyzer                                   │ │
│  │  Responsibility: Generate skill map & identify weak areas │ │
│  │                                                           │ │
│  │  Input: user_id, action                                   │ │
│  │  Process:                                                 │ │
│  │    • Traverse user → mastery → concept graph             │ │
│  │    • Reverse traverse concept ← concept (prerequisites)  │ │
│  │    • Calculate proficiency for each concept              │ │
│  │    • Cluster concepts by status (mastered/in_progress)   │ │
│  │    • Identify weak areas (gap analysis)                 │ │
│  │  Output: nodes[], edges[], summary{}                     │ │
│  │                                                           │ │
│  │  Called by: Frontend (getSkillMap, getWeakAreas)         │ │
│  │  Calls: None (complex graph analysis)                    │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                         │
                         │ Graph operations
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      OSP Graph (In-Memory)                      │
│                                                                 │
│  Nodes:                                                         │
│  • user (user_id, email, name, stats)                          │
│  • concept (concept_id, name, description, category)            │
│  • lesson (lesson_id, title, content, order_index)             │
│  • mastery (mastery_id, proficiency_score, attempts_count)     │
│  • quiz (quiz_id, questions[], difficulty)                      │
│                                                                 │
│  Edges:                                                         │
│  • user → lesson (edge::completed, score, completed_at)         │
│  • user → quiz (edge::attempted, score, time_taken)             │
│  • user → mastery (implicit via mastery.user_id)                │
│  • mastery → concept (implicit via mastery.concept_id)          │
│  • lesson → concept (via lesson_concepts table)                 │
│  • concept ← concept (prerequisites, reverse traversal)         │
└─────────────────────────────────────────────────────────────────┘
                         │
                         │ Sync operations
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase (PostgreSQL)                        │
│                                                                 │
│  Tables:                                                        │
│  • users, lessons, concepts, quizzes                            │
│  • user_lesson_progress, quiz_attempts                          │
│  • mastery, lesson_concepts, concept_prerequisites              │
└─────────────────────────────────────────────────────────────────┘
                         │
                         │ AI API calls
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    byLLM (Gemini API)                          │
│                                                                 │
│  Generative Use:                                                │
│  • byllm.generate() - Quiz question generation                  │
│                                                                 │
│  Analytical Use:                                                │
│  • byllm.analyze() - Answer evaluation & feedback               │
└─────────────────────────────────────────────────────────────────┘
```

## Interaction Flow Examples

### Example 1: User Completes a Lesson

```
1. User clicks "Complete Lesson" in Frontend
   ↓
2. Frontend calls: spawnWalker('progress_tracker', {
     action: 'record_lesson_completion',
     user_id: '...',
     lesson_id: '...',
     score: 1.0
   })
   ↓
3. progress_tracker walker:
   - Finds user node and lesson node in OSP graph
   - Creates edge::completed from user → lesson
   - Updates user.total_lessons_completed
   - Calculates average_lesson_score
   ↓
4. Frontend calls: spawnWalker('learning_planner', {
     action: 'plan_next_lesson',
     user_id: '...'
   })
   ↓
5. learning_planner walker:
   - Traverses user → mastery → concept graph
   - Identifies weak concepts
   - Checks prerequisites via reverse traversal
   - Returns next_lesson_id
   ↓
6. Frontend navigates to next lesson
```

### Example 2: User Takes a Quiz

```
1. User clicks "Take Quiz" in Frontend
   ↓
2. Frontend calls: spawnWalker('quiz_generator', {
     lesson_id: '...',
     user_id: '...'
   })
   ↓
3. quiz_generator walker:
   - Traverses lesson → concept graph
   - Analyzes user → mastery for concepts
   - Calculates difficulty (1-4) based on mastery
   - Calls byllm.generate() with prompt
   ↓
4. byLLM returns quiz questions in JSON format
   ↓
5. quiz_generator returns questions to Frontend
   ↓
6. User submits answers
   ↓
7. Frontend calls: spawnWalker('answer_evaluator', {
     action: 'evaluate_answer',
     user_answer: '...',
     correct_answer: '...',
     question_context: {...}
   })
   ↓
8. answer_evaluator walker:
   - Calls byllm.analyze() with evaluation prompt
   ↓
9. byLLM returns: score, correct, feedback, strengths, improvements
   ↓
10. answer_evaluator:
    - Updates mastery graph (user → mastery → concept)
    - Updates proficiency_score, attempts_count, streak
   ↓
11. Frontend displays feedback and updates progress
```

### Example 3: User Views Skill Map

```
1. User navigates to Skill Map page
   ↓
2. Frontend calls: spawnWalker('skill_analyzer', {
     action: 'generate_skill_map',
     user_id: '...'
   })
   ↓
3. skill_analyzer walker:
   - Traverses user → mastery → concept graph
   - For each concept, reverse traverses prerequisites
   - Calculates proficiency scores
   - Clusters concepts by status
   - Builds nodes[] and edges[] for visualization
   ↓
4. Returns skill map data to Frontend
   ↓
5. Frontend renders interactive skill map visualization
```

## Agent Communication Patterns

### 1. Sequential Flow
- **Pattern**: Agent A → Agent B → Agent C
- **Example**: `learning_planner` → `quiz_generator` → `answer_evaluator`
- **Use Case**: Complete learning cycle

### 2. Independent Calls
- **Pattern**: Frontend calls multiple agents independently
- **Example**: `progress_tracker` and `skill_analyzer` called separately
- **Use Case**: Dashboard showing multiple statistics

### 3. Graph-Based Coordination
- **Pattern**: Agents share OSP graph state
- **Example**: `answer_evaluator` updates mastery, `skill_analyzer` reads it
- **Use Case**: Real-time skill map updates

## Key Design Decisions

1. **OSP Graph as Single Source of Truth**: All agents operate on the same in-memory graph
2. **byLLM for AI Operations**: Generative and analytical AI handled by byLLM
3. **Supabase for Persistence**: Graph state synced to Supabase for persistence
4. **Fallback Mechanism**: HTTP proxy used if byLLM unavailable
5. **Stateless Agents**: Agents don't maintain state between calls (except graph)

## Agent Responsibilities Summary

| Agent | Primary Responsibility | OSP Usage | byLLM Usage |
|-------|----------------------|-----------|-------------|
| Learning Planner | Recommend next lesson | Graph traversal, prerequisite checking | None |
| Quiz Generator | Generate adaptive quizzes | Analyze mastery graph | Generative (byllm.generate) |
| Answer Evaluator | Evaluate answers & update mastery | Update mastery nodes/edges | Analytical (byllm.analyze) |
| Progress Tracker | Aggregate statistics | Graph aggregation | None |
| Skill Analyzer | Generate skill map | Complex graph analysis | None |


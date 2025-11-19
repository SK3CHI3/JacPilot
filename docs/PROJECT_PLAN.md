# JacPilot - Interactive Learning Platform for Jaseci
## Hackathon Project Plan

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Project Structure](#project-structure)
4. [Multi-Agent Design](#multi-agent-design)
5. [OSP Graph Schema](#osp-graph-schema)
6. [byLLM Integration](#byllm-integration)
7. [Frontend Architecture](#frontend-architecture)
8. [Database Schema (Supabase)](#database-schema-supabase)
9. [Development Phases](#development-phases)
10. [Evaluation Metrics](#evaluation-metrics)
11. [Agent Interaction Diagram](#agent-interaction-diagram)

---

## 🎯 Project Overview

**JacPilot** is an adaptive, self-paced learning platform for the Jac programming language and Jaseci framework. The platform uses an Object-Spatial Programming (OSP) graph to model learner mastery, byLLM agents for content generation and assessment, and Jac Client for an interactive frontend experience.

### Core Features
- **Interactive Lessons**: Short, digestible lessons on Jac/Jaseci concepts
- **Adaptive Quizzes**: Auto-generated quizzes with difficulty adjustment
- **Mastery Tracking**: OSP graph-based skill mapping and progress visualization
- **Personalized Learning Path**: AI-driven recommendations for next topics
- **Code Editor**: In-browser coding exercises with real-time feedback
- **Skill Map Visualization**: Visual representation of mastered and weak areas

---

## 🏗️ Architecture & Technology Stack

### Backend
- **Core Framework**: Jac Language (Jaseci)
- **Graph Database**: OSP (Object-Spatial Programming) for knowledge graph
- **AI/ML**: byLLM for content generation and assessment
- **External Database**: Supabase (PostgreSQL) for user data, lessons, quiz results
- **API**: Jaseci REST API endpoints

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Jac Integration**: Jac Client (for Spawn() calls to walkers)
- **UI Library**: Tailwind CSS + shadcn/ui (or similar component library)
- **Code Editor**: Monaco Editor (VS Code editor in browser)
- **Graph Visualization**: D3.js or vis.js for skill map
- **State Management**: React Context API or Zustand

### Infrastructure
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: TBD (Railway, Vercel, or similar)
- **Version Control**: GitHub

---

## 📁 Project Structure

```
JacPilot/
├── backend/                    # Jac/Jaseci backend
│   ├── jac/                    # Jac source files
│   │   ├── models/             # Data models (nodes, edges)
│   │   │   ├── user.jac
│   │   │   ├── lesson.jac
│   │   │   ├── quiz.jac
│   │   │   └── mastery.jac
│   │   ├── walkers/            # Walker definitions
│   │   │   ├── learning_planner.jac
│   │   │   ├── quiz_generator.jac
│   │   │   ├── answer_evaluator.jac
│   │   │   ├── progress_tracker.jac
│   │   │   └── skill_analyzer.jac
│   │   ├── graphs/             # OSP graph initialization
│   │   │   └── knowledge_graph.jac
│   │   └── main.jac            # Entry point
│   ├── config/                 # Configuration files
│   │   └── jaseci_config.json
│   ├── data/                   # Seed data
│   │   ├── lessons.json
│   │   └── concepts.json
│   └── README.md
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Lesson/
│   │   │   ├── Quiz/
│   │   │   ├── CodeEditor/
│   │   │   ├── SkillMap/
│   │   │   ├── ProgressDashboard/
│   │   │   └── common/
│   │   ├── services/           # Jac Client integration
│   │   │   ├── jacClient.ts    # Spawn() wrapper
│   │   │   └── api.ts          # API utilities
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useWalker.ts
│   │   │   └── useMastery.ts
│   │   ├── types/              # TypeScript types
│   │   │   ├── jaseci.types.ts
│   │   │   └── domain.types.ts
│   │   ├── utils/              # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── database/                   # Supabase migrations
│   ├── migrations/
│   └── seed.sql
│
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md
│   ├── AGENT_DESIGN.md
│   └── API.md
│
├── scripts/                    # Utility scripts
│   ├── seed_data.js
│   └── setup.sh
│
├── .gitignore
├── README.md                   # Main project README
├── PROJECT_PLAN.md            # This file
└── LICENSE
```

---

## 🤖 Multi-Agent Design

### Agent 1: Learning Planner Agent
**Purpose**: Analyzes user's mastery graph and determines optimal learning path

**Responsibilities**:
- Traverse OSP graph to assess current mastery levels
- Identify knowledge gaps and prerequisites
- Recommend next lessons based on proficiency scores
- Unlock new content when prerequisites are met
- Adjust learning pace based on performance

**Walker**: `learning_planner`
**byLLM Usage**: Analytical - analyzes graph structure and generates recommendations

**Key Methods**:
- `plan_next_lesson(user_id)` → Returns recommended lesson
- `check_prerequisites(user_id, lesson_id)` → Validates if user can access lesson
- `calculate_learning_path(user_id)` → Generates personalized sequence

---

### Agent 2: Quiz Generator Agent
**Purpose**: Creates adaptive quizzes using byLLM based on lesson content and user level

**Responsibilities**:
- Generate quiz questions from lesson material
- Adjust difficulty based on user's mastery score
- Create multiple question types (MCQ, coding, free-text)
- Ensure questions align with learning objectives

**Walker**: `quiz_generator`
**byLLM Usage**: Generative - creates quiz questions and explanations

**Key Methods**:
- `generate_quiz(lesson_id, difficulty_level)` → Returns quiz object
- `generate_explanation(concept)` → Creates explanations for concepts
- `create_coding_exercise(topic, difficulty)` → Generates coding challenges

---

### Agent 3: Answer Evaluator Agent
**Purpose**: Evaluates user answers (especially free-text) and updates mastery graph

**Responsibilities**:
- Evaluate free-text answers using byLLM
- Score coding exercises
- Update mastery nodes in OSP graph
- Provide detailed feedback
- Trigger revision recommendations if needed

**Walker**: `answer_evaluator`
**byLLM Usage**: Analytical - classifies and scores answers

**Key Methods**:
- `evaluate_answer(question_id, user_answer)` → Returns score + feedback
- `update_mastery(user_id, concept_id, score)` → Updates OSP graph
- `generate_feedback(answer, correct_answer)` → Creates personalized feedback

---

### Agent 4: Progress Tracker Agent (Supporting)
**Purpose**: Records and aggregates user progress data

**Responsibilities**:
- Record lesson completions
- Track quiz attempts and scores
- Update user statistics
- Maintain progress history

**Walker**: `progress_tracker`
**byLLM Usage**: None (data aggregation only)

**Key Methods**:
- `record_lesson_completion(user_id, lesson_id)`
- `record_quiz_attempt(user_id, quiz_id, score)`
- `get_progress_summary(user_id)` → Returns progress stats

---

### Agent 5: Skill Analyzer Agent (Supporting)
**Purpose**: Analyzes OSP graph to generate skill map and identify weak areas

**Responsibilities**:
- Traverse mastery graph to calculate skill scores
- Identify clusters of strong/weak concepts
- Generate skill map data for visualization
- Detect learning patterns

**Walker**: `skill_analyzer`
**byLLM Usage**: Analytical - analyzes graph patterns

**Key Methods**:
- `analyze_mastery_graph(user_id)` → Returns skill scores
- `generate_skill_map(user_id)` → Returns visualization data
- `identify_weak_areas(user_id)` → Returns concepts needing revision

---

## 🕸️ OSP Graph Schema

### Node Types

#### 1. `user` Node
- **Attributes**:
  - `user_id` (string, unique)
  - `email` (string)
  - `name` (string)
  - `created_at` (timestamp)
  - `total_lessons_completed` (int)
  - `average_quiz_score` (float)

#### 2. `concept` Node
- **Attributes**:
  - `concept_id` (string, unique)
  - `name` (string) - e.g., "Walkers", "OSP", "byLLM"
  - `description` (string)
  - `difficulty_level` (int, 1-5)
  - `category` (string) - e.g., "Core", "Advanced", "Integration"

#### 3. `lesson` Node
- **Attributes**:
  - `lesson_id` (string, unique)
  - `title` (string)
  - `content` (text)
  - `order` (int)
  - `estimated_time` (int, minutes)
  - `lesson_type` (string) - "theory", "practice", "project"

#### 4. `mastery` Node
- **Attributes**:
  - `mastery_id` (string, unique)
  - `user_id` (string, reference)
  - `concept_id` (string, reference)
  - `proficiency_score` (float, 0.0-1.0)
  - `last_updated` (timestamp)
  - `attempts_count` (int)
  - `streak` (int) - consecutive correct answers

#### 5. `quiz` Node
- **Attributes**:
  - `quiz_id` (string, unique)
  - `lesson_id` (string, reference)
  - `difficulty` (int, 1-5)
  - `questions` (json)
  - `created_at` (timestamp)

### Edge Types

#### 1. `has_mastery` Edge
- **From**: `user` → **To**: `mastery`
- **Attributes**: None
- **Purpose**: Links users to their mastery records

#### 2. `mastery_of` Edge
- **From**: `mastery` → **To**: `concept`
- **Attributes**: None
- **Purpose**: Links mastery records to concepts

#### 3. `covers` Edge
- **From**: `lesson` → **To**: `concept`
- **Attributes**: `weight` (float) - how much the lesson covers this concept
- **Purpose**: Maps lessons to concepts they teach

#### 4. `prerequisite` Edge
- **From**: `concept` → **To**: `concept`
- **Attributes**: `strength` (float) - how critical the prerequisite is
- **Purpose**: Defines learning dependencies (e.g., "Walkers" requires "Nodes")

#### 5. `completed` Edge
- **From**: `user` → **To**: `lesson`
- **Attributes**: `completed_at` (timestamp), `score` (float)
- **Purpose**: Tracks lesson completions

#### 6. `attempted` Edge
- **From**: `user` → **To**: `quiz`
- **Attributes**: `attempted_at` (timestamp), `score` (float), `time_taken` (int)
- **Purpose**: Tracks quiz attempts

#### 7. `recommends` Edge
- **From**: `concept` → **To**: `concept`
- **Attributes**: `confidence` (float)
- **Purpose**: AI-generated recommendations for next concepts to learn

### Graph Reasoning Examples

1. **Prerequisite Checking**: 
   - Traverse `prerequisite` edges from target concept
   - Check if user has `mastery` nodes with `proficiency_score > 0.7` for all prerequisites

2. **Skill Gap Analysis**:
   - Find all `concept` nodes
   - For each, check if user has `mastery` with low `proficiency_score`
   - Cluster weak concepts to identify learning gaps

3. **Learning Path Generation**:
   - Start from user's current `mastery` nodes
   - Traverse `prerequisite` edges to find next learnable concepts
   - Use `proficiency_score` to prioritize concepts

4. **Adaptive Difficulty**:
   - Calculate average `proficiency_score` for related concepts
   - Adjust quiz difficulty based on mastery level

---

## 🧠 byLLM Integration

### Generative Use Cases

#### 1. Quiz Question Generation
```jac
walker quiz_generator {
    can byllm.generate;
    
    has lesson_content;
    has difficulty_level;
    
    question = byllm.generate(
        prompt="Generate a {difficulty_level} difficulty quiz question about: {lesson_content}. 
                Include 4 multiple choice options and the correct answer.",
        model="gpt-4"
    );
}
```

**Prompt Template**:
- Input: Lesson content, concept name, difficulty level
- Output: JSON with question, options, correct answer, explanation

#### 2. Concept Explanations
```jac
walker explain_concept {
    can byllm.generate;
    
    has concept_name;
    has user_level;
    
    explanation = byllm.generate(
        prompt="Explain '{concept_name}' in Jaseci for a {user_level} level learner. 
                Use examples and analogies.",
        model="gpt-4"
    );
}
```

#### 3. Code Exercise Generation
```jac
walker generate_exercise {
    can byllm.generate;
    
    has topic;
    has difficulty;
    
    exercise = byllm.generate(
        prompt="Create a coding exercise for Jaseci on '{topic}' at {difficulty} level. 
                Include starter code, instructions, and test cases.",
        model="gpt-4"
    );
}
```

### Analytical Use Cases

#### 1. Answer Evaluation (Free-text)
```jac
walker evaluate_answer {
    can byllm.analyze;
    
    has user_answer;
    has correct_answer;
    has question_context;
    
    evaluation = byllm.analyze(
        prompt="Evaluate this answer: '{user_answer}' 
                Correct answer: '{correct_answer}'
                Context: {question_context}
                Provide: score (0-1), feedback, and correctness (true/false)",
        model="gpt-4"
    );
}
```

**Output Format**:
```json
{
  "score": 0.85,
  "correct": true,
  "feedback": "Good understanding, but missed one detail...",
  "strengths": ["..."],
  "improvements": ["..."]
}
```

#### 2. Concept Classification
```jac
walker classify_concept {
    can byllm.analyze;
    
    has user_text;
    
    classification = byllm.analyze(
        prompt="Classify this user question/answer into Jaseci concepts: 
                {user_text}
                Return: list of relevant concept names",
        model="gpt-4"
    );
}
```

#### 3. Learning Style Detection
```jac
walker detect_learning_style {
    can byllm.analyze;
    
    has user_interactions; // JSON of user behavior
    
    style = byllm.analyze(
        prompt="Analyze user learning patterns: {user_interactions}
                Determine: preferred pace, content type, difficulty preference",
        model="gpt-4"
    );
}
```

### Prompt Documentation

All prompts will be documented in:
- `docs/PROMPTS.md` - Centralized prompt library
- Inline comments in walker code
- README section on byLLM usage

---

## 🎨 Frontend Architecture

### Component Structure

#### 1. **Lesson Component** (`Lesson/`)
- `LessonViewer.tsx` - Displays lesson content
- `LessonNavigation.tsx` - Previous/Next navigation
- `LessonProgress.tsx` - Progress indicator

**Jac Client Integration**:
```typescript
// services/jacClient.ts
export const spawnWalker = async (walkerName: string, ctx: any) => {
  return await jacClient.spawn(walkerName, ctx);
};

// Usage in component
const lesson = await spawnWalker('get_lesson', { lesson_id });
```

#### 2. **Quiz Component** (`Quiz/`)
- `QuizViewer.tsx` - Displays quiz questions
- `QuizTimer.tsx` - Timer component
- `QuizResults.tsx` - Results and feedback

**Jac Client Integration**:
```typescript
// Generate quiz
const quiz = await spawnWalker('quiz_generator', {
  lesson_id,
  difficulty_level: userLevel
});

// Submit answer
const result = await spawnWalker('answer_evaluator', {
  question_id,
  user_answer
});
```

#### 3. **Code Editor Component** (`CodeEditor/`)
- `MonacoEditor.tsx` - Monaco editor wrapper
- `CodeRunner.tsx` - Execute Jac code (via backend)
- `CodeFeedback.tsx` - Display results

**Jac Client Integration**:
```typescript
// Execute code
const result = await spawnWalker('execute_code', {
  code: userCode,
  exercise_id
});
```

#### 4. **Skill Map Component** (`SkillMap/`)
- `SkillMapVisualization.tsx` - D3.js/vis.js graph
- `SkillNode.tsx` - Individual concept node
- `SkillLegend.tsx` - Legend and filters

**Jac Client Integration**:
```typescript
// Get skill map data
const skillData = await spawnWalker('skill_analyzer', {
  user_id,
  action: 'generate_skill_map'
});
```

#### 5. **Progress Dashboard** (`ProgressDashboard/`)
- `ProgressStats.tsx` - Overall statistics
- `LearningPath.tsx` - Recommended path
- `Achievements.tsx` - Badges and milestones

**Jac Client Integration**:
```typescript
// Get progress
const progress = await spawnWalker('progress_tracker', {
  user_id,
  action: 'get_progress_summary'
});

// Get recommendations
const recommendations = await spawnWalker('learning_planner', {
  user_id,
  action: 'plan_next_lesson'
});
```

### State Management

**User Context**:
```typescript
// contexts/UserContext.tsx
interface UserState {
  user: User | null;
  mastery: MasteryMap;
  currentLesson: Lesson | null;
  progress: ProgressStats;
}
```

**Walker Hooks**:
```typescript
// hooks/useWalker.ts
export const useWalker = (walkerName: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const spawn = async (ctx: any) => {
    setLoading(true);
    try {
      const result = await jacClient.spawn(walkerName, ctx);
      return result;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  return { spawn, loading, error };
};
```

### Routing

- `/` - Dashboard/Home
- `/lessons` - Lesson list
- `/lessons/:id` - Lesson viewer
- `/quiz/:id` - Quiz interface
- `/code/:exercise_id` - Code editor
- `/skills` - Skill map visualization
- `/progress` - Progress dashboard
- `/profile` - User profile

---

## 🗄️ Database Schema (Supabase)

### Tables

#### 1. `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  jaseci_user_id TEXT UNIQUE, -- Links to Jaseci user node
  auth_user_id UUID REFERENCES auth.users(id)
);
```

#### 2. `lessons`
```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER,
  estimated_time INTEGER, -- minutes
  lesson_type TEXT, -- 'theory', 'practice', 'project'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. `concepts`
```sql
CREATE TABLE concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  category TEXT,
  jaseci_concept_id TEXT UNIQUE -- Links to OSP concept node
);
```

#### 4. `lesson_concepts` (Junction Table)
```sql
CREATE TABLE lesson_concepts (
  lesson_id UUID REFERENCES lessons(id),
  concept_id UUID REFERENCES concepts(id),
  weight FLOAT DEFAULT 1.0,
  PRIMARY KEY (lesson_id, concept_id)
);
```

#### 5. `concept_prerequisites` (Junction Table)
```sql
CREATE TABLE concept_prerequisites (
  prerequisite_id UUID REFERENCES concepts(id),
  dependent_id UUID REFERENCES concepts(id),
  strength FLOAT DEFAULT 1.0,
  PRIMARY KEY (prerequisite_id, dependent_id)
);
```

#### 6. `user_lesson_progress`
```sql
CREATE TABLE user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  lesson_id UUID REFERENCES lessons(id),
  completed_at TIMESTAMP,
  score FLOAT,
  time_spent INTEGER, -- seconds
  UNIQUE(user_id, lesson_id)
);
```

#### 7. `quizzes`
```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id),
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
  questions JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  jaseci_quiz_id TEXT UNIQUE -- Links to OSP quiz node
);
```

#### 8. `quiz_attempts`
```sql
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  quiz_id UUID REFERENCES quizzes(id),
  score FLOAT,
  time_taken INTEGER, -- seconds
  attempted_at TIMESTAMP DEFAULT NOW(),
  answers JSONB -- Store user answers
);
```

#### 9. `code_exercises`
```sql
CREATE TABLE code_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id),
  title TEXT NOT NULL,
  instructions TEXT,
  starter_code TEXT,
  test_cases JSONB,
  difficulty INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 10. `code_submissions`
```sql
CREATE TABLE code_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  exercise_id UUID REFERENCES code_exercises(id),
  code TEXT,
  passed_tests INTEGER,
  total_tests INTEGER,
  submitted_at TIMESTAMP DEFAULT NOW()
);
```

### Supabase Functions (Edge Functions)

1. **Sync OSP Graph**: Periodically sync Supabase data to OSP graph
2. **Webhook Handlers**: Handle Jaseci webhooks for real-time updates

---

## 🚀 Development Phases

### Phase 1: Foundation Setup (Days 1-2)
- [ ] Initialize project structure
- [ ] Set up Jac backend with basic models
- [ ] Set up React + Vite frontend
- [ ] Configure Supabase database
- [ ] Set up Jac Client integration
- [ ] Create basic OSP graph structure

### Phase 2: Core Backend (Days 3-4)
- [ ] Implement user, lesson, concept models
- [ ] Create OSP graph initialization walker
- [ ] Implement progress_tracker walker
- [ ] Set up Jaseci API endpoints
- [ ] Create seed data scripts

### Phase 3: Multi-Agent Implementation (Days 5-6)
- [ ] Implement learning_planner agent
- [ ] Implement quiz_generator agent (with byLLM)
- [ ] Implement answer_evaluator agent (with byLLM)
- [ ] Implement skill_analyzer agent
- [ ] Test agent interactions

### Phase 4: Frontend Core (Days 7-8)
- [ ] Build lesson viewer component
- [ ] Build quiz component
- [ ] Build code editor component
- [ ] Implement Jac Client service layer
- [ ] Set up routing

### Phase 5: Advanced Features (Days 9-10)
- [ ] Build skill map visualization
- [ ] Build progress dashboard
- [ ] Implement adaptive learning logic
- [ ] Add real-time progress updates
- [ ] Polish UI/UX

### Phase 6: Integration & Testing (Days 11-12)
- [ ] End-to-end testing
- [ ] Fix integration issues
- [ ] Performance optimization
- [ ] Error handling improvements
- [ ] Documentation completion

### Phase 7: Demo Preparation (Day 13)
- [ ] Record demo video
- [ ] Prepare presentation
- [ ] Final bug fixes
- [ ] README finalization

---

## 📊 Evaluation Metrics

### Quantitative Metrics

1. **Learning Effectiveness**:
   - Average quiz score improvement over time
   - Time to mastery (proficiency_score > 0.8)
   - Lesson completion rate

2. **Adaptive Learning Quality**:
   - Recommendation accuracy (user follows recommendations)
   - Difficulty adjustment effectiveness (quiz scores vs difficulty)
   - Prerequisite validation accuracy

3. **User Engagement**:
   - Daily active users
   - Average session duration
   - Lessons completed per user

4. **System Performance**:
   - Walker execution time
   - byLLM response time
   - OSP graph query performance

### Qualitative Metrics

1. **User Satisfaction**:
   - User feedback on quiz quality
   - Feedback on learning path recommendations
   - Overall platform usability

2. **Content Quality**:
   - byLLM-generated quiz relevance
   - Answer evaluation accuracy (manual review)
   - Concept explanation clarity

3. **Graph Reasoning Quality**:
   - Skill map accuracy (manual validation)
   - Prerequisite detection correctness
   - Learning path coherence

### Evaluation Plan

1. **Seed Data**: Create 10-15 test users with varying progress levels
2. **Test Scenarios**: 
   - New user onboarding
   - Mid-level user progression
   - Advanced user skill gap identification
3. **Manual Review**: Sample of byLLM outputs for quality check
4. **User Testing**: 3-5 beta testers provide feedback

---

## 🔄 Agent Interaction Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Action                           │
│              (e.g., "Start Lesson", "Submit Quiz")           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Jac Client)                     │
│              Spawn() calls to backend walkers                │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌───────────────┐ ┌──────────────┐ ┌──────────────┐
│  Learning     │ │   Quiz       │ │   Answer     │
│  Planner      │ │   Generator  │ │   Evaluator  │
│  Agent        │ │   Agent      │ │   Agent      │
└───────┬───────┘ └──────┬───────┘ └──────┬───────┘
        │                │                │
        │                │                │
        ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                    OSP Knowledge Graph                       │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐                │
│  │  User   │───▶│ Mastery │───▶│ Concept │                │
│  └─────────┘    └─────────┘    └─────────┘                │
│       │              │                │                     │
│       │              │                │                     │
│       ▼              ▼                ▼                     │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐                │
│  │ Lesson  │    │  Quiz   │    │Prereq   │                │
│  └─────────┘    └─────────┘    └─────────┘                │
└─────────────────────────────────────────────────────────────┘
        │                │                │
        │                │                │
        ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                    byLLM Integration                        │
│  • Generative: Quiz questions, explanations                 │
│  • Analytical: Answer evaluation, classification            │
└─────────────────────────────────────────────────────────────┘
        │                │                │
        │                │                │
        ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│              Progress Tracker & Skill Analyzer               │
│         (Supporting agents for data aggregation)             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Database                         │
│         (Persistent storage for user data)                   │
└─────────────────────────────────────────────────────────────┘
```

### Interaction Flow Examples

#### Flow 1: User Starts a Lesson
1. Frontend calls `spawn('learning_planner', {user_id, action: 'get_next_lesson'})`
2. Learning Planner traverses OSP graph to check prerequisites
3. Returns recommended lesson
4. Frontend displays lesson content
5. Progress Tracker records lesson start

#### Flow 2: User Completes Quiz
1. Frontend calls `spawn('quiz_generator', {lesson_id, difficulty})`
2. Quiz Generator uses byLLM to generate questions
3. User submits answers
4. Frontend calls `spawn('answer_evaluator', {answers})`
5. Answer Evaluator uses byLLM to evaluate free-text answers
6. Answer Evaluator updates mastery nodes in OSP graph
7. Skill Analyzer recalculates skill scores
8. Learning Planner generates new recommendations
9. Frontend displays results and updated skill map

#### Flow 3: Skill Map Visualization
1. Frontend calls `spawn('skill_analyzer', {user_id, action: 'generate_skill_map'})`
2. Skill Analyzer traverses mastery graph
3. Calculates proficiency scores for all concepts
4. Identifies clusters and relationships
5. Returns graph data for visualization
6. Frontend renders interactive skill map

---

## 📝 Next Steps

1. **Review this plan** with team
2. **Set up development environment**:
   - Install Jaseci
   - Set up Supabase project
   - Initialize React + Vite project
3. **Create GitHub repository** structure
4. **Begin Phase 1** implementation

---

## 🎯 Success Criteria

✅ All mandatory technical requirements met:
- [x] Jac language as core framework
- [x] OSP integration (knowledge graph)
- [x] byLLM integration (generative + analytical)
- [x] Jac Client integration (frontend)
- [x] Multi-agent design (5 agents)
- [x] Clean code structure
- [x] Comprehensive documentation

✅ Demo-ready features:
- [x] Interactive lessons
- [x] Adaptive quizzes
- [x] Skill map visualization
- [x] Personalized learning path
- [x] Code editor integration

---

**Status**: 📋 Planning Complete - Ready for Implementation Review


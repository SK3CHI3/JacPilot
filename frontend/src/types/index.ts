// User Types
export interface User {
  id: string
  email: string
  name: string
  role: 'Student' | 'Instructor' | 'Admin'
  jaseci_user_id?: string
  created_at: string
  total_lessons_completed: number
  average_quiz_score: number
  level: number
}

// Lesson Types
export interface Lesson {
  id: string
  title: string
  content: string
  order: number
  estimated_time: number // minutes
  lesson_type: 'theory' | 'practice' | 'project'
  concepts: Concept[]
  created_at: string
  updated_at: string
}

// Concept Types
export interface Concept {
  id: string
  name: string
  description: string
  difficulty_level: number // 1-5
  category: string
  jaseci_concept_id?: string
}

// Mastery Types
export interface Mastery {
  id: string
  user_id: string
  concept_id: string
  proficiency_score: number // 0.0 - 1.0
  last_updated: string
  attempts_count: number
  streak: number
}

// Quiz Types
export interface Quiz {
  id: string
  lesson_id: string
  difficulty: number // 1-5
  questions: Question[]
  created_at: string
  jaseci_quiz_id?: string
}

export interface Question {
  id: string
  type: 'multiple_choice' | 'free_text' | 'coding'
  question: string
  options?: string[] // For multiple choice
  correct_answer: string
  explanation?: string
  max_score: number
}

export interface QuizAttempt {
  id: string
  user_id: string
  quiz_id: string
  score: number
  time_taken: number // seconds
  attempted_at: string
  answers: Record<string, string>
}

// Code Exercise Types
export interface CodeExercise {
  id: string
  lesson_id: string
  title: string
  instructions: string
  starter_code: string
  test_cases: TestCase[]
  difficulty: number
  created_at: string
}

export interface TestCase {
  input: string
  expected_output: string
  description?: string
}

export interface CodeSubmission {
  id: string
  user_id: string
  exercise_id: string
  code: string
  passed_tests: number
  total_tests: number
  submitted_at: string
}

// Progress Types
export interface ProgressStats {
  lessons_completed: number
  average_quiz_score: number
  mastered_concepts: number
  total_concepts: number
  mastery_percentage: number
  current_streak: number
  total_hours: number
}

// Skill Map Types
export interface SkillMapNode {
  id: string
  label: string
  proficiency: number
  category: string
  color: string
}

export interface SkillMapEdge {
  from: string
  to: string
  type: 'prerequisite' | 'recommendation'
}

export interface SkillMapData {
  nodes: SkillMapNode[]
  edges: SkillMapEdge[]
  summary: {
    total_concepts: number
    mastered: number
    in_progress: number
    not_started: number
  }
}

// Walker Response Types
export interface WalkerResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Activity Types
export interface ActivityData {
  day: string
  value: number
  completed: boolean
}

// Training Types
export interface Training {
  title: string
  value: string
  unit: string
  progress: number
  color: 'green' | 'yellow' | 'blue'
}

// Jac Client Types
export interface SpawnContext {
  walker: string
  ctx?: Record<string, any>
  node?: string
}

export interface SpawnResult<T = any> {
  report: T[]
  success: boolean
  error?: string
}


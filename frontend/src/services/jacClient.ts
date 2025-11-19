/**
 * Jac Client Service
 * Handles communication with Jaseci backend via Spawn() calls
 */

import type { SpawnContext, SpawnResult, WalkerResponse } from '../types'

// Configuration - will be set via environment variables
const JASECI_API_URL = import.meta.env.VITE_JASECI_API_URL || 'http://localhost:8000'
const JASECI_API_KEY = import.meta.env.VITE_JASECI_API_KEY || ''

/**
 * Spawn a walker on the Jaseci backend
 * @param walkerName - Name of the walker to spawn
 * @param ctx - Context object to pass to the walker
 * @param nodeId - Optional node ID to spawn from
 * @returns Promise with walker response
 */
export async function spawnWalker<T = any>(
  walkerName: string,
  ctx: Record<string, any> = {},
  nodeId?: string
): Promise<WalkerResponse<T>> {
  try {
    const spawnContext: SpawnContext = {
      walker: walkerName,
      ctx,
      ...(nodeId && { node: nodeId }),
    }

    const response = await fetch(`${JASECI_API_URL}/js/walker_spawn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(JASECI_API_KEY && { Authorization: `Bearer ${JASECI_API_KEY}` }),
      },
      body: JSON.stringify(spawnContext),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: SpawnResult<T> = await response.json()

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Walker execution failed',
      }
    }

    return {
      success: true,
      data: (Array.isArray(result.report) ? result.report[0] : result.report) as T,
    }
  } catch (error) {
    console.error('Error spawning walker:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Get a lesson by ID
 */
export async function getLesson(lessonId: string) {
  return spawnWalker('get_lesson', { lesson_id: lessonId })
}

/**
 * Get next recommended lesson for user
 */
export async function getNextLesson(userId: string) {
  return spawnWalker('learning_planner', {
    user_id: userId,
    action: 'plan_next_lesson',
  })
}

/**
 * Generate a quiz for a lesson
 */
export async function generateQuiz(lessonId: string, userId: string) {
  return spawnWalker('quiz_generator', {
    lesson_id: lessonId,
    user_id: userId,
  })
}

/**
 * Evaluate a quiz answer
 */
export async function evaluateAnswer(
  questionId: string,
  userAnswer: string,
  correctAnswer: string,
  questionContext: any
) {
  return spawnWalker('answer_evaluator', {
    question_id: questionId,
    user_answer: userAnswer,
    correct_answer: correctAnswer,
    question_context: questionContext,
  })
}

/**
 * Submit a quiz attempt
 */
export async function submitQuiz(
  userId: string,
  quizId: string,
  answers: Record<string, string>
) {
  return spawnWalker('answer_evaluator', {
    user_id: userId,
    quiz_id: quizId,
    answers,
    action: 'evaluate_quiz',
  })
}

/**
 * Get user progress summary
 */
export async function getProgressSummary(userId: string) {
  return spawnWalker('progress_tracker', {
    user_id: userId,
    action: 'get_progress_summary',
  })
}

/**
 * Record lesson completion
 */
export async function recordLessonCompletion(
  userId: string,
  lessonId: string,
  score: number
) {
  return spawnWalker('progress_tracker', {
    user_id: userId,
    lesson_id: lessonId,
    score,
    action: 'record_lesson_completion',
  })
}

/**
 * Get skill map data for user
 */
export async function getSkillMap(userId: string) {
  return spawnWalker('skill_analyzer', {
    user_id: userId,
    action: 'generate_skill_map',
  })
}

/**
 * Get weak areas for user
 */
export async function getWeakAreas(userId: string) {
  return spawnWalker('skill_analyzer', {
    user_id: userId,
    action: 'identify_weak_areas',
  })
}

/**
 * Execute code in Jaseci backend
 */
export async function executeCode(code: string, exerciseId?: string) {
  return spawnWalker('execute_code', {
    code,
    exercise_id: exerciseId,
  })
}


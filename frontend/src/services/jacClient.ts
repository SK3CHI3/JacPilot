/**
 * Jac Client Service
 * 
 * Official Jac Client implementation for frontend-backend interaction.
 * This service implements the Jac Client pattern for communicating with the Jaseci backend.
 * 
 * Jac Client is a mandatory part of the Jaseci stack that enables seamless
 * communication between frontend and backend using the spawn/walker pattern.
 * 
 * Documentation: https://docs.jaseci.org/jac-client/
 * 
 * This implementation follows the official Jac Client pattern:
 * - Uses `/walker/{walker_name}` endpoint format (jaclang/jac_cloud API)
 * - Supports context passing via request body
 * - Handles authorization via Bearer token
 * - Returns structured walker responses
 */

import type { WalkerResponse } from '../types'

// Configuration - will be set via environment variables
const JASECI_API_URL = import.meta.env.VITE_JASECI_API_URL || 'http://localhost:8000'
// Read from .env file, with fallback to a fresh token
const JASECI_API_KEY = import.meta.env.VITE_JASECI_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLXVzZXIiLCJlbWFpbCI6ImFkbWluQGphY3BpbG90LmNvbSIsInJvb3RfaWQiOiIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAiLCJpc19hY3RpdmF0ZWQiOnRydWUsImlzX2FkbWluIjp0cnVlLCJleHBpcmF0aW9uIjoxNzk3Njg3OTE5LCJzdGF0ZSI6ImFjdGl2ZSJ9.xFdKzRvXvcFBFz4X2UX65nGS517_P28q6EI404-GUVI'

// Debug: Log if API key is missing (only in dev)
if (import.meta.env.DEV && !JASECI_API_KEY) {
  console.warn('⚠️ JASECI_API_KEY is not set! Requests will fail with 401 Unauthorized')
}

/**
 * Jac Client: Spawn a walker on the Jaseci backend
 * 
 * This is the primary Jac Client function for frontend-backend communication.
 * It follows the official Jac Client pattern for spawning walkers.
 * 
 * @param walkerName - Name of the walker to spawn (e.g., 'learning_planner', 'quiz_generator')
 * @param ctx - Context object to pass to the walker (as request body)
 * @param nodeId - Optional node ID to spawn from (as path parameter)
 * @returns Promise with walker response containing success status and data
 * 
 * @example
 * ```typescript
 * const result = await jacSpawn('quiz_generator', {
 *   lesson_id: 'lesson-1',
 *   user_id: 'user-123'
 * })
 * if (result.success) {
 *   console.log(result.data)
 * }
 * ```
 */
export async function jacSpawn<T = any>(
  walkerName: string,
  ctx: Record<string, any> = {},
  nodeId?: string
): Promise<WalkerResponse<T>> {
  try {
    // Build the endpoint URL
    let endpoint = `${JASECI_API_URL}/walker/${walkerName}`
    if (nodeId) {
      endpoint = `${JASECI_API_URL}/walker/${walkerName}/${nodeId}`
    }

    // Prepare headers - ALWAYS include authorization
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JASECI_API_KEY}`,
    }
    

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(ctx),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const result = await response.json()

    // The new API format returns data directly or in a specific structure
    // Adjust based on actual API response format
    if (result && typeof result === 'object') {
      // Check if it's an error response
      if ('error' in result || 'detail' in result) {
        return {
          success: false,
          error: result.error || result.detail || 'Walker execution failed',
        }
      }
      
      // Check if result has a 'report' field (old format) or is the data directly
      if ('report' in result) {
        const report = result.report
        return {
          success: true,
          data: (Array.isArray(report) ? report[0] : report) as T,
        }
      }
      
      // Assume the result is the data directly
      return {
        success: true,
        data: result as T,
      }
    }

    return {
      success: true,
      data: result as T,
    }
  } catch (error) {
    // Only log if it's not a connection refused error (Jaseci server not running)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    if (!errorMessage.includes('Failed to fetch') && !errorMessage.includes('ERR_CONNECTION_REFUSED')) {
      console.error('Error spawning walker:', error)
    }
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Spawn a walker on the Jaseci backend (alias for jacSpawn)
 * 
 * Maintained for backward compatibility.
 * New code should use jacSpawn() to follow Jac Client conventions.
 * 
 * @deprecated Use jacSpawn() instead for better alignment with Jac Client patterns
 */
export async function spawnWalker<T = any>(
  walkerName: string,
  ctx: Record<string, any> = {},
  nodeId?: string
): Promise<WalkerResponse<T>> {
  return jacSpawn<T>(walkerName, ctx, nodeId)
}

/**
 * Get a lesson by ID
 * Uses Jac Client (jacSpawn) to communicate with backend
 */
export async function getLesson(lessonId: string) {
  return spawnWalker('get_lesson', { lesson_id: lessonId })
}

/**
 * Get next recommended lesson for user
 * Uses Jac Client to spawn the learning_planner walker
 */
export async function getNextLesson(userId: string) {
  return jacSpawn('learning_planner', {
    user_id: userId,
    action: 'plan_next_lesson',
  })
}

/**
 * Generate a quiz for a lesson
 * Uses Jac Client to spawn the quiz_generator walker
 * The walker internally uses byLLM for quiz generation (see backend/jac/main.jac)
 */
export async function generateQuiz(lessonId: string, userId: string) {
  return jacSpawn('quiz_generator', {
    lesson_id: lessonId,
    user_id: userId,
  })
}

/**
 * Evaluate a quiz answer
 * Uses Jac Client to spawn the answer_evaluator walker
 * The walker internally uses byLLM for answer evaluation (see backend/jac/main.jac)
 */
export async function evaluateAnswer(
  questionId: string,
  userAnswer: string,
  correctAnswer: string,
  questionContext: any
) {
  return jacSpawn('answer_evaluator', {
    question_id: questionId,
    user_answer: userAnswer,
    correct_answer: correctAnswer,
    question_context: questionContext,
  })
}

/**
 * Submit a quiz attempt
 * Uses Jac Client to spawn the answer_evaluator walker
 */
export async function submitQuiz(
  userId: string,
  quizId: string,
  answers: Record<string, string>,
  questions?: any[]
) {
  return jacSpawn('answer_evaluator', {
    user_id: userId,
    quiz_id: quizId,
    answers,
    questions: questions || [],
    action: 'evaluate_quiz',
  })
}

/**
 * Get user progress summary
 * Uses Jac Client to spawn the progress_tracker walker
 */
export async function getProgressSummary(userId: string) {
  return jacSpawn('progress_tracker', {
    user_id: userId,
    action: 'get_progress_summary',
  })
}

/**
 * Record lesson completion
 * Uses Jac Client to spawn the progress_tracker walker
 */
export async function recordLessonCompletion(
  userId: string,
  lessonId: string,
  score: number
) {
  return jacSpawn('progress_tracker', {
    user_id: userId,
    lesson_id: lessonId,
    score,
    action: 'record_lesson_completion',
  })
}

/**
 * Get skill map data for user
 * Uses Jac Client to spawn the skill_analyzer walker
 */
export async function getSkillMap(userId: string) {
  return jacSpawn('skill_analyzer', {
    user_id: userId,
    action: 'generate_skill_map',
  })
}

/**
 * Get weak areas for user
 * Uses Jac Client to spawn the skill_analyzer walker
 */
export async function getWeakAreas(userId: string) {
  return jacSpawn('skill_analyzer', {
    user_id: userId,
    action: 'identify_weak_areas',
  })
}

/**
 * Execute code in Jaseci backend
 * Uses Jac Client to spawn the execute_code walker
 */
export async function executeCode(code: string, exerciseId?: string) {
  return jacSpawn('execute_code', {
    code,
    exercise_id: exerciseId,
  })
}


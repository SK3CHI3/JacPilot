/**
 * Jac Client Service
 * Handles communication with Jaseci backend via walker API calls
 * Updated for jaclang/jac_cloud API format
 */

import type { WalkerResponse } from '../types'

// Configuration - will be set via environment variables
const JASECI_API_URL = import.meta.env.VITE_JASECI_API_URL || 'http://localhost:8000'
// Hardcoded token takes priority - .env has stale token that causes 401 errors
const JASECI_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzFhOTcyNDNlMTBhNTAyOWU2OWNmOSIsImVtYWlsIjoiYWRtaW5AamFjcGlsb3QuY29tIiwicm9vdF9pZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImlzX2FjdGl2YXRlZCI6dHJ1ZSwiaXNfYWRtaW4iOnRydWUsImV4cGlyYXRpb24iOjE3NjQ5MjY4NTksInN0YXRlIjoid3BWZWF0QlMifQ.E8hscTcY9irG_vRKeqtvgzOuiYOB2Sv8AVNWAXvmqoE'

// Debug: Log if API key is missing (only in dev)
if (import.meta.env.DEV && !JASECI_API_KEY) {
  console.warn('⚠️ JASECI_API_KEY is not set! Requests will fail with 401 Unauthorized')
}

/**
 * Spawn a walker on the Jaseci backend
 * Uses the new jaclang API format: /walker/{walker_name}
 * @param walkerName - Name of the walker to spawn
 * @param ctx - Context object to pass to the walker (as request body)
 * @param nodeId - Optional node ID to spawn from (as path parameter)
 * @returns Promise with walker response
 */
export async function spawnWalker<T = any>(
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
    
    // Debug log in development
    if (import.meta.env.DEV) {
      const tokenPreview = JASECI_API_KEY ? `${JASECI_API_KEY.substring(0, 30)}...` : 'MISSING'
      console.log(`[jacClient] Calling walker: ${walkerName}`, {
        url: endpoint,
        hasAuth: !!JASECI_API_KEY,
        tokenLength: JASECI_API_KEY?.length || 0,
        tokenPreview: tokenPreview,
        fullToken: JASECI_API_KEY // Log full token for debugging
      })
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


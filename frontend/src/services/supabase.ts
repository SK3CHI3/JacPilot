/**
 * Supabase Client Service
 * Handles database operations and authentication
 */

import { createClient } from '@supabase/supabase-js'

// Configuration - will be set via environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials not configured. Some features may not work.')
}

// Using any for now - will be properly typed when database schema is finalized
export const supabase = createClient<any>(SUPABASE_URL, SUPABASE_ANON_KEY)

/**
 * Auth helpers
 */
export const auth = {
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  },
  
  signUp: async (email: string, password: string, metadata?: Record<string, any>) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    })
  },
  
  signOut: async () => {
    return await supabase.auth.signOut()
  },
  
  getSession: async () => {
    return await supabase.auth.getSession()
  },
  
  getUser: async () => {
    return await supabase.auth.getUser()
  },
}

/**
 * User operations
 */
export const users = {
  getById: async (id: string) => {
    return await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
  },
  
  update: async (id: string, updates: Record<string, any>) => {
    return await supabase
      .from('users')
      .update(updates as any)
      .eq('id', id)
  },
}

/**
 * Lesson operations
 */
export const lessons = {
  getAll: async () => {
    return await supabase
      .from('lessons')
      .select('*')
      .order('order_index', { ascending: true })
  },
  
  getById: async (id: string) => {
    return await supabase
      .from('lessons')
      .select('*, lesson_concepts(concepts(*))')
      .eq('id', id)
      .single()
  },
  
  getProgress: async (userId: string) => {
    return await supabase
      .from('user_lesson_progress')
      .select('*, lessons(*)')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
  },
}

/**
 * Quiz operations
 */
export const quizzes = {
  getByLesson: async (lessonId: string) => {
    return await supabase
      .from('quizzes')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
  },
  
  recordAttempt: async (attempt: {
    user_id: string
    quiz_id: string
    score: number
    time_taken: number
    answers: Record<string, any>
  }) => {
    return await supabase
      .from('quiz_attempts')
      .insert(attempt as any)
  },
  
  getAttempts: async (userId: string) => {
    return await supabase
      .from('quiz_attempts')
      .select('*, quizzes(*)')
      .eq('user_id', userId)
      .order('attempted_at', { ascending: false })
  },
}

/**
 * Code exercise operations
 */
export const exercises = {
  getByLesson: async (lessonId: string) => {
    return await supabase
      .from('code_exercises')
      .select('*')
      .eq('lesson_id', lessonId)
  },
  
  submit: async (submission: {
    user_id: string
    exercise_id: string
    code: string
    passed_tests: number
    total_tests: number
  }) => {
    return await supabase
      .from('code_submissions')
      .insert(submission as any)
  },
}


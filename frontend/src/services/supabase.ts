/**
 * Supabase Client Service
 * Handles database operations and authentication
 */

import { createClient } from '@supabase/supabase-js'

// Configuration - will be set via environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

let supabaseClient: any = null

if (SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== '') {
  try {
    // Validate URL format
    try {
      new URL(SUPABASE_URL)
    } catch {
      throw new Error('Invalid Supabase URL format')
    }
    supabaseClient = createClient<any>(SUPABASE_URL, SUPABASE_ANON_KEY)
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    supabaseClient = createMockClient()
  }
} else {
  console.warn('Supabase credentials not configured. Using mock client. Some features may not work.')
  supabaseClient = createMockClient()
}

function createMockClient() {
  const mockError = { message: 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.' }

  const mockQueryBuilder = {
    select: () => mockQueryBuilder,
    insert: () => Promise.resolve({ data: null, error: mockError }),
    update: () => mockQueryBuilder,
    delete: () => mockQueryBuilder,
    eq: () => mockQueryBuilder,
    order: () => mockQueryBuilder,
    limit: () => mockQueryBuilder,
    single: () => Promise.resolve({ data: null, error: mockError }),
    then: (onResolve: any) => Promise.resolve({ data: null, error: mockError }).then(onResolve),
  }

  return {
    auth: {
      signInWithPassword: () => Promise.resolve({ data: null, error: mockError }),
      signUp: () => Promise.resolve({ data: null, error: mockError }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: () => mockQueryBuilder,
  }
}

export const supabase = supabaseClient

/**
 * Auth helpers
 */
export const auth = {
  signIn: async (email: string, password: string) => {
    try {
      return await supabase.auth.signInWithPassword({ email, password })
    } catch (error: any) {
      console.error('Sign in error:', error)
      return {
        data: null,
        error: {
          message: error?.message || 'Failed to sign in. Please check your credentials.',
        },
      }
    }
  },
  
  signUp: async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      })
      
      // Log the full response for debugging
      if (result.error) {
        console.error('Supabase signup error:', result.error)
      }
      
      return result
    } catch (error: any) {
      console.error('Sign up exception:', error)
      return {
        data: null,
        error: {
          message: error?.message || 'Failed to create account. Please try again.',
          status: error?.status || 500,
        },
      }
    }
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
  
  getByAuthUserId: async (authUserId: string) => {
    return await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUserId)
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
    // Simplified query to avoid 406 error - get lesson first, then concepts separately
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single()
    
    if (lessonError || !lesson) {
      return { data: null, error: lessonError }
    }
    
    // Get concepts separately
    const { data: lessonConcepts } = await supabase
      .from('lesson_concepts')
      .select(`
        concept_id,
        concepts (
          id,
          name,
          description,
          difficulty_level,
          category
        )
      `)
      .eq('lesson_id', id)
    
    return {
      data: {
        ...lesson,
        lesson_concepts: lessonConcepts || []
      },
      error: null
    }
  },
  
  getProgress: async (userId: string) => {
    // Select specific columns to avoid 406 errors with foreign key relationships
    return await supabase
      .from('user_lesson_progress')
      .select(`
        id,
        user_id,
        lesson_id,
        completed_at,
        score,
        progress_percentage,
        time_spent,
        lessons (
          id,
          title,
          order_index
        )
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
  },
  
  getLessonProgress: async (userId: string, lessonId: string) => {
    // Select specific columns to avoid 406 errors
    return await supabase
      .from('user_lesson_progress')
      .select('id, user_id, lesson_id, completed_at, score, progress_percentage, time_spent')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .maybeSingle() // Use maybeSingle instead of single to avoid errors if not found
  },
  
  updateProgress: async (userId: string, lessonId: string, progressPercentage: number) => {
    // First check if record exists
    const { data: existing } = await supabase
      .from('user_lesson_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .maybeSingle() // Use maybeSingle to avoid errors if not found

    const progressData = {
      user_id: userId,
      lesson_id: lessonId,
      progress_percentage: Math.min(100, Math.max(0, progressPercentage)),
    }

    if (existing?.id) {
      // Update existing record
      return await supabase
        .from('user_lesson_progress')
        .update(progressData)
        .eq('id', existing.id)
    } else {
      // Insert new record
      return await supabase
        .from('user_lesson_progress')
        .insert(progressData)
    }
  },
}

/**
 * Quiz operations
 */
export const quizzes = {
  getByLesson: async (lessonId: string) => {
    // Select specific columns to avoid 406 errors
    // Only select columns that exist in the quizzes table
    return await supabase
      .from('quizzes')
      .select('id, lesson_id, difficulty, questions, created_at, jaseci_quiz_id')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle() // Use maybeSingle to avoid errors if not found
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


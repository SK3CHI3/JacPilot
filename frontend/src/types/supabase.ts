/**
 * Supabase Database Types
 * This will be auto-generated from Supabase, but providing a basic structure for now
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          jaseci_user_id: string | null
          auth_user_id: string | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
          jaseci_user_id?: string | null
          auth_user_id?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
          jaseci_user_id?: string | null
          auth_user_id?: string | null
        }
      }
      lessons: {
        Row: {
          id: string
          title: string
          content: string
          order_index: number | null
          estimated_time: number | null
          lesson_type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          order_index?: number | null
          estimated_time?: number | null
          lesson_type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          order_index?: number | null
          estimated_time?: number | null
          lesson_type?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quizzes: {
        Row: {
          id: string
          lesson_id: string
          difficulty: number
          questions: Json
          created_at: string
          jaseci_quiz_id: string | null
        }
        Insert: {
          id?: string
          lesson_id: string
          difficulty: number
          questions: Json
          created_at?: string
          jaseci_quiz_id?: string | null
        }
        Update: {
          id?: string
          lesson_id?: string
          difficulty?: number
          questions?: Json
          created_at?: string
          jaseci_quiz_id?: string | null
        }
      }
      quiz_attempts: {
        Row: {
          id: string
          user_id: string
          quiz_id: string
          score: number
          time_taken: number
          attempted_at: string
          answers: Json
        }
        Insert: {
          id?: string
          user_id: string
          quiz_id: string
          score: number
          time_taken: number
          attempted_at?: string
          answers: Json
        }
        Update: {
          id?: string
          user_id?: string
          quiz_id?: string
          score?: number
          time_taken?: number
          attempted_at?: string
          answers?: Json
        }
      }
      user_lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed_at: string | null
          score: number | null
          time_spent: number | null
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed_at?: string | null
          score?: number | null
          time_spent?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed_at?: string | null
          score?: number | null
          time_spent?: number | null
        }
      }
      code_exercises: {
        Row: {
          id: string
          lesson_id: string
          title: string
          instructions: string
          starter_code: string
          test_cases: Json
          difficulty: number
          created_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          title: string
          instructions: string
          starter_code: string
          test_cases: Json
          difficulty: number
          created_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          title?: string
          instructions?: string
          starter_code?: string
          test_cases?: Json
          difficulty?: number
          created_at?: string
        }
      }
      code_submissions: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          code: string
          passed_tests: number
          total_tests: number
          submitted_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise_id: string
          code: string
          passed_tests: number
          total_tests: number
          submitted_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exercise_id?: string
          code?: string
          passed_tests?: number
          total_tests?: number
          submitted_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}


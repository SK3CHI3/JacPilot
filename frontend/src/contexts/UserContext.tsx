import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User, ProgressStats } from '../types'
import { auth, users, lessons, quizzes } from '../services/supabase'
import { getProgressSummary } from '../services/jacClient'

interface UserContextType {
  user: User | null
  progress: ProgressStats | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProgress: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [progress, setProgress] = useState<ProgressStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const { data: { session } } = await auth.getSession()
      if (session?.user) {
        await loadUser(session.user.id)
      }
    } catch (error) {
      console.error('Error checking session:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUser = async (authUserId: string) => {
    try {
      // Try to get user by auth_user_id first (since we're passing auth user ID)
      let { data, error } = await users.getByAuthUserId(authUserId)
      
      // If not found by auth_user_id, try by id (for backwards compatibility)
      if (error && error.code === 'PGRST116') {
        const result = await users.getById(authUserId)
        data = result.data
        error = result.error
      }
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user:', error)
        throw error
      }
      
      if (data) {
        setUser(data as User)
        await loadProgress(data.id) // Use the public.users.id for progress
      } else {
        console.warn('User record not found for auth user:', authUserId)
        // User might not exist yet, could create it here if needed
      }
    } catch (error) {
      console.error('Error loading user:', error)
    }
  }

  const loadProgress = async (userId: string) => {
    try {
      // Try to get from Jaseci first (for mastery-based stats)
      const response = await getProgressSummary(userId)
      if (response.success && response.data) {
        setProgress(response.data as ProgressStats)
      } else {
        // Fallback: Calculate from Supabase data
        const { data: progressData } = await lessons.getProgress(userId)
        const { data: quizAttempts } = await quizzes.getAttempts(userId)
        
        if (progressData || quizAttempts) {
          const lessonsCompleted = (progressData as any[])?.length || 0
          const avgQuizScore = quizAttempts && (quizAttempts as any[]).length > 0
            ? (quizAttempts as any[]).reduce((sum: number, a: any) => sum + (a.score || 0), 0) / (quizAttempts as any[]).length
            : 0
          
          setProgress({
            lessons_completed: lessonsCompleted,
            average_quiz_score: avgQuizScore,
            mastered_concepts: 0, // Would need to calculate from mastery data
            total_hours: lessonsCompleted * 0.5, // Estimate
          } as ProgressStats)
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error)
      // Fallback to Supabase-only calculation
      try {
        const { data: progressData } = await lessons.getProgress(userId)
        if (progressData) {
          setProgress({
            lessons_completed: (progressData as any[]).length,
            average_quiz_score: 0,
            mastered_concepts: 0,
            total_hours: (progressData as any[]).length * 0.5,
          } as ProgressStats)
        }
      } catch (fallbackError) {
        console.error('Error in fallback progress calculation:', fallbackError)
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await auth.signIn(email, password)
      if (error) throw error
      if (data.user) {
        await loadUser(data.user.id)
      }
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await auth.signOut()
      setUser(null)
      setProgress(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const refreshProgress = async () => {
    if (user) {
      await loadProgress(user.id)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        progress,
        loading,
        signIn,
        signOut,
        refreshProgress,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}


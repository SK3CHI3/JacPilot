import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User, ProgressStats } from '../types'
import { auth, users } from '../services/supabase'
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

  const loadUser = async (userId: string) => {
    try {
      const { data, error } = await users.getById(userId)
      if (error) throw error
      if (data) {
        setUser(data as User)
        await loadProgress(userId)
      }
    } catch (error) {
      console.error('Error loading user:', error)
    }
  }

  const loadProgress = async (userId: string) => {
    try {
      const response = await getProgressSummary(userId)
      if (response.success && response.data) {
        setProgress(response.data as ProgressStats)
      }
    } catch (error) {
      console.error('Error loading progress:', error)
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


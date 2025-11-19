import { useState, useCallback } from 'react'
import { spawnWalker, WalkerResponse } from '../services/jacClient'

interface UseWalkerReturn<T> {
  spawn: (walkerName: string, ctx?: Record<string, any>, nodeId?: string) => Promise<WalkerResponse<T>>
  loading: boolean
  error: string | null
}

/**
 * Custom hook for spawning Jaseci walkers
 * Provides loading state and error handling
 */
export function useWalker<T = any>(): UseWalkerReturn<T> {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const spawn = useCallback(
    async (
      walkerName: string,
      ctx: Record<string, any> = {},
      nodeId?: string
    ): Promise<WalkerResponse<T>> => {
      setLoading(true)
      setError(null)

      try {
        const response = await spawnWalker<T>(walkerName, ctx, nodeId)
        
        if (!response.success) {
          setError(response.error || 'Walker execution failed')
        }

        return response
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
        return {
          success: false,
          error: errorMessage,
        }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { spawn, loading, error }
}


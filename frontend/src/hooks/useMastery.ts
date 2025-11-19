import { useState, useEffect } from 'react'
import type { SkillMapData } from '../types'
import { getSkillMap, getWeakAreas } from '../services/jacClient'
import { useUser } from '../contexts/UserContext'

interface UseMasteryReturn {
  skillMap: SkillMapData | null
  weakAreas: any[] | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

/**
 * Custom hook for managing user mastery data
 */
export function useMastery(): UseMasteryReturn {
  const { user } = useUser()
  const [skillMap, setSkillMap] = useState<SkillMapData | null>(null)
  const [weakAreas, setWeakAreas] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMastery = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // Load skill map
      const mapResponse = await getSkillMap(user.id)
      if (mapResponse.success && mapResponse.data) {
        setSkillMap(mapResponse.data as SkillMapData)
      }

      // Load weak areas
      const weakResponse = await getWeakAreas(user.id)
      if (weakResponse.success && weakResponse.data) {
        setWeakAreas(weakResponse.data.weak_areas || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load mastery data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadMastery()
    }
  }, [user])

  return {
    skillMap,
    weakAreas,
    loading,
    error,
    refresh: loadMastery,
  }
}


import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CodeExercise } from '../types'
import { exercises } from '../services/supabase'
import { useUser } from '../contexts/UserContext'
import { CodeEditor } from '../components/code-editor/CodeEditor'
import { Button } from '../components/common/Button'

export default function CodeExercisePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useUser()
  const [exercise, setExercise] = useState<CodeExercise | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExercise()
  }, [id])

  const loadExercise = async () => {
    if (!id) return

    setLoading(true)
    try {
      const { data, error } = await exercises.getByLesson(id)
      if (!error && data && data.length > 0) {
        setExercise(data[0] as CodeExercise)
      }
    } catch (error) {
      console.error('Error loading exercise:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (code: string, results: any[]) => {
    if (!user || !exercise) return

    try {
      const passedTests = results.filter((r) => r.passed).length
      await exercises.submit({
        user_id: user.id,
        exercise_id: exercise.id,
        code,
        passed_tests: passedTests,
        total_tests: results.length,
      })
      navigate('/dashboard')
    } catch (error) {
      console.error('Error submitting exercise:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading exercise...</div>
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Exercise not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          ← Back to Dashboard
        </Button>

        <CodeEditor exercise={exercise} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}


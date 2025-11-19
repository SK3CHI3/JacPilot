import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Lesson } from '../../types'
import { getLesson, recordLessonCompletion } from '../../services/jacClient'
import { lessons } from '../../services/supabase'
import { useUser } from '../../contexts/UserContext'
import { Button } from '../common/Button'
import { Card } from '../common/Card'

export function LessonViewer() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, refreshProgress } = useUser()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    loadLesson()
  }, [id])

  const loadLesson = async () => {
    if (!id) return

    setLoading(true)
    try {
      // Try Supabase first
      const { data, error } = await lessons.getById(id)
      if (!error && data) {
        setLesson(data as Lesson)
      } else {
        // Fallback to Jaseci
        const response = await getLesson(id)
        if (response.success && response.data) {
          setLesson(response.data as Lesson)
        }
      }
    } catch (error) {
      console.error('Error loading lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    if (!user || !lesson) return

    setCompleting(true)
    try {
      await recordLessonCompletion(user.id, lesson.id, 1.0)
      await refreshProgress()
      navigate('/dashboard')
    } catch (error) {
      console.error('Error completing lesson:', error)
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading lesson...</div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Lesson not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          ← Back to Dashboard
        </Button>

        <Card>
          <div className="mb-4">
            <span className="text-sm text-gray-400">
              {lesson.lesson_type} • {lesson.estimated_time} min
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-6">{lesson.title}</h1>

          <div
            className="prose prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />

          <div className="flex gap-4">
            <Button onClick={handleComplete} disabled={completing}>
              {completing ? 'Completing...' : 'Mark as Complete'}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/quiz/${lesson.id}`)}
            >
              Take Quiz
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}


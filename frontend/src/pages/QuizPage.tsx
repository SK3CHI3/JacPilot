import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Quiz } from '../types'
import { generateQuiz, submitQuiz } from '../services/jacClient'
import { quizzes } from '../services/supabase'
import { useUser } from '../contexts/UserContext'
import { QuizViewer } from '../components/quiz/QuizViewer'
import { Button } from '../components/common/Button'

export default function QuizPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, refreshProgress } = useUser()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadQuiz()
  }, [id])

  const loadQuiz = async () => {
    if (!id || !user) return

    setLoading(true)
    try {
      // Try to get existing quiz from Supabase
      const { data, error } = await quizzes.getByLesson(id)
      if (!error && data) {
        setQuiz(data as Quiz)
      } else {
        // Generate new quiz via Jaseci
        const response = await generateQuiz(id, user.id)
        if (response.success && response.data) {
          setQuiz(response.data as Quiz)
        }
      }
    } catch (error) {
      console.error('Error loading quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (answers: Record<string, string>) => {
    if (!user || !quiz) return

    setSubmitting(true)
    try {
      const response = await submitQuiz(user.id, quiz.id, answers)
      if (response.success) {
        await refreshProgress()
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading quiz...</div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Quiz not found</div>
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

        <QuizViewer quiz={quiz} onSubmit={handleSubmit} loading={submitting} />
      </div>
    </div>
  )
}


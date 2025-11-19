import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Quiz } from '../types'
import { generateQuiz, submitQuiz } from '../services/jacClient'
import { quizzes, supabase } from '../services/supabase'
import { useUser } from '../contexts/UserContext'
import { QuizViewer } from '../components/quiz/QuizViewer'

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
      // Evaluate quiz via Jaseci
      const response = await submitQuiz(user.id, quiz.id, answers)
      
      if (response.success && response.data) {
        const result = response.data as any
        const score = result.score || 0
        
        // Save to Supabase
        try {
          await supabase.from('quiz_attempts').insert({
            user_id: user.id,
            quiz_id: quiz.id,
            score: score,
            time_taken: 0, // Would calculate actual time
            answers: answers,
            attempted_at: new Date().toISOString(),
          })
        } catch (supabaseError) {
          console.error('Error saving quiz attempt to Supabase:', supabaseError)
        }

        await refreshProgress()
        navigate('/dashboard')
      } else {
        console.error('Quiz evaluation failed:', response.error)
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FF6B35] border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Quiz not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#FF6B35] mb-6 transition-colors"
        >
          <span>←</span> Back to Dashboard
        </button>

        <QuizViewer quiz={quiz} onSubmit={handleSubmit} loading={submitting} />
      </div>
    </div>
  )
}


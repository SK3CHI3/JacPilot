import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { lessons } from '../services/supabase'
import Navbar from '../components/dashboard/Navbar'
import { Target, Play, BookOpen } from 'lucide-react'
import type { Lesson } from '../types'

interface QuizItem {
  id: string
  lesson_id: string
  lesson_title: string
  difficulty: number
  question_count: number
}

function QuizIndexPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [quizzesList, setQuizzesList] = useState<QuizItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadQuizzes()
  }, [user])

  const loadQuizzes = async () => {
    try {
      // Fetch lessons and create quiz items for each (quizzes are linked to lessons)
      const { data: lessonsData, error } = await lessons.getAll()
      if (error) throw error
      if (lessonsData) {
        const quizItems: QuizItem[] = (lessonsData as Lesson[]).map((lesson) => ({
          id: `quiz-${lesson.id}`, // Quiz ID is generated from lesson
          lesson_id: lesson.id,
          lesson_title: lesson.title,
          difficulty: 2, // Default difficulty
          question_count: 5, // Default question count
        }))
        setQuizzesList(quizItems)
      }
    } catch (error) {
      console.error('Error loading quizzes:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FF6B35] border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading quizzes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-3 rounded-xl shadow-lg"
                style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}
              >
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Quizzes</h1>
                <p className="text-gray-600 mt-1">Test your knowledge with AI-generated quizzes</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzesList.map((quiz) => (
              <Link
                key={quiz.id}
                to={`/quiz/${quiz.lesson_id}`}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-[#FF6B35] transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-[#FF6B35]" />
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#FF6B35] transition-colors">
                        {quiz.lesson_title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {quiz.question_count} questions • Difficulty: {quiz.difficulty}/5
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Play className="w-5 h-5 text-[#FF6B35] group-hover:translate-x-1 transition-transform" />
                  <span className="text-sm font-semibold text-[#FF6B35]">Start Quiz</span>
                </div>
              </Link>
            ))}
          </div>

          {quizzesList.length === 0 && !loading && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No quizzes available yet</p>
              <p className="text-sm text-gray-500 mt-2">Quizzes are generated based on your lessons</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default QuizIndexPage


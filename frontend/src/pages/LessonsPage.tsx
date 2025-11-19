import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { lessons } from '../services/supabase'
import Navbar from '../components/dashboard/Navbar'
import { BookOpen, Clock, Play } from 'lucide-react'
import type { Lesson } from '../types'

function LessonsPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [lessonsList, setLessonsList] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadLessons()
  }, [user])

  const loadLessons = async () => {
    try {
      const { data, error } = await lessons.getAll()
      if (error) throw error
      if (data) {
        setLessonsList(data as Lesson[])
      }
    } catch (error) {
      console.error('Error loading lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FF6B35] border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading lessons...</p>
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
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Lessons</h1>
                <p className="text-gray-600 mt-1">Explore all available lessons</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessonsList.map((lesson) => (
              <Link
                key={lesson.id}
                to={`/lessons/${lesson.id}`}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:border-[#FF6B35] transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#FF6B35] transition-colors mb-2">
                      {lesson.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.estimated_time || 15} min</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Play className="w-5 h-5 text-[#FF6B35] group-hover:translate-x-1 transition-transform" />
                  <span className="text-sm font-semibold text-[#FF6B35]">Start Lesson</span>
                </div>
              </Link>
            ))}
          </div>

          {lessonsList.length === 0 && !loading && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No lessons available yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default LessonsPage


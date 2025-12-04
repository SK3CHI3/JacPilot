import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle2, Circle, ArrowRight, Clock } from 'lucide-react'
import { lessons as lessonsService } from '../../services/supabase'
import { useUser } from '../../contexts/UserContext'
import { getNextLesson } from '../../services/jacClient'

interface Lesson {
  id: string
  title: string
  estimated_time?: number
  order_index?: number
}

function LearningPath() {
  const { user } = useUser()
  const [lessonsList, setLessonsList] = useState<Lesson[]>([])
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [nextLesson, setNextLesson] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLessons()
  }, [user])

  const loadLessons = async () => {
    if (!user) return

    try {
      // Fetch lessons from Supabase
      const { data: lessonsData, error } = await lessonsService.getAll()
      
      if (error) {
        console.error('Error loading lessons:', error)
        return
      }

      if (lessonsData) {
        const sortedLessons = (lessonsData as any[]).sort((a, b) => 
          (a.order_index || 0) - (b.order_index || 0)
        )
        setLessonsList(sortedLessons)

        // Fetch user progress
        const { data: progressData } = await lessonsService.getProgress(user.id)
        if (progressData) {
          // Only mark as completed if completed_at is set
          const completed = new Set(
            (progressData as any[])
              .filter((p: any) => p.completed_at)
              .map((p: any) => p.lesson_id)
          )
          setCompletedLessons(completed)
        }

        // Get next recommended lesson from Jaseci
        try {
          const response = await getNextLesson(user.id)
          if (response.success && response.data) {
            setNextLesson((response.data as any).lesson_id)
          }
        } catch (err) {
          console.error('Error getting next lesson:', err)
        }
      }
    } catch (error) {
      console.error('Error loading lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  const lessons = lessonsList.slice(0, 5) // Show first 5 lessons

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#FF6B35]" />
          <h2 className="text-xl font-bold text-gray-900">Your Learning Path</h2>
        </div>
        <Link
          to="/lessons"
          className="text-sm font-semibold text-[#FF6B35] hover:underline flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      {lessons.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No lessons available yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson) => {
            const completed = completedLessons.has(lesson.id)
            const isNext = nextLesson === lesson.id
            const duration = lesson.estimated_time ? `${lesson.estimated_time} min` : 'N/A'
            
            return (
              <Link
                key={lesson.id}
                to={`/lessons/${lesson.id}`}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${
                  isNext 
                    ? 'border-[#FF6B35] bg-orange-50 shadow-md' 
                    : 'border-gray-200 hover:border-[#FF6B35] hover:shadow-md'
                }`}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {completed ? (
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                  ) : (
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isNext ? 'border-[#FF6B35]' : 'border-gray-300 group-hover:border-[#FF6B35]'
                    }`}>
                      <Circle className={`w-5 h-5 transition-colors ${
                        isNext ? 'text-[#FF6B35]' : 'text-gray-400 group-hover:text-[#FF6B35]'
                      }`} />
                    </div>
                  )}
                </div>
                
                {/* Lesson Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {isNext && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#FF6B35] text-white">
                        Next
                      </span>
                    )}
                    <p className={`font-semibold ${
                      completed 
                        ? 'text-gray-600 line-through' 
                        : 'text-gray-900 group-hover:text-[#FF6B35]'
                    } transition-colors`}>
                      {lesson.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{duration}</span>
                  </div>
                </div>
                
                {/* Progress Indicator */}
                {!completed && (
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${
                      isNext ? 'bg-[#FF6B35]' : 'bg-[#FF6B35]'
                    } animate-pulse`}></div>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LearningPath


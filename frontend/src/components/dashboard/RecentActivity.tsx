import { useState, useEffect } from 'react'
import { Award, BookOpen, Clock } from 'lucide-react'
import { useUser } from '../../contexts/UserContext'
import { lessons, quizzes } from '../../services/supabase'

interface Activity {
  type: string
  title: string
  score: number | null
  icon: typeof BookOpen
  color: string
  bgColor: string
  time: string
}

function RecentActivity() {
  const { user } = useUser()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadActivities()
  }, [user])

  const loadActivities = async () => {
    if (!user) return

    try {
      const activityList: Activity[] = []

      // Get recent quiz attempts
      const { data: quizAttempts } = await quizzes.getAttempts(user.id)
      if (quizAttempts) {
        const recentAttempts = (quizAttempts as any[]).slice(0, 2)
        for (const attempt of recentAttempts) {
          const quiz = attempt.quizzes
          const timeAgo = getTimeAgo(new Date(attempt.attempted_at))
          activityList.push({
            type: 'quiz',
            title: `Completed Quiz: ${quiz?.title || 'Quiz'}`,
            score: Math.round((attempt.score || 0) * 100),
            icon: BookOpen,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            time: timeAgo,
          })
        }
      }

      // Get recent lesson completions
      const { data: progressData } = await lessons.getProgress(user.id)
      if (progressData) {
        const recentLessons = (progressData as any[]).slice(0, 2)
        for (const progress of recentLessons) {
          const lesson = progress.lessons
          const timeAgo = getTimeAgo(new Date(progress.completed_at))
          activityList.push({
            type: 'lesson',
            title: `Finished: ${lesson?.title || 'Lesson'}`,
            score: null,
            icon: Award,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            time: timeAgo,
          })
        }
      }

      // Sort by time (most recent first) and limit to 4
      activityList.sort((a, b) => {
        const timeA = parseTimeAgo(a.time)
        const timeB = parseTimeAgo(b.time)
        return timeA - timeB
      })

      setActivities(activityList.slice(0, 4))
    } catch (error) {
      console.error('Error loading activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  const parseTimeAgo = (timeStr: string): number => {
    const match = timeStr.match(/(\d+)\s*(minute|hour|day)/)
    if (!match) return 0
    const value = parseInt(match[1])
    const unit = match[2]
    if (unit === 'minute') return value
    if (unit === 'hour') return value * 60
    return value * 1440
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

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-[#FF6B35]" />
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No recent activity</p>
          <p className="text-sm text-gray-400 mt-1">Complete lessons and quizzes to see activity here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all"
              >
                <div className={`p-3 rounded-xl ${activity.bgColor}`}>
                  <Icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{activity.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-500">{activity.time}</span>
                    {activity.score !== null && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm font-semibold text-gray-700">{activity.score}%</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RecentActivity


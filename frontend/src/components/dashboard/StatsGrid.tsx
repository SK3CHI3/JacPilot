import { BookOpen, Award, Clock, TrendingUp } from 'lucide-react'

interface UserData {
  level: number
  lessonsCompleted: number
  hours: number
  streak: number
}

interface StatsGridProps {
  userData: UserData
}

function StatsGrid({ userData }: StatsGridProps) {
  const stats = [
    {
      label: 'Lessons Completed',
      value: userData.lessonsCompleted,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Mastery Level',
      value: userData.level,
      icon: Award,
      color: 'from-[#FF6B35] to-[#FFD23F]',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Hours Learned',
      value: userData.hours,
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Day Streak',
      value: userData.streak,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <Icon 
                  className="w-6 h-6" 
                  style={{ 
                    color: stat.color.includes('orange') ? '#FF6B35' : 
                           stat.color.includes('blue') ? '#3B82F6' :
                           stat.color.includes('purple') ? '#9333EA' :
                           '#10B981'
                  }} 
                />
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} opacity-10`}></div>
            </div>
            
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsGrid


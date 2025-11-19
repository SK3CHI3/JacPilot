import { TrendingUp, Target } from 'lucide-react'

interface UserData {
  level: number
  lessonsCompleted: number
  hours: number
}

interface ProgressOverviewProps {
  userData: UserData
}

function ProgressOverview({ userData }: ProgressOverviewProps) {
  const progressData = [
    { label: 'Lessons', current: userData.lessonsCompleted, total: 20, color: 'bg-blue-500' },
    { label: 'Concepts', current: userData.level, total: 50, color: 'bg-[#FF6B35]' },
    { label: 'Hours', current: userData.hours, total: 100, color: 'bg-green-500' },
  ]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-[#FF6B35]" />
        <h2 className="text-xl font-bold text-gray-900">Progress Overview</h2>
      </div>
      
      <div className="space-y-6">
        {progressData.map((item, index) => {
          const percentage = Math.min((item.current / item.total) * 100, 100)
          
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                <span className="text-sm font-bold text-gray-900">
                  {item.current} / {item.total}
                </span>
              </div>
              
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">{Math.round(percentage)}% complete</span>
                <span className="text-xs text-gray-500">{item.total - item.current} remaining</span>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Overall Progress */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
          <Target className="w-5 h-5 text-[#FF6B35]" />
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${((userData.lessonsCompleted + userData.level + userData.hours) / 170) * 100}%`,
              background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)',
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-right">
          {Math.round(((userData.lessonsCompleted + userData.level + userData.hours) / 170) * 100)}% complete
        </p>
      </div>
    </div>
  )
}

export default ProgressOverview



import { Link } from 'react-router-dom'
import { Play, Code, BookOpen, Target, Zap, ArrowRight } from 'lucide-react'

function QuickActions() {
  const actions = [
    {
      title: 'Start Lesson',
      description: 'Continue your learning',
      icon: Play,
      link: '/lessons',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Practice Code',
      description: 'Try coding exercises',
      icon: Code,
      link: '/code',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Take Quiz',
      description: 'Test your knowledge',
      icon: BookOpen,
      link: '/quiz',
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'View Progress',
      description: 'Track your skills',
      icon: Target,
      link: '/skills',
      gradient: 'from-[#FF6B35] to-[#FFD23F]',
    },
  ]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-[#FF6B35]" />
        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
      </div>
      
      <div className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <Link
              key={index}
              to={action.link}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#FF6B35] hover:shadow-md transition-all group"
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient} group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 group-hover:text-[#FF6B35] transition-colors">
                  {action.title}
                </p>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#FF6B35] group-hover:translate-x-1 transition-all" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions



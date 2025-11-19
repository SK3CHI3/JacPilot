interface User {
  name: string
  role: string
  level: number
  quizzes: number
  hours: number
}

interface ProgressCardProps {
  user: User
}

function ProgressCard({ user }: ProgressCardProps) {
  return (
    <div className="card bg-gradient-primary p-6 flex flex-col justify-between h-full">
      <div>
        <div className="text-white/80 text-sm font-semibold mb-4">PRO student</div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{user.level}</p>
              <p className="text-xs text-white/80">level</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-xl">📝</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{user.quizzes}</p>
              <p className="text-xs text-white/80">quizzes</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-xl">⏱️</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{user.hours}</p>
              <p className="text-xs text-white/80">hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressCard


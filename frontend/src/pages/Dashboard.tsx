import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import Navbar from '../components/dashboard/Navbar'
import StatsGrid from '../components/dashboard/StatsGrid'
import QuickActions from '../components/dashboard/QuickActions'
import RecentActivity from '../components/dashboard/RecentActivity'
import LearningPath from '../components/dashboard/LearningPath'
import ProgressOverview from '../components/dashboard/ProgressOverview'
import { Target, Sparkles } from 'lucide-react'

function Dashboard() {
  const { user, progress, loading } = useUser()

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FF6B35] border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Please sign in</h2>
          <Link
            to="/login"
            className="inline-block px-6 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  const userData = {
    name: user.name || 'Student',
    level: progress?.mastered_concepts || 0,
    lessonsCompleted: progress?.lessons_completed || 0,
    hours: Math.round(progress?.total_hours || 0),
    streak: 7, // TODO: Calculate from recent activity
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section 
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(255, 210, 63, 0.05) 100%)'
          }}
        >
          <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="p-3 rounded-xl shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                      Welcome back, {userData.name.split(' ')[0]}!
                    </h1>
                    <p className="text-gray-600 mt-1">Continue your Jaseci learning journey</p>
                  </div>
                </div>
                
                {/* Streak Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl">🔥</span>
                    <span className="font-bold text-gray-900">{userData.streak}</span>
                  </div>
                  <span className="text-sm text-gray-600">day streak</span>
                </div>
              </div>
              
              <Link
                to="/skills"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 hover:shadow-xl shadow-lg"
                style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}
              >
                <Target className="w-5 h-5" />
                View Skill Map
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-6 py-8">
          {/* Stats Grid */}
          <StatsGrid userData={userData} />
          
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              <LearningPath />
              <RecentActivity />
            </div>
            
            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              <QuickActions />
              <ProgressOverview userData={userData} />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard

import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import Navbar from '../components/dashboard/Navbar'
import VideoCallPanel from '../components/dashboard/VideoCallPanel'
import ProgressCard from '../components/dashboard/ProgressCard'
import ActivityChart from '../components/dashboard/ActivityChart'
import TrainingsSection from '../components/dashboard/TrainingsSection'
import PracticeSection from '../components/dashboard/PracticeSection'
import { Button } from '../components/common/Button'

function Dashboard() {
  const { user, progress, loading } = useUser()

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
          <Button onClick={() => window.location.href = '/'}>
            Go to Homepage
          </Button>
        </div>
      </div>
    )
  }

  const userData = {
    name: user.name || 'Student',
    role: user.role || 'Student',
    level: progress?.mastered_concepts || user.level || 0,
    quizzes: progress?.lessons_completed || 0,
    hours: progress?.total_hours || 0,
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 mt-16">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {userData.name}!</h1>
            <p className="text-gray-400 mt-1">Continue your learning journey</p>
          </div>
          <Link to="/skills">
            <Button variant="outline">View Skill Map</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Top Row */}
          <div className="lg:col-span-7">
            <VideoCallPanel />
          </div>
          
          <div className="lg:col-span-2">
            <ProgressCard user={userData} />
          </div>
          
          <div className="lg:col-span-3">
            <ActivityChart />
          </div>
          
          {/* Bottom Row */}
          <div className="lg:col-span-8">
            <TrainingsSection />
          </div>
          
          <div className="lg:col-span-4">
            <PracticeSection />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard


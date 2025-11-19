import { useState } from 'react'
import Navbar from '../components/dashboard/Navbar'
import VideoCallPanel from '../components/dashboard/VideoCallPanel'
import ProgressCard from '../components/dashboard/ProgressCard'
import ActivityChart from '../components/dashboard/ActivityChart'
import TrainingsSection from '../components/dashboard/TrainingsSection'
import PracticeSection from '../components/dashboard/PracticeSection'

function Dashboard() {
  const [user] = useState({
    name: 'Marianna Carson',
    role: 'Student',
    level: 126,
    quizzes: 14,
    hours: 170,
  })

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Top Row */}
          <div className="lg:col-span-7">
            <VideoCallPanel />
          </div>
          
          <div className="lg:col-span-2">
            <ProgressCard user={user} />
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


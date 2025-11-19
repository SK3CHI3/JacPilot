import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import Navbar from '../components/dashboard/Navbar'
import { Code, Target } from 'lucide-react'

function CodeIndexPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    setLoading(false)
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FF6B35] border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Code Exercises</h1>
                <p className="text-gray-600 mt-1">Practice coding with AI-evaluated exercises</p>
              </div>
            </div>
          </div>

          <div className="text-center py-12">
            <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">Code exercises coming soon!</p>
            <p className="text-sm text-gray-500 mb-6">
              Practice exercises with AI-powered evaluation will be available here
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}
            >
              <Target className="w-5 h-5" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CodeIndexPage


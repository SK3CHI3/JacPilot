import { useUser } from '../contexts/UserContext'
import Navbar from '../components/dashboard/Navbar'
import { Settings, User, Bell, Shield } from 'lucide-react'

function SettingsPage() {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-3 rounded-xl shadow-lg"
                style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}
              >
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account and preferences</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-5 h-5 text-[#FF6B35]" />
                <h2 className="text-xl font-bold text-gray-900">Profile</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name || ''}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-5 h-5 text-[#FF6B35]" />
                <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive updates about your progress</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6B35]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B35]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* AI Features Info */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">AI-Powered Features</h2>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <strong>Quiz Generation:</strong> AI generates personalized quizzes based on your lessons
                </p>
                <p>
                  <strong>Code Evaluation:</strong> AI evaluates your code submissions and provides detailed feedback
                </p>
                <p>
                  <strong>Answer Analysis:</strong> AI analyzes your answers and provides learning recommendations
                </p>
                <p className="text-xs text-gray-500 mt-4">
                  All AI features use Google's Gemini API for safe and accurate evaluation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SettingsPage


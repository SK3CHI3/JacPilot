import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { Rocket, Home, BookOpen, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/lessons', label: 'Lessons', icon: BookOpen },
    { path: '/skills', label: 'Skills', icon: BarChart3 },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div 
              className="p-2 rounded-lg group-hover:scale-110 transition-transform shadow-sm"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}
            >
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span 
              className="text-xl font-bold"
              style={{ 
                background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent', 
                backgroundClip: 'text' 
              }}
            >
              JacPilot
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'text-gray-700 hover:text-[#FF6B35] hover:bg-gray-50'
                  }`}
                  style={isActive ? { background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>
          
          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <div className="hidden md:flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-lg"
                style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}
              >
                {userInitials}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Student'}</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </div>
            
            {/* Settings & Logout */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/settings"
                className="p-2 rounded-lg text-gray-600 hover:text-[#FF6B35] hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={isActive ? { background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' } : {}}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              )
            })}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Settings className="w-5 h-5" />
                Settings
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleSignOut()
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

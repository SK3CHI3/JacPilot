import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  
  const navLinks = [
    { path: '/courses', label: 'Courses' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/schedule', label: 'Schedule' },
    { path: '/forum', label: 'Forum' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-dark-bg/95 backdrop-blur-sm border-b border-dark-border z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              JacPilot
            </h1>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? 'bg-purple-primary text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Language Flags */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">ES</span>
              <span className="text-xs text-gray-400">UA</span>
              <span className="text-xs text-gray-400">JP</span>
              <span className="text-xs text-gray-400">+6</span>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold">Marianna Carson</p>
                <p className="text-xs text-gray-400">Student</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold">MC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar


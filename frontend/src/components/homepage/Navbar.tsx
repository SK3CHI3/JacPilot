import { Link } from 'react-router-dom'
import { Rocket, Home, Package, Plug } from 'lucide-react'

function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-6">
      <div 
        className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-2xl shadow-2xl"
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
        }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold flex items-center gap-2 group">
              <div className="p-2 rounded-lg group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}>
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                JacPilot
              </span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-[#FF6B35] font-medium transition-colors">
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link to="/product" className="flex items-center gap-2 text-gray-700 hover:text-[#FF6B35] font-medium transition-colors">
                <Package className="w-4 h-4" />
                Product
              </Link>
              <Link to="/integration" className="flex items-center gap-2 text-gray-700 hover:text-[#FF6B35] font-medium transition-colors">
                <Plug className="w-4 h-4" />
                Integration
              </Link>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2 rounded-lg font-medium text-gray-700 hover:text-[#FF6B35] transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                style={{ 
                  background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)',
                  color: 'white'
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar


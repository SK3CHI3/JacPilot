import { Link } from 'react-router-dom'
import { Rocket, Home, Package, Plug } from 'lucide-react'

function Navbar() {
  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
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
          
          {/* CTA Button */}
          <Link
            to="/dashboard"
            className="px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
            style={{ 
              background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)',
              color: 'white'
            }}
          >
            Try Demo
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar


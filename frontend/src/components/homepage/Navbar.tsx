import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            JacPilot
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">
              Home
            </Link>
            <Link to="/product" className="text-gray-700 hover:text-gray-900 font-medium">
              Product
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-gray-900 font-medium">
              Pricing
            </Link>
            <Link to="/integration" className="text-gray-700 hover:text-gray-900 font-medium">
              Integration
            </Link>
          </div>
          
          {/* CTA Button */}
          <Link
            to="/dashboard"
            className="px-6 py-2 border-2 border-blue-500 text-blue-500 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Try Demo
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar


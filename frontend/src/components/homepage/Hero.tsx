import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Content */}
        <div className="space-y-6">
          <p className="text-gray-600 text-sm font-medium">With JacPilot,</p>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Make learning Jaseci more interesting!
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            JacPilot is an adaptive learning platform to help you master Jaseci through 
            interactive lessons, quizzes, and personalized learning paths.
          </p>
          
          <div className="flex gap-4 pt-4">
            <Link
              to="/dashboard"
              className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg"
            >
              Let's do it!
            </Link>
            <Link
              to="/product"
              className="btn-outline border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50"
            >
              Learn more
            </Link>
          </div>
        </div>
        
        {/* Right Side - Visual */}
        <div className="relative">
          <div className="relative bg-gradient-to-b from-purple-400 via-pink-400 to-blue-400 rounded-2xl p-12 aspect-square flex items-center justify-center">
            {/* 3D Visual Element - Abstract Code/Graph representation */}
            <div className="relative w-full h-full">
              {/* Abstract nodes and connections */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 bg-white/30 rounded-lg backdrop-blur-sm transform hover:scale-110 transition-transform"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Connecting lines */}
              <svg className="absolute inset-0 w-full h-full opacity-50">
                <line x1="20%" y1="20%" x2="80%" y2="80%" stroke="white" strokeWidth="2" />
                <line x1="80%" y1="20%" x2="20%" y2="80%" stroke="white" strokeWidth="2" />
              </svg>
            </div>
          </div>
          
          {/* Section Number */}
          <div className="absolute bottom-0 right-0 flex items-center gap-2 text-gray-400">
            <div className="w-px h-12 bg-gray-300"></div>
            <span className="text-sm font-mono">01</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero


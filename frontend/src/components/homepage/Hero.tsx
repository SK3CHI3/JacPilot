import { Link } from 'react-router-dom'
import { ArrowRight, Play } from 'lucide-react'

function Hero() {
  return (
    <section 
      className="container mx-auto px-6 py-24 relative"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.03) 0%, rgba(255, 210, 63, 0.03) 100%)'
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-block">
            <span className="text-sm font-semibold px-4 py-2 rounded-full shadow-sm" style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)', color: 'white' }}>
              With JacPilot,
            </span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
            Make learning Jaseci more interesting!
          </h1>
          
          {/* Description */}
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            JacPilot is an adaptive learning platform to help you master Jaseci through 
            interactive lessons, quizzes, and personalized learning paths powered by AI.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-lg font-semibold text-lg text-white transition-all transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center gap-2"
              style={{ 
                background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)'
              }}
            >
              <Play className="w-5 h-5" />
              Let's do it!
            </Link>
            <Link
              to="/product"
              className="px-8 py-4 rounded-lg font-semibold text-lg border-2 transition-all hover:bg-gray-50 flex items-center gap-2"
              style={{ 
                borderColor: '#FF6B35',
                color: '#FF6B35'
              }}
            >
              Learn more
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero


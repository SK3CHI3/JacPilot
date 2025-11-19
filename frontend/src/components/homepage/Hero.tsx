import { Link } from 'react-router-dom'
import { ArrowRight, Play } from 'lucide-react'

function Hero() {
  return (
    <section className="container mx-auto px-6 py-24">
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
        
        {/* Hero Image/Visual - Modern illustration */}
        <div className="mt-16 relative">
          <div 
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)',
              aspectRatio: '16/9'
            }}
          >
            {/* SVG Illustration of code/graph */}
            <svg className="w-full h-full" viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background gradient */}
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#FF6B35', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#FFD23F', stopOpacity:1}} />
                </linearGradient>
              </defs>
              
              {/* Code blocks */}
              <g opacity="0.9">
                <rect x="100" y="80" width="200" height="120" rx="8" fill="white" fillOpacity="0.2" />
                <text x="120" y="110" fill="white" fontSize="14" fontFamily="monospace">walker learn</text>
                <text x="120" y="135" fill="white" fontSize="14" fontFamily="monospace" opacity="0.7">{'{'}</text>
                <text x="140" y="160" fill="white" fontSize="14" fontFamily="monospace">has mastery;</text>
                <text x="120" y="185" fill="white" fontSize="14" fontFamily="monospace" opacity="0.7">{'}'}</text>
              </g>
              
              {/* Graph nodes */}
              <circle cx="500" cy="150" r="40" fill="white" fillOpacity="0.3" />
              <circle cx="600" cy="250" r="40" fill="white" fillOpacity="0.3" />
              <circle cx="500" cy="300" r="40" fill="white" fillOpacity="0.3" />
              
              {/* Connecting lines */}
              <line x1="540" y1="150" x2="580" y2="230" stroke="white" strokeWidth="3" strokeOpacity="0.5" />
              <line x1="540" y1="300" x2="580" y2="240" stroke="white" strokeWidth="3" strokeOpacity="0.5" />
              <line x1="500" y1="190" x2="500" y2="260" stroke="white" strokeWidth="3" strokeOpacity="0.5" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero


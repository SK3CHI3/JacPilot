import { Brain, BarChart3, Code, Zap, Target, Users, BookOpen } from 'lucide-react'

function FeatureCards() {
  const features = [
    { 
      icon: Brain, 
      title: 'AI-Powered Learning', 
      desc: 'byLLM integration for personalized learning paths',
      image: '🧠'
    },
    { 
      icon: BarChart3, 
      title: 'Progress Tracking', 
      desc: 'Visual skill maps and detailed analytics',
      image: '📊'
    },
    { 
      icon: Code, 
      title: 'Interactive Code Editor', 
      desc: 'Practice with real-time feedback and testing',
      image: '💻'
    },
  ]
  
  const stats = [
    { icon: Users, value: '10K+', label: 'Active Learners' },
    { icon: BookOpen, value: '500+', label: 'Concepts' },
    { icon: Target, value: '95%', label: 'Success Rate' },
    { icon: Zap, value: '24/7', label: 'Available' },
  ]
  
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">Why Choose JacPilot?</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          An adaptive learning platform designed to help you master Jaseci through interactive experiences
        </p>
      </div>
      
      {/* Features Grid - Modern Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
        {features.map((item, idx) => {
          const IconComponent = item.icon
          return (
            <div
              key={idx}
              className="group relative"
            >
              {/* Image/Visual Area */}
              <div 
                className="relative h-64 rounded-2xl overflow-hidden mb-6 shadow-xl"
                style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl opacity-20">{item.image}</div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm"
                    style={{ background: 'rgba(255, 255, 255, 0.3)' }}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Stats Section - Clean Layout */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon
            return (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeatureCards


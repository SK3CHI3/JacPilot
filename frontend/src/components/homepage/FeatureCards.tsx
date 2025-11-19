import { Zap, Target, Users, BookOpen } from 'lucide-react'

function FeatureCards() {
  const features = [
    { 
      title: 'AI-Powered Learning', 
      desc: 'byLLM integration for personalized learning paths',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&q=80'
    },
    { 
      title: 'Progress Tracking', 
      desc: 'Visual skill maps and detailed analytics',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80'
    },
    { 
      title: 'Interactive Code Editor', 
      desc: 'Practice with real-time feedback and testing',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop&q=80'
    },
  ]
  
  const stats = [
    { icon: Users, value: '10K+', label: 'Active Learners' },
    { icon: BookOpen, value: '500+', label: 'Concepts' },
    { icon: Target, value: '95%', label: 'Success Rate' },
    { icon: Zap, value: '24/7', label: 'Available' },
  ]
  
  return (
    <section 
      className="container mx-auto px-6 py-20"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.02) 0%, rgba(255, 210, 63, 0.02) 100%)'
      }}
    >
      <div className="text-center mb-16">
        <h2 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-4">What JacPilot Offers</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          An adaptive learning platform designed to help you master Jaseci through interactive experiences
        </p>
      </div>
      
      {/* Features - Stacked Images with Side Descriptions */}
      <div className="max-w-7xl mx-auto mb-20">
        {features.map((item, idx) => {
          const isEven = idx % 2 === 0; // Alternate left/right for descriptions
          
          return (
            <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16 last:mb-0">
              {/* Single Image */}
              <div 
                className={`relative h-[400px] ${isEven ? 'lg:order-1' : 'lg:order-2'}`}
              >
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              
              {/* Description - Alternate sides */}
              <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <h3 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">{item.title}</h3>
                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">{item.desc}</p>
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


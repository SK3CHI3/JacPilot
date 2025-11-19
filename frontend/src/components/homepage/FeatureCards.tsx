function FeatureCards() {
  const features = [
    {
      icon: '🏅',
      title: 'More than 500 Concepts',
      description: 'Master Jaseci with comprehensive lessons covering all aspects of the language.',
      cta: 'Check out!',
      gradient: 'from-yellow-400 to-orange-500',
    },
    {
      icon: '✨',
      title: 'Added 43 new lessons',
      description: 'Fresh content added regularly to keep your learning journey exciting.',
      cta: 'Check out!',
      gradient: 'from-pink-400 to-blue-500',
    },
  ]
  
  return (
    <section className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-3xl mb-4`}>
              {feature.icon}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {feature.title}
            </h3>
            
            <p className="text-gray-600 mb-6">
              {feature.description}
            </p>
            
            <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
              {feature.cta}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeatureCards


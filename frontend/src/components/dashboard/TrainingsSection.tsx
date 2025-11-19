import { useState } from 'react'

function TrainingsSection() {
  const [activeCategory, setActiveCategory] = useState('Traveling')
  
  const trainings = [
    { title: 'Vocabulary', value: '12,567', unit: 'words', progress: 85, color: 'green' },
    { title: 'Listening', value: '37', unit: 'h audio', progress: 60, color: 'yellow' },
    { title: 'Grammar', value: '60', unit: 'lessons', progress: 45, color: 'yellow' },
  ]
  
  const categories = [
    { name: 'Food', icon: '🍔' },
    { name: 'Traveling', icon: '✈️' },
    { name: 'Sport', icon: '⚽' },
    { name: 'Animals', icon: '🐾' },
    { name: 'Health', icon: '🏥' },
    { name: 'Science', icon: '🔬' },
    { name: 'Work', icon: '💼' },
    { name: 'Other', icon: '📚' },
  ]
  
  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Trainings</h2>
        <p className="text-gray-400 text-sm">Easily improve language knowledge every day!</p>
      </div>
      
      {/* Training Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {trainings.map((training, index) => (
          <div
            key={training.title}
            className={`p-4 rounded-lg ${
              index === 0 
                ? 'bg-green-primary/20 border border-green-primary/30' 
                : 'bg-dark-border'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{training.title}</h3>
              {index === 0 && <span className="text-2xl">📚</span>}
            </div>
            <p className="text-2xl font-bold mb-2">
              {training.value} <span className="text-sm text-gray-400">{training.unit}</span>
            </p>
            <div className="progress-bar">
              <div 
                className={`progress-fill ${
                  training.color === 'green' ? 'bg-gradient-green' : 'bg-gradient-primary'
                }`}
                style={{ width: `${training.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Category Filters */}
      <div>
        <p className="text-sm text-gray-400 mb-3">Choose category</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeCategory === category.name
                  ? 'bg-gradient-primary text-white'
                  : 'bg-dark-border text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrainingsSection


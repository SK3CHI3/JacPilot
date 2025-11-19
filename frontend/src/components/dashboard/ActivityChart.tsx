function ActivityChart() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const activityData = [85, 92, 78, 95, 88, 0, 0] // Percentage for each day
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
      
      {/* Days with Checkmarks */}
      <div className="flex justify-between mb-4">
        {days.map((day, index) => (
          <div key={day} className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${
              activityData[index] > 0 
                ? 'bg-green-primary' 
                : 'bg-dark-border'
            }`}>
              {activityData[index] > 0 && (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className={`text-xs ${
              day === 'Fri' ? 'text-purple-primary font-semibold' : 'text-gray-400'
            }`}>
              {day}
            </span>
          </div>
        ))}
      </div>
      
      {/* Bar Chart */}
      <div className="flex items-end justify-between gap-2 h-24">
        {activityData.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-gradient-purple rounded-t transition-all duration-500"
              style={{ height: `${value}%` }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityChart


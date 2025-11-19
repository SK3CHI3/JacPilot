function PracticeSection() {
  return (
    <div className="space-y-4">
      {/* Practice Speaking */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-green flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <h3 className="font-semibold">Practice speaking</h3>
        </div>
        
        <div className="bg-dark-border rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-300 font-mono">
            walker count_nodes {'{'}
            <br />
            &nbsp;&nbsp;has count = 0;
            <br />
            &nbsp;&nbsp;// Your code here
            <br />
            {'}'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex-1 bg-dark-border hover:bg-dark-border/80 rounded-lg p-3 flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-400">Record</span>
          </button>
          <div className="flex-1 h-12 bg-dark-border rounded-lg flex items-center justify-center">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-green-primary rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Fast Repeat */}
      <div className="card bg-gradient-to-br from-dark-card to-dark-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">Vocabulary</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-gray-400">10 min practice</span>
            </div>
            <h3 className="text-xl font-bold">Fast repeat</h3>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-6xl">🤖</div>
          <button className="w-16 h-16 rounded-full bg-gradient-purple flex items-center justify-center hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PracticeSection


function VideoCallPanel() {
  return (
    <div className="card relative overflow-hidden">
      {/* Video Frame */}
      <div className="relative bg-dark-border rounded-lg aspect-video mb-4 flex items-center justify-center">
        {/* Placeholder for video - would be actual video component */}
        <div className="flex items-center justify-center gap-8">
          {/* Participant 1 */}
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-purple flex items-center justify-center mb-2">
              <span className="text-2xl">👨</span>
            </div>
            <p className="text-sm text-gray-300">Martin</p>
          </div>
          
          {/* Participant 2 */}
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-green flex items-center justify-center mb-2">
              <span className="text-2xl">👩</span>
            </div>
            <p className="text-sm text-gray-300">Francesca</p>
          </div>
        </div>
        
        {/* Online Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-primary px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-white">ONLINE</span>
        </div>
      </div>
      
      {/* Join Button */}
      <button className="btn-primary w-full flex items-center justify-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Join speaking club
      </button>
    </div>
  )
}

export default VideoCallPanel


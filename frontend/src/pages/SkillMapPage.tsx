import { useNavigate } from 'react-router-dom'
import { useMastery } from '../hooks/useMastery'
import { SkillMapVisualization } from '../components/skill-map/SkillMapVisualization'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'

export default function SkillMapPage() {
  const navigate = useNavigate()
  const { skillMap, weakAreas, loading, error } = useMastery()

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading skill map...</div>
      </div>
    )
  }

  if (error || !skillMap) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Error loading skill map: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          ← Back to Dashboard
        </Button>

        <SkillMapVisualization data={skillMap} />

        {weakAreas && weakAreas.length > 0 && (
          <Card className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Areas for Improvement</h2>
            <div className="space-y-3">
              {weakAreas.map((area: any, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-dark-border rounded-lg border border-dark-border"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{area.concept}</h3>
                    <span className="text-sm text-gray-400">
                      Proficiency: {(area.proficiency * 100).toFixed(0)}%
                    </span>
                  </div>
                  {area.recommendation && (
                    <p className="text-sm text-gray-400">{area.recommendation}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}


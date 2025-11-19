import { useEffect, useRef } from 'react'
import { SkillMapData } from '../../types'
import { Card } from '../common/Card'

interface SkillMapVisualizationProps {
  data: SkillMapData
}

export function SkillMapVisualization({ data }: SkillMapVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = 600

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw edges first
    data.edges.forEach((edge) => {
      const fromNode = data.nodes.find((n) => n.id === edge.from)
      const toNode = data.nodes.find((n) => n.id === edge.to)

      if (!fromNode || !toNode) return

      // Calculate positions (simplified circular layout)
      const fromIndex = data.nodes.indexOf(fromNode)
      const toIndex = data.nodes.indexOf(toNode)

      const fromX =
        canvas.width / 2 +
        Math.cos((fromIndex / data.nodes.length) * Math.PI * 2) * 200
      const fromY =
        canvas.height / 2 +
        Math.sin((fromIndex / data.nodes.length) * Math.PI * 2) * 200

      const toX =
        canvas.width / 2 +
        Math.cos((toIndex / data.nodes.length) * Math.PI * 2) * 200
      const toY =
        canvas.height / 2 +
        Math.sin((toIndex / data.nodes.length) * Math.PI * 2) * 200

      // Draw edge
      ctx.strokeStyle =
        edge.type === 'prerequisite' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 211, 63, 0.3)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)
      ctx.stroke()
    })

    // Draw nodes
    data.nodes.forEach((node, index) => {
      const x =
        canvas.width / 2 +
        Math.cos((index / data.nodes.length) * Math.PI * 2) * 200
      const y =
        canvas.height / 2 +
        Math.sin((index / data.nodes.length) * Math.PI * 2) * 200

      // Node circle
      const radius = 30 + node.proficiency * 20
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, node.color)
      gradient.addColorStop(1, node.color + '80')

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()

      // Node border
      ctx.strokeStyle = node.proficiency > 0.7 ? '#10B981' : '#71717A'
      ctx.lineWidth = 2
      ctx.stroke()

      // Node label
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.label.substring(0, 10), x, y)
    })
  }, [data])

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Skill Map</h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{data.summary.total_concepts}</div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-primary">{data.summary.mastered}</div>
            <div className="text-sm text-gray-400">Mastered</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-primary">{data.summary.in_progress}</div>
            <div className="text-sm text-gray-400">In Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-400">{data.summary.not_started}</div>
            <div className="text-sm text-gray-400">Not Started</div>
          </div>
        </div>
      </div>

      <div className="border border-dark-border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: '600px' }}
        />
      </div>

      <div className="mt-6 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-purple-primary"></div>
          <span className="text-gray-400">Prerequisites</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-primary"></div>
          <span className="text-gray-400">Recommendations</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-primary"></div>
          <span className="text-gray-400">Mastered (70%+)</span>
        </div>
      </div>
    </Card>
  )
}


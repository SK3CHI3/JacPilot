import { cn } from '../../utils/cn'

interface ProgressBarProps {
  value: number // 0-100
  max?: number
  showLabel?: boolean
  color?: 'green' | 'yellow' | 'purple' | 'orange'
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  color = 'green',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const colors = {
    green: 'bg-gradient-green',
    yellow: 'bg-gradient-primary',
    purple: 'bg-gradient-purple',
    orange: 'bg-orange-primary',
  }
  
  return (
    <div className={cn('w-full', className)}>
      <div className="progress-bar">
        <div
          className={cn('progress-fill', colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  )
}


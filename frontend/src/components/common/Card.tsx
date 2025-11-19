import { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'gradient' | 'outlined'
}

export function Card({ children, className, variant = 'default' }: CardProps) {
  const baseStyles = 'rounded-card p-6 shadow-card'
  
  const variants = {
    default: 'bg-dark-card border border-dark-border',
    gradient: 'bg-gradient-primary',
    outlined: 'bg-transparent border-2 border-dark-border',
  }
  
  return (
    <div className={cn(baseStyles, variants[variant], className)}>
      {children}
    </div>
  )
}


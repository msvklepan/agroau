import type { ReactNode } from 'react'
import { Zap } from 'lucide-react'

type Variant = 'lime' | 'blue' | 'orange' | 'surface'

interface Props {
  variant: Variant
  children: ReactNode
  dot?: boolean
  pulse?: boolean
  lightning?: boolean
  className?: string
}

export function Badge({ variant, children, dot, pulse, lightning, className = '' }: Props) {
  const variantClass: Record<Variant, string> = {
    lime:    'badge badge-lime',
    blue:    'badge badge-blue',
    orange:  'badge badge-orange',
    surface: 'badge badge-surface',
  }

  return (
    <span className={`${variantClass[variant]} ${className}`}>
      {lightning && (
        <Zap size={9} fill="currentColor" className="flex-shrink-0" />
      )}
      {dot && !lightning && (
        <span
          className={`inline-block w-[5px] h-[5px] rounded-full bg-current flex-shrink-0 ${pulse ? 'dot-active' : ''}`}
        />
      )}
      {children}
    </span>
  )
}

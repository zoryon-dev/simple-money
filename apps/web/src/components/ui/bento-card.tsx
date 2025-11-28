// Simple Money - Bento Card Component
// Card customizado para o Bento Grid do Simple Money

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BentoCardProps {
  children: ReactNode
  className?: string
  colSpan?: 1 | 2 | 3
  rowSpan?: 1 | 2
}

export function BentoCard({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl',
        'bg-card border border-border',
        'transition-all duration-300 hover:shadow-lg',
        // Col span
        colSpan === 1 && 'col-span-1',
        colSpan === 2 && 'col-span-1 md:col-span-2',
        colSpan === 3 && 'col-span-1 md:col-span-2 lg:col-span-3',
        // Row span
        rowSpan === 2 && 'row-span-2',
        className
      )}
    >
      {children}
    </div>
  )
}


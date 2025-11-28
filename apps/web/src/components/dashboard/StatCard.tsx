// Simple Money - Stat Card Component
// Card de estatística com valor e variação

import { ArrowDown, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number
  currency?: 'BRL'
  trend?: {
    value: number
    type: 'up' | 'down'
  }
  className?: string
}

function formatCurrency(value: number, currency: 'BRL' = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value)
}

export function StatCard({
  title,
  value,
  currency = 'BRL',
  trend,
  className,
}: StatCardProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div className="flex flex-col gap-1">
        <p className="text-3xl font-bold tracking-tight text-foreground">
          {formatCurrency(value, currency)}
        </p>
        {trend && (
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex items-center gap-0.5 text-xs font-medium',
                trend.type === 'up'
                  ? 'text-emerald-600 dark:text-emerald-500'
                  : 'text-red-600 dark:text-red-500'
              )}
            >
              {trend.type === 'up' ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              vs mês anterior
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


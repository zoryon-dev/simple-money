// Simple Money - Savings Goal Card Component
// Card mostrando caixinhas/objetivos de economia

import { useAppStore } from '@/stores/useAppStore'
import * as LucideIcons from 'lucide-react'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function getIcon(iconName: string) {
  const IconComponent =
    (LucideIcons as any)[iconName] || LucideIcons.PiggyBank
  return IconComponent
}

export function SavingsGoalCard() {
  const { savingsGoals } = useAppStore()
  const activeGoals = savingsGoals.filter((goal) => !goal.isCompleted)

  if (activeGoals.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium text-muted-foreground">Caixinhas</h3>
        <p className="text-sm text-muted-foreground">Nenhum objetivo criado</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-muted-foreground">Caixinhas</h3>
      <div className="flex flex-col gap-3">
        {activeGoals.map((goal) => {
          const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
          const Icon = getIcon(goal.icon)

          return (
            <div
              key={goal.id}
              className="flex items-center gap-3 p-3 rounded-lg border"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0"
                style={{ backgroundColor: goal.color + '20' }}
              >
                <Icon className="h-5 w-5" style={{ color: goal.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{goal.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: goal.color,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{progress.toFixed(0)}%</span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold">{formatCurrency(goal.currentAmount)}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(goal.targetAmount)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


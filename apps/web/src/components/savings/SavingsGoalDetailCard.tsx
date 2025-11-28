import { Plus, Minus, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/useAppStore'
import type { SavingsGoal } from '@/types'
import * as LucideIcons from 'lucide-react'

interface SavingsGoalDetailCardProps {
    goal: SavingsGoal
    onDeposit: () => void
    onWithdraw: () => void
    onEdit: () => void
}

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

export function SavingsGoalDetailCard({
    goal,
    onDeposit,
    onWithdraw,
    onEdit,
}: SavingsGoalDetailCardProps) {
    const { getBankAccount } = useAppStore()
    const account = getBankAccount(goal.bankAccountId)
    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
    const Icon = getIcon(goal.icon)
    const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0)

    return (
        <div className="flex flex-col gap-6 rounded-xl border bg-card p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div
                        className="flex h-14 w-14 items-center justify-center rounded-full"
                        style={{ backgroundColor: goal.color + '20' }}
                    >
                        <Icon className="h-7 w-7" style={{ color: goal.color }} />
                    </div>
                    <div>
                        <h3 className="text-h3">{goal.name}</h3>
                        <p className="text-small text-muted-foreground">
                            Guardado em: {account?.name}
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onEdit}>
                    <Settings className="h-5 w-5 text-muted-foreground" />
                </Button>
            </div>

            {/* Progress */}
            <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                    <span className="text-body font-medium">
                        {formatCurrency(goal.currentAmount)}
                        <span className="text-muted-foreground font-normal">
                            {' '}
                            de {formatCurrency(goal.targetAmount)}
                        </span>
                    </span>
                    <span className="text-small font-bold">{progress.toFixed(1)}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${progress}%`,
                            backgroundColor: goal.color,
                        }}
                    />
                </div>
            </div>

            {/* Info & Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                    {goal.deadline && (
                        <p className="text-caption text-muted-foreground">
                            📅 Meta: {goal.deadline.toLocaleDateString('pt-BR')}
                        </p>
                    )}
                    {remaining > 0 && (
                        <p className="text-caption text-muted-foreground">
                            💡 Faltam {formatCurrency(remaining)}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={onWithdraw} className="gap-1">
                        <Minus className="h-4 w-4" />
                        Retirar
                    </Button>
                    <Button size="sm" onClick={onDeposit} className="gap-1">
                        <Plus className="h-4 w-4" />
                        Depositar
                    </Button>
                </div>
            </div>
        </div>
    )
}

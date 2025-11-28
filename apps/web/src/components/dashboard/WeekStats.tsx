import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value)
}

export function WeekPayables() {
    const { transactions } = useAppStore()

    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 0 })
    const weekEnd = endOfWeek(now, { weekStartsOn: 0 })

    const weekExpenses = transactions
        .filter(t =>
            t.type === 'expense' &&
            isWithinInterval(t.date, { start: weekStart, end: weekEnd })
        )
        .reduce((sum, t) => sum + t.amount, 0)

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <p className="text-xs font-medium text-muted-foreground">A Pagar Esta Semana</p>
            </div>
            <p className="text-2xl font-bold text-red-600">
                {formatCurrency(weekExpenses)}
            </p>
        </div>
    )
}

export function WeekReceivables() {
    const { transactions } = useAppStore()

    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 0 })
    const weekEnd = endOfWeek(now, { weekStartsOn: 0 })

    const weekIncome = transactions
        .filter(t =>
            t.type === 'income' &&
            isWithinInterval(t.date, { start: weekStart, end: weekEnd })
        )
        .reduce((sum, t) => sum + t.amount, 0)

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <p className="text-xs font-medium text-muted-foreground">A Receber Esta Semana</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
                {formatCurrency(weekIncome)}
            </p>
        </div>
    )
}

export function FinancialHealth() {
    const { getTotalBalance, getTotalIncome, getTotalExpenses } = useAppStore()

    const totalBalance = getTotalBalance()
    const monthlyIncome = getTotalIncome(30)
    const monthlyExpenses = getTotalExpenses(30)

    // Calcular saúde: (saldo + receitas) vs despesas
    // Score de 0 a 100
    let healthScore = 0
    let healthLabel = 'Crítico'
    let healthColor = 'text-red-600'

    if (monthlyIncome > 0) {
        const ratio = (totalBalance + monthlyIncome) / (monthlyExpenses || 1)
        healthScore = Math.min(Math.round(ratio * 50), 100)

        if (healthScore >= 80) {
            healthLabel = 'Excelente'
            healthColor = 'text-emerald-600'
        } else if (healthScore >= 60) {
            healthLabel = 'Bom'
            healthColor = 'text-green-600'
        } else if (healthScore >= 40) {
            healthLabel = 'Regular'
            healthColor = 'text-yellow-600'
        } else if (healthScore >= 20) {
            healthLabel = 'Atenção'
            healthColor = 'text-orange-600'
        } else {
            healthLabel = 'Crítico'
            healthColor = 'text-red-600'
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <p className="text-xs font-medium text-muted-foreground">Saúde Financeira</p>
            </div>
            <div className="flex items-baseline gap-2">
                <p className={`text-2xl font-bold ${healthColor}`}>
                    {healthLabel}
                </p>
                <p className="text-sm text-muted-foreground">{healthScore}%</p>
            </div>
        </div>
    )
}

import { TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ForecastMetricsProps {
    balanceProjection: number;
    nextMonthIncome: number;
    nextMonthExpense: number;
    forecastMonths: number;
}

export function ForecastMetrics({ balanceProjection, nextMonthIncome, nextMonthExpense, forecastMonths }: ForecastMetricsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <p className="text-xs font-medium text-muted-foreground">Saldo Projetado ({forecastMonths} meses)</p>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(balanceProjection)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                    Baseado em regressão linear dos últimos 6 meses
                </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <p className="text-xs font-medium text-muted-foreground">Receita Projetada (próximo mês)</p>
                </div>
                <p className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(nextMonthIncome)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Projeção baseada em regressão linear
                </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <p className="text-xs font-medium text-muted-foreground">Despesa Projetada (próximo mês)</p>
                </div>
                <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(nextMonthExpense)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Projeção baseada em regressão linear
                </p>
            </div>
        </div>
    )
}

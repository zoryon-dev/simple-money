import { formatCurrency } from '@/lib/utils'

interface ForecastQuickAnalysisProps {
    balanceChange: number;
    nextMonthIncome: number;
    nextMonthExpense: number;
    forecastMonths: number;
    balanceProjection: number;
}

export function ForecastQuickAnalysis({ balanceChange, nextMonthIncome, nextMonthExpense, forecastMonths, balanceProjection }: ForecastQuickAnalysisProps) {
    return (
        <div className="mt-6 rounded-lg border bg-card p-6">
            <h3 className="text-sm font-medium mb-2">Análise Rápida</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <p>
                    • No próximo mês, espera-se um {balanceChange >= 0 ? 'saldo positivo' : 'déficit'} de{' '}
                    <span className={balanceChange >= 0 ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {formatCurrency(Math.abs(balanceChange))}
                    </span>
                </p>
                <p>
                    • Sua projeção de receita para o próximo mês é de <span className="font-semibold">{formatCurrency(nextMonthIncome)}</span>
                </p>
                <p>
                    • Sua projeção de despesa para o próximo mês é de <span className="font-semibold">{formatCurrency(nextMonthExpense)}</span>
                </p>
                <p>
                    • Em {forecastMonths} meses, projetamos seu saldo em <span className="font-semibold">{formatCurrency(balanceProjection)}</span>
                </p>
            </div>
        </div>
    )
}

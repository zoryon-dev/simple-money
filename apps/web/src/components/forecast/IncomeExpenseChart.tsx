// Simple Money - Income vs Expense Chart
// Gráfico de barras comparando receitas e despesas

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'

interface IncomeExpenseChartProps {
    data: Array<{
        month: string
        income: number
        expense: number
    }>
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
    }).format(value)
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h3 className="text-sm font-medium text-muted-foreground">Receitas vs Despesas</h3>
                <p className="text-xs text-muted-foreground mt-1">Comparação mensal</p>
            </div>

            <ChartContainer className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="month"
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            tickFormatter={formatCurrency}
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: '12px' }}
                            formatter={(value) => value === 'income' ? 'Receitas' : 'Despesas'}
                        />
                        <Bar
                            dataKey="income"
                            fill="hsl(142.1 76.2% 36.3%)"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="expense"
                            fill="hsl(0 84.2% 60.2%)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    )
}

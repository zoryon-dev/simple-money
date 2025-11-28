// Simple Money - Balance Chart
// Gráfico de linha mostrando evolução do saldo

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'

interface BalanceChartProps {
    data: Array<{
        month: string
        balance: number
    }>
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
    }).format(value)
}

export function BalanceChart({ data }: BalanceChartProps) {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h3 className="text-sm font-medium text-muted-foreground">Evolução do Saldo</h3>
                <p className="text-xs text-muted-foreground mt-1">Últimos 6 meses + próximos 3 meses (previsão)</p>
            </div>

            <ChartContainer className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
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
                        <Line
                            type="monotone"
                            dataKey="balance"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    )
}

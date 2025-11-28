import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
import { formatCurrency } from '@/lib/utils'

interface CashFlowChartProps {
    data: {
        label: string;
        income: number;
        expense: number;
    }[]
}

export function CashFlowChart({ data }: CashFlowChartProps) {
    return (
        <div className="flex flex-col gap-4 h-full">
            <div>
                <h3 className="text-lg font-semibold">Fluxo de Caixa</h3>
                <p className="text-sm text-muted-foreground">Entradas vs Saídas no período</p>
            </div>

            <ChartContainer className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                        <XAxis
                            dataKey="label"
                            className="text-xs text-muted-foreground"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={32}
                        />
                        <YAxis
                            tickFormatter={(value) => formatCurrency(value)}
                            className="text-xs text-muted-foreground"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            width={80}
                        />
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                fontSize: '12px'
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        <Bar
                            dataKey="income"
                            name="Receitas"
                            fill="hsl(var(--success))"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                        />
                        <Bar
                            dataKey="expense"
                            name="Despesas"
                            fill="hsl(var(--danger))"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    )
}

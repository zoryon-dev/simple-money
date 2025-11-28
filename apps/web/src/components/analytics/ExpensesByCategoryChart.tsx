import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
import { formatCurrency } from '@/lib/utils'

interface ExpensesByCategoryChartProps {
    data: {
        name: string;
        value: number;
        color: string;
    }[]
}

export function ExpensesByCategoryChart({ data }: ExpensesByCategoryChartProps) {
    // Ordenar por valor (maior para menor)
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    // Se não houver dados
    if (sortedData.length === 0) {
        return (
            <div className="flex flex-col gap-4 h-full">
                <div>
                    <h3 className="text-lg font-semibold">Despesas por Categoria</h3>
                    <p className="text-sm text-muted-foreground">Onde você gastou seu dinheiro</p>
                </div>
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                    Nenhuma despesa no período
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            <div>
                <h3 className="text-lg font-semibold">Despesas por Categoria</h3>
                <p className="text-sm text-muted-foreground">Distribuição dos seus gastos</p>
            </div>

            <ChartContainer className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={sortedData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {sortedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color || `hsl(var(--chart-${(index % 5) + 1}))`} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                fontSize: '12px'
                            }}
                        />
                        <Legend 
                            layout="vertical" 
                            verticalAlign="middle" 
                            align="right"
                            wrapperStyle={{ fontSize: '12px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    )
}

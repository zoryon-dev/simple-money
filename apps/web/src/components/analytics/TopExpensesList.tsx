import { formatCurrency } from '@/lib/utils'
import { Progress } from '@/components/ui/progress' // Assuming we have this, or I'll implement a simple one

interface TopExpensesListProps {
    data: {
        categoryName: string;
        amount: number;
        percentage: number;
        color: string;
    }[]
}

export function TopExpensesList({ data }: TopExpensesListProps) {
    const sortedData = [...data].sort((a, b) => b.amount - a.amount).slice(0, 5); // Top 5

    return (
        <div className="flex flex-col gap-4 h-full">
            <div>
                <h3 className="text-lg font-semibold">Top Despesas</h3>
                <p className="text-sm text-muted-foreground">Maiores gastos do período</p>
            </div>

            <div className="space-y-4">
                {sortedData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma despesa registrada.</p>
                ) : (
                    sortedData.map((item, index) => (
                        <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    {item.categoryName}
                                </span>
                                <span className="text-muted-foreground">
                                    {formatCurrency(item.amount)}
                                </span>
                            </div>
                            <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                                <div
                                    className="h-full flex-1 bg-primary transition-all"
                                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                                />
                            </div>
                            <p className="text-xs text-right text-muted-foreground">{item.percentage.toFixed(1)}%</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

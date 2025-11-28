import { startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/stores/useAppStore'
import { cn } from '@/lib/utils'

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value)
}

export function WeekOverview() {
    const { transactions, updateTransaction } = useAppStore()

    // Pegar semana atual (domingo a sábado)
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 0 }) // 0 = domingo
    const weekEnd = endOfWeek(now, { weekStartsOn: 0 })

    // Filtrar transações da semana
    const weekTransactions = transactions
        .filter(t => isWithinInterval(t.date, { start: weekStart, end: weekEnd }))
        .sort((a, b) => a.date.getTime() - b.date.getTime())

    const handleTogglePaid = (transactionId: string, currentPaidStatus: boolean) => {
        updateTransaction(transactionId, { isPaid: !currentPaidStatus })
    }

    if (weekTransactions.length === 0) {
        return (
            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-muted-foreground">Sua Semana</h3>
                <p className="text-sm text-muted-foreground">Nenhuma transação esta semana</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-muted-foreground">Sua Semana</h3>
            <div className="flex flex-col gap-2">
                {weekTransactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <button
                                onClick={() => handleTogglePaid(transaction.id, transaction.isPaid)}
                                className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                                    transaction.isPaid
                                        ? "bg-emerald-500 border-emerald-500"
                                        : "border-gray-300 hover:border-gray-400"
                                )}
                            >
                                {transaction.isPaid && <Check className="h-3 w-3 text-white" />}
                            </button>

                            <div className="flex flex-col flex-1">
                                <p className="text-sm font-medium">{transaction.description}</p>
                                <p className="text-xs text-muted-foreground">
                                    {format(transaction.date, "EEEE", { locale: ptBR })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="h-5 px-2 text-[10px]">
                                {transaction.scope === 'business' ? 'Negócio' : 'Pessoal'}
                            </Badge>

                            <p
                                className={cn(
                                    "text-sm font-semibold min-w-[80px] text-right",
                                    transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                                )}
                            >
                                {transaction.type === 'income' ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

import { useState, useMemo } from 'react'
import { Plus, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { useAppStore } from '@/stores/useAppStore'
import type { TransactionFilters as FilterType, Transaction } from '@/types'
import { cn } from '@/lib/utils'

type QuickFilter = 'all' | 'to-receive' | 'to-pay'

export function TransactionsPage() {
    const { getFilteredTransactions, transactions: allTransactions } = useAppStore()
    const [filters, setFilters] = useState<FilterType>({})
    const [quickFilter, setQuickFilter] = useState<QuickFilter>('all')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

    const transactions = useMemo(() => {
        let combinedFilters: FilterType = { ...filters }

        if (quickFilter === 'to-receive') {
            combinedFilters.type = 'income'
            combinedFilters.isPaid = false
        } else if (quickFilter === 'to-pay') {
            combinedFilters.type = 'expense'
            combinedFilters.isPaid = false
        }

        return getFilteredTransactions(combinedFilters)
    }, [filters, quickFilter, getFilteredTransactions, allTransactions])

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingTransaction(null)
    }

    return (
        <div className="container-custom py-6 md:py-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Transações</h1>
                    <p className="text-sm text-muted-foreground mt-1">Visualize e gerencie suas entradas e saídas.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className={cn(
                            "gap-2",
                            quickFilter === 'to-receive' && "bg-primary/20 text-primary border-primary"
                        )}
                        onClick={() => setQuickFilter(prev => (prev === 'to-receive' ? 'all' : 'to-receive'))}
                    >
                        <ArrowDownCircle className="h-4 w-4" />
                        A Receber
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className={cn(
                            "gap-2",
                            quickFilter === 'to-pay' && "bg-destructive/20 text-destructive border-destructive"
                        )}
                        onClick={() => setQuickFilter(prev => (prev === 'to-pay' ? 'all' : 'to-pay'))}
                    >
                        <ArrowUpCircle className="h-4 w-4" />
                        A Pagar
                    </Button>
                    <Button size="sm" className="gap-2" onClick={() => setIsModalOpen(true)}>
                        <Plus className="h-4 w-4" />
                        Nova Transação
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <TransactionFilters filters={filters} onChange={setFilters} />

                <div className="rounded-xl border bg-card p-6">
                    <TransactionList transactions={transactions} onEdit={handleEdit} />
                </div>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                transaction={editingTransaction}
            />
        </div>
    )
}

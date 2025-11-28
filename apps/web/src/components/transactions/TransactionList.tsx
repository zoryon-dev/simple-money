import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Transaction } from '@/types'
import { TransactionItem } from './TransactionItem'
import {
    Pagination,
    PaginationContent,
    PaginationItem as PageItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface TransactionListProps {
    transactions: Transaction[]
    onEdit?: (transaction: Transaction) => void
    itemsPerPage?: number
}

export function TransactionList({
    transactions,
    onEdit,
    itemsPerPage = 10
}: TransactionListProps) {
    const [currentPage, setCurrentPage] = useState(1)

    // Calculate pagination
    const totalPages = Math.ceil(transactions.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentTransactions = transactions.slice(startIndex, endIndex)

    const groupedTransactions = useMemo(() => {
        const groups: Record<string, Transaction[]> = {}

        currentTransactions.forEach((transaction) => {
            const key = format(transaction.date, 'MMMM yyyy', { locale: ptBR })
            if (!groups[key]) {
                groups[key] = []
            }
            groups[key].push(transaction)
        })

        return groups
    }, [currentTransactions])

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-body font-medium text-muted-foreground">
                    Nenhuma transação encontrada
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            {Object.entries(groupedTransactions).map(([groupTitle, groupTransactions]) => (
                <div key={groupTitle} className="flex flex-col gap-3">
                    <h3 className="text-small font-semibold uppercase text-muted-foreground px-1">
                        {groupTitle}
                    </h3>
                    <div className="flex flex-col gap-2">
                        {groupTransactions.map((transaction) => (
                            <TransactionItem
                                key={transaction.id}
                                transaction={transaction}
                                onClick={() => onEdit?.(transaction)}
                            />
                        ))}
                    </div>
                </div>
            ))}

            {totalPages > 1 && (
                <Pagination className="mt-4">
                    <PaginationContent>
                        <PageItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (currentPage > 1) setCurrentPage(p => p - 1)
                                }}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PageItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PageItem key={page}>
                                <PaginationLink
                                    href="#"
                                    isActive={page === currentPage}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setCurrentPage(page)
                                    }}
                                >
                                    {page}
                                </PaginationLink>
                            </PageItem>
                        ))}

                        <PageItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (currentPage < totalPages) setCurrentPage(p => p + 1)
                                }}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PageItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}

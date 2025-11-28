import { useState, useMemo } from 'react'
import {
    startOfMonth,
    endOfMonth,
    subMonths,
    startOfYear,
    endOfYear,
    isWithinInterval,
    parseISO,
    format,
    eachDayOfInterval,
    eachMonthOfInterval,
    isSameDay,
    isSameMonth
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Select } from '@/components/ui/select'
import { useAppStore } from '@/stores/useAppStore'
import { CashFlowChart } from '@/components/analytics/CashFlowChart'
import { ExpensesByCategoryChart } from '@/components/analytics/ExpensesByCategoryChart'
import { TopExpensesList } from '@/components/analytics/TopExpensesList'

type Period = 'this-month' | 'last-month' | 'last-3-months' | 'this-year'

export function AnalyticsPage() {
    const { transactions, categories } = useAppStore()
    const [period, setPeriod] = useState<Period>('this-month')

    // 1. Filter Transactions by Date Range
    const { filteredTransactions, dateRange, groupBy } = useMemo(() => {
        const now = new Date()
        let start: Date
        let end: Date = now
        let groupBy: 'day' | 'month' = 'day'

        switch (period) {
            case 'this-month':
                start = startOfMonth(now)
                end = endOfMonth(now)
                groupBy = 'day'
                break
            case 'last-month':
                start = startOfMonth(subMonths(now, 1))
                end = endOfMonth(subMonths(now, 1))
                groupBy = 'day'
                break
            case 'last-3-months':
                start = subMonths(now, 3)
                groupBy = 'month'
                break
            case 'this-year':
                start = startOfYear(now)
                end = endOfYear(now)
                groupBy = 'month'
                break
            default:
                start = startOfMonth(now)
        }

        const filtered = transactions.filter(t => {
            if (!t.isPaid) return false // Consider only paid transactions for analytics? Usually yes for cash flow.
            const date = t.date instanceof Date ? t.date : parseISO(t.date as unknown as string)
            return isWithinInterval(date, { start, end })
        })

        return { filteredTransactions: filtered, dateRange: { start, end }, groupBy }
    }, [transactions, period])

    // 2. Prepare Cash Flow Data
    const cashFlowData = useMemo(() => {
        const data: { label: string; income: number; expense: number; date: Date }[] = []
        let interval: Date[] = []

        try {
            if (groupBy === 'day') {
                interval = eachDayOfInterval(dateRange)
            } else {
                interval = eachMonthOfInterval(dateRange)
            }
        } catch (e) {
            // Fallback if date range is invalid
            return []
        }

        interval.forEach(date => {
            const label = groupBy === 'day'
                ? format(date, 'dd', { locale: ptBR })
                : format(date, 'MMM', { locale: ptBR })

            const transactionsInPeriod = filteredTransactions.filter(t => {
                const tDate = t.date instanceof Date ? t.date : parseISO(t.date as unknown as string)
                return groupBy === 'day'
                    ? isSameDay(tDate, date)
                    : isSameMonth(tDate, date)
            })

            const income = transactionsInPeriod
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0)

            const expense = transactionsInPeriod
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0)

            data.push({ label, income, expense, date })
        })

        return data
    }, [filteredTransactions, dateRange, groupBy])

    // 3. Prepare Category Data
    const categoryData = useMemo(() => {
        const expenses = filteredTransactions.filter(t => t.type === 'expense')
        const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)

        const categoryMap = new Map<string, number>()

        expenses.forEach(t => {
            const current = categoryMap.get(t.categoryId) || 0
            categoryMap.set(t.categoryId, current + t.amount)
        })

        const result = Array.from(categoryMap.entries()).map(([categoryId, amount]) => {
            const category = categories.find(c => c.id === categoryId)
            return {
                name: category?.name || 'Desconhecida',
                value: amount,
                color: category?.color || '#94a3b8',
                percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
            }
        })

        return result.sort((a, b) => b.value - a.value)
    }, [filteredTransactions, categories])

    // 4. Transform for Top Expenses List
    const topExpensesData = useMemo(() => {
        return categoryData.map(c => ({
            categoryName: c.name,
            amount: c.value,
            percentage: c.percentage,
            color: c.color
        }))
    }, [categoryData])


    return (
        <div className="container-custom py-6 md:py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Análise Financeira</h1>
                    <p className="text-sm text-muted-foreground mt-1">Visão detalhada dos seus gastos e receitas</p>
                </div>

                <div className="w-full md:w-auto flex gap-2">
                    <Select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as Period)}
                        className="w-full md:w-[180px]"
                    >
                        <option value="this-month">Este Mês</option>
                        <option value="last-month">Mês Passado</option>
                        <option value="last-3-months">Últimos 3 Meses</option>
                        <option value="this-year">Este Ano</option>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="col-span-full lg:col-span-2 rounded-lg border bg-card p-6 min-h-[350px]">
                    <CashFlowChart data={cashFlowData} />
                </div>
                <div className="rounded-lg border bg-card p-6 min-h-[350px]">
                    <ExpensesByCategoryChart data={categoryData} />
                </div>
                <div className="col-span-full rounded-lg border bg-card p-6">
                    <TopExpensesList data={topExpensesData} />
                </div>
            </div>
        </div>
    )
}

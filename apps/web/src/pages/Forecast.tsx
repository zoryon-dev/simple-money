// Simple Money - Forecast Page
// Página de previsões financeiras com gráficos

import { useMemo, useState, FormEvent } from 'react'
import { subMonths, addMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAppStore } from '@/stores/useAppStore'
import { BalanceChart } from '@/components/forecast/BalanceChart'
import { IncomeExpenseChart } from '@/components/forecast/IncomeExpenseChart'
import { Select } from '@/components/ui/select'
import { linearRegression, formatCurrency } from '@/lib/utils'
import { ForecastMetrics } from '@/components/forecast/ForecastMetrics'
import { ForecastQuickAnalysis } from '@/components/forecast/ForecastQuickAnalysis'
import { WhatIfScenario } from '@/components/forecast/WhatIfScenario'

interface HypotheticalTransaction {
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    month: string;
}

export function ForecastPage() {
    const { transactions, getTotalBalance, getTotalIncome, getTotalExpenses } = useAppStore()
    const [forecastMonths, setForecastMonths] = useState(3)
    const [hypotheticalTransactions, setHypotheticalTransactions] = useState<HypotheticalTransaction[]>([])

    const futureMonths = useMemo(() => {
        const months = []
        const now = new Date()
        for (let i = 1; i <= forecastMonths; i++) {
            const date = addMonths(now, i)
            const monthKey = format(date, 'MMM/yy', { locale: ptBR })
            months.push(monthKey)
        }
        return months
    }, [forecastMonths])

    const handleAddHypothetical = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const newTransaction: HypotheticalTransaction = {
            id: crypto.randomUUID(),
            description: formData.get('description') as string,
            amount: Number(formData.get('amount')),
            type: formData.get('type') as 'income' | 'expense',
            month: formData.get('month') as string,
        }
        setHypotheticalTransactions([...hypotheticalTransactions, newTransaction])
        e.currentTarget.reset()
    }

    const handleRemoveHypothetical = (id: string) => {
        setHypotheticalTransactions(hypotheticalTransactions.filter(t => t.id !== id))
    }

    // Calcular dados para os gráficos
    const chartData = useMemo(() => {
        const months = []
        const now = new Date()

        // Últimos 6 meses
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(now, i)
            const monthKey = format(date, 'MMM/yy', { locale: ptBR })

            const monthTransactions = transactions.filter(t => {
                const tMonth = format(t.date, 'MMM/yy', { locale: ptBR })
                return tMonth === monthKey && t.isPaid
            })

            const income = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0)

            const expense = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0)

            months.push({
                month: monthKey,
                income,
                expense,
                balance: income - expense,
            })
        }

        // Previsão com regressão linear
        const incomeData = months.map((m, i) => ({ x: i, y: m.income }))
        const expenseData = months.map((m, i) => ({ x: i, y: m.expense }))

        const incomeRegression = linearRegression(incomeData)
        const expenseRegression = linearRegression(expenseData)

        let lastBalance = getTotalBalance()

        for (let i = 1; i <= forecastMonths; i++) {
            const date = addMonths(now, i)
            const monthKey = format(date, 'MMM/yy', { locale: ptBR })

            let predictedIncome = Math.max(0, incomeRegression.slope * (5 + i) + incomeRegression.intercept)
            let predictedExpense = Math.max(0, expenseRegression.slope * (5 + i) + expenseRegression.intercept)

            // Adicionar transações hipotéticas
            hypotheticalTransactions.forEach(t => {
                if (t.month === monthKey) {
                    if (t.type === 'income') {
                        predictedIncome += t.amount
                    } else {
                        predictedExpense += t.amount
                    }
                }
            })

            lastBalance += predictedIncome - predictedExpense

            months.push({
                month: monthKey,
                income: predictedIncome,
                expense: predictedExpense,
                balance: lastBalance,
            })
        }

        return months
    }, [transactions, getTotalBalance, forecastMonths, hypotheticalTransactions])

    // Dados apenas dos últimos 6 meses para o gráfico de comparação
    const incomeExpenseData = chartData.slice(0, 6)

    // Dados de evolução do saldo (todos os meses)
    const balanceData = chartData.map((m, i) => {
        let cumulativeBalance = getTotalBalance()
        if (i < 6) {
            // Últimos 6 meses: calcular saldo baseado nas transações
            cumulativeBalance = chartData.slice(0, i + 1).reduce((sum, month) => sum + month.balance, getTotalBalance() - chartData.slice(0, 6).reduce((sum, m) => sum + m.balance, 0))
        } else {
            // Próximos X meses: previsão
            cumulativeBalance = m.balance
        }
        return {
            month: m.month,
            balance: cumulativeBalance,
        }
    })

    // Calcular previsões
    const currentMonth = chartData[5] // Último mês real
    const nextMonth = chartData[6] // Próximo mês
    const balanceProjection = balanceData[balanceData.length -1]?.balance || getTotalBalance()
    const balanceChange = nextMonth.income - nextMonth.expense

    return (
        <div className="container-custom py-6 md:py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold" >Previsões</h1>
                    <p className="text-sm text-muted-foreground mt-1">Análise e projeção financeira</p>
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="forecast-months" className="text-sm font-medium">Ver previsão para:</label>
                    <Select
                        id="forecast-months"
                        value={forecastMonths}
                        onChange={(e) => setForecastMonths(Number(e.target.value))}
                    >
                        <option value="3">3 meses</option>
                        <option value="6">6 meses</option>
                        <option value="12">12 meses</option>
                    </Select>
                </div>
            </div>

            <ForecastMetrics
                balanceProjection={balanceProjection}
                nextMonthIncome={nextMonth.income}
                nextMonthExpense={nextMonth.expense}
                forecastMonths={forecastMonths}
            />

            {/* Gráficos */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg border bg-card p-6">
                    <BalanceChart data={balanceData} />
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <IncomeExpenseChart data={incomeExpenseData} />
                </div>
            </div>

            <ForecastQuickAnalysis
                balanceChange={balanceChange}
                nextMonthIncome={nextMonth.income}
                nextMonthExpense={nextMonth.expense}
                forecastMonths={forecastMonths}
                balanceProjection={balanceProjection}
            />

            <WhatIfScenario
                hypotheticalTransactions={hypotheticalTransactions}
                futureMonths={futureMonths}
                handleAddHypothetical={handleAddHypothetical}
                handleRemoveHypothetical={handleRemoveHypothetical}
            />
        </div>
    )
}

// Simple Money - Dashboard Page
// Página principal com visão geral financeira

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/useAppStore'
import { StatCard } from '@/components/dashboard/StatCard'
import { AccountBalanceCard } from '@/components/dashboard/AccountBalanceCard'
import { SavingsGoalCard } from '@/components/dashboard/SavingsGoalCard'
import { WeekOverview } from '@/components/dashboard/WeekOverview'
import { WeekPayables, WeekReceivables, FinancialHealth } from '@/components/dashboard/WeekStats'
import { ScopeFilter } from '@/components/dashboard/ScopeFilter'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { SmartEntry } from '@/components/dashboard/SmartEntry'
import { InsightsWidget } from '@/components/dashboard/InsightsWidget'
import { useState } from 'react'

export function DashboardPage() {
  const {
    scopeFilter,
    setScopeFilter,
    getTotalBalance,
    getTotalIncome,
    getTotalExpenses,
  } = useAppStore()

  const totalBalance = getTotalBalance()
  const totalIncome = getTotalIncome(30)
  const totalExpenses = getTotalExpenses(30)

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)

  return (
    <div className="container-custom py-6 md:py-8">
      {/* Header com filtro e botão de adicionar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <ScopeFilter value={scopeFilter} onChange={setScopeFilter} />
        </div>
        <Button size="sm" className="gap-2" onClick={() => setIsTransactionModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      {/* AI Smart Entry */}
      <div className="mb-6">
        <SmartEntry />
      </div>

      {/* AI Insights */}
      <InsightsWidget />

      {/* Stats principais */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <StatCard
            title="Saldo Total"
            value={totalBalance}
            currency="BRL"
            trend={{ value: 12, type: 'up' }}
          />
        </div>

        <div className="rounded-lg border bg-card p-6">
          <StatCard
            title="Entradas (30 dias)"
            value={totalIncome}
            currency="BRL"
            trend={{ value: 8, type: 'up' }}
          />
        </div>

        <div className="rounded-lg border bg-card p-6">
          <StatCard
            title="Saídas (30 dias)"
            value={totalExpenses}
            currency="BRL"
            trend={{ value: 3, type: 'down' }}
          />
        </div>
      </div>

      {/* Stats da semana */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <WeekPayables />
        </div>

        <div className="rounded-lg border bg-card p-6">
          <WeekReceivables />
        </div>

        <div className="rounded-lg border bg-card p-6">
          <FinancialHealth />
        </div>
      </div>

      {/* Sua Semana */}
      <div className="mb-6 rounded-lg border bg-card p-6">
        <WeekOverview />
      </div>

      {/* Saldos por Conta */}
      <div className="mb-6 rounded-lg border bg-card p-6">
        <AccountBalanceCard />
      </div>

      {/* Caixinhas */}
      <div className="mb-6 rounded-lg border bg-card p-6">
        <SavingsGoalCard />
      </div>

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />
    </div>
  )
}


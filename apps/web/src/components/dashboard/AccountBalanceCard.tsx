// Simple Money - Account Balance Card Component
// Card mostrando saldos por conta bancária

import { useAppStore } from '@/stores/useAppStore'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function AccountBalanceCard() {
  const { bankAccounts } = useAppStore()
  const activeAccounts = bankAccounts.filter((acc) => acc.isActive)

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-muted-foreground">Saldos por Conta</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {activeAccounts.map((account) => (
          <div
            key={account.id}
            className="flex flex-col gap-1 rounded-lg border p-4 border-l-4"
            style={{ borderLeftColor: account.color }}
          >
            <p className="text-xs text-muted-foreground">{account.name}</p>
            <p className="text-xl font-bold">
              {formatCurrency(account.currentBalance)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}


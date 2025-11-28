// Simple Money - Upcoming Payments Component
// Lista de próximos pagamentos

import { Calendar } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import type { Transaction } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

interface UpcomingPaymentsProps {
  payments: Transaction[]
}

export function UpcomingPayments({ payments }: UpcomingPaymentsProps) {
  const { getCategory, getBankAccount } = useAppStore()

  if (payments.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground" />
        <p className="text-body font-medium">Nenhum pagamento pendente</p>
        <p className="text-small text-muted-foreground">Você está em dia! 🎉</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <h3 className="text-h3">Próximos Pagamentos</h3>
      <div className="flex-1 space-y-2">
        {payments.map((payment) => {
          const category = getCategory(payment.categoryId)
          const account = getBankAccount(payment.bankAccountId)

          return (
            <div
              key={payment.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: category?.color + '20' }}
                >
                  <span className="text-lg">{category?.icon || '💰'}</span>
                </div>
                <div>
                  <p className="text-small font-medium">{payment.description}</p>
                  <p className="text-caption text-muted-foreground">
                    {format(payment.date, "dd 'de' MMMM", { locale: ptBR })} ·{' '}
                    {account?.name}
                  </p>
                </div>
              </div>
              <p className="text-body font-primary font-semibold text-destructive">
                -{formatCurrency(payment.amount)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}


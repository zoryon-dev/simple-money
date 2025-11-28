import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Check, Clock, Repeat } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/useAppStore'
import { Badge } from '@/components/ui/badge'
import type { Transaction } from '@/types'
import * as LucideIcons from 'lucide-react'

interface TransactionItemProps {
  transaction: Transaction
  onClick?: () => void
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function getIcon(iconName: string) {
  const IconComponent =
    (LucideIcons as any)[iconName] || LucideIcons.CircleDollarSign
  return IconComponent
}

export function TransactionItem({ transaction, onClick }: TransactionItemProps) {
  const { getCategory, getBankAccount, updateTransaction } = useAppStore()
  const category = getCategory(transaction.categoryId)
  const account = getBankAccount(transaction.bankAccountId)
  const Icon = getIcon(category?.icon || 'CircleDollarSign')

  const handleTogglePaid = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateTransaction(transaction.id, { isPaid: !transaction.isPaid })
  }

  return (
    <div
      className="group flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
      onClick={onClick}
    >
      <div className={cn("flex items-center gap-3", transaction.isPaid && "opacity-50 grayscale")}>
        {/* Date Box */}
        <div className="flex flex-col items-center justify-center rounded-md bg-muted px-2 py-1 text-center min-w-[3.5rem]">
          <span className="text-xs font-bold uppercase text-muted-foreground">
            {format(transaction.date, 'MMM', { locale: ptBR })}
          </span>
          <span className="text-lg font-bold leading-none">
            {format(transaction.date, 'dd')}
          </span>
        </div>

        {/* Icon */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: category?.color + '20' }}
        >
          <Icon className="h-5 w-5" style={{ color: category?.color }} />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1">
          <p className={cn(
            "text-body font-medium leading-none",
            transaction.isPaid && "line-through text-muted-foreground"
          )}>
            {transaction.description}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-caption text-muted-foreground">{account?.name}</span>

            <Badge
              variant="outline"
              className={cn(
                "h-5 px-1.5 text-[10px] font-normal",
                transaction.scope === 'business' ? "border-blue-200 text-blue-700 bg-blue-50" : "border-green-200 text-green-700 bg-green-50"
              )}
            >
              {transaction.scope === 'business' ? 'Negócio' : 'Pessoal'}
            </Badge>

            {transaction.isRecurring && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] gap-1">
                <Repeat className="h-3 w-3" />
                Recorrente
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <p
          className={cn(
            'text-body font-primary font-semibold',
            transaction.type === 'income' ? 'text-success' : 'text-destructive',
            transaction.isPaid && "opacity-50 grayscale"
          )}
        >
          {transaction.type === 'income' ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </p>

        <button
          onClick={handleTogglePaid}
          className={cn(
            'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border transition-colors',
            transaction.isPaid
              ? 'bg-success border-success text-success-foreground'
              : 'bg-transparent border-muted-foreground/30 text-muted-foreground/30 hover:border-muted-foreground hover:text-muted-foreground'
          )}
          title={transaction.isPaid ? 'Pago' : 'Marcar como pago'}
        >
          {transaction.isPaid ? (
            <Check className="h-4 w-4" />
          ) : (
            <Clock className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}

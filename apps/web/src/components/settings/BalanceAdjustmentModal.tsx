import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAppStore } from '@/stores/useAppStore'
import { cn } from '@/lib/utils'
import type { BankAccount } from '@/types'

interface BalanceAdjustmentModalProps {
    isOpen: boolean
    onClose: () => void
    account: BankAccount | null
}

export function BalanceAdjustmentModal({ isOpen, onClose, account }: BalanceAdjustmentModalProps) {
    const { addTransaction, updateBankAccount, categories } = useAppStore()
    
    const [newBalance, setNewBalance] = useState<number>(0)
    const [date, setDate] = useState<Date>(new Date())
    const [notes, setNotes] = useState('')

    useEffect(() => {
        if (isOpen && account) {
            setNewBalance(account.currentBalance)
            setDate(new Date())
            setNotes('')
        }
    }, [isOpen, account])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!account) return

        const difference = newBalance - account.currentBalance
        
        if (difference === 0) {
            onClose()
            return
        }

        const isIncome = difference > 0
        const absDifference = Math.abs(difference)

        // Find a category for adjustment or pick the first one matching type
        // Idealmente teríamos uma categoria "Ajuste", mas vamos pegar a primeira compatível ou 'Outros'
        const categoryId = categories.find(c => c.type === (isIncome ? 'income' : 'expense'))?.id || categories[0].id

        // Create transaction record
        addTransaction({
            id: crypto.randomUUID(),
            userId: account.userId,
            bankAccountId: account.id,
            categoryId,
            type: isIncome ? 'income' : 'expense',
            scope: 'personal', // Default to personal for adjustments
            description: 'Ajuste de Saldo',
            amount: absDifference,
            date: date,
            isPaid: true,
            isRecurring: false,
            notes: notes || `Ajuste manual de saldo de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(account.currentBalance)} para ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newBalance)}`,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        // Update account balance directly (store logic usually handles balance via transactions, but if we assume simple store:
        // Se a store calcula o saldo baseado nas transações, adicionar a transação já resolve!
        // Mas se a store mantem o saldo da conta separado (como parece ser pelo BankAccount.currentBalance), precisamos atualizar.
        // O `useAppStore.ts` tem `updateBankAccount`.
        
        updateBankAccount(account.id, { currentBalance: newBalance })
        
        onClose()
    }

    if (!account) return null

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Ajustar Saldo"
            className="max-w-md"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Conta</p>
                    <p className="font-semibold">{account.name}</p>
                    <p className="text-sm text-muted-foreground mt-2">Saldo Atual: <span className="text-foreground font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(account.currentBalance)}</span></p>
                </div>

                {/* New Balance */}
                <div>
                    <label className="text-small font-medium text-muted-foreground">Novo Saldo</label>
                    <div className="relative mt-1">
                        <span className="absolute left-3 top-2 text-muted-foreground">R$</span>
                        <Input
                            type="number"
                            step="0.01"
                            className="pl-9 text-lg font-bold"
                            placeholder="0,00"
                            value={newBalance}
                            onChange={e => setNewBalance(parseFloat(e.target.value))}
                            required
                        />
                    </div>
                </div>

                {/* Date */}
                <div>
                    <label className="text-small font-medium text-muted-foreground">Data do Ajuste</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className={cn(
                                    "w-full mt-1 justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => d && setDate(d)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Notes */}
                <div>
                    <label className="text-small font-medium text-muted-foreground">Observação (Opcional)</label>
                    <Input
                        className="mt-1"
                        placeholder="Motivo do ajuste..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit">
                        Confirmar Ajuste
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

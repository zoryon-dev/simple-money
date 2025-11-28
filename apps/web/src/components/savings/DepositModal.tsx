import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useAppStore } from '@/stores/useAppStore'
import type { SavingsGoal, Transaction } from '@/types'

interface DepositModalProps {
    isOpen: boolean
    onClose: () => void
    goal?: SavingsGoal
    type: 'deposit' | 'withdraw'
}

export function DepositModal({ isOpen, onClose, goal, type }: DepositModalProps) {
    const { updateSavingsGoal, addTransaction, updateBankAccount, bankAccounts, categories } = useAppStore()
    const [amount, setAmount] = useState(0)
    const [notes, setNotes] = useState('')
    const [bankAccountId, setBankAccountId] = useState('')

    useEffect(() => {
        if (isOpen) {
            setAmount(0)
            setNotes('')
            setBankAccountId('')
        }
    }, [isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!goal || !amount || !bankAccountId) return

        const account = bankAccounts.find(acc => acc.id === bankAccountId)
        if (!account) return

        // 1. Update Savings Goal Balance
        const newGoalAmount = type === 'deposit'
            ? goal.currentAmount + amount
            : goal.currentAmount - amount

        updateSavingsGoal(goal.id, { currentAmount: newGoalAmount })

        // 2. Update Bank Account Balance
        const newAccountBalance = type === 'deposit'
            ? account.currentBalance - amount // Dinheiro sai da conta para a caixinha
            : account.currentBalance + amount // Dinheiro volta da caixinha para a conta

        updateBankAccount(account.id, { currentBalance: newAccountBalance })

        // 3. Create Transaction Record
        const transactionType = type === 'deposit' ? 'expense' : 'income'
        
        // Find appropriate category (Investment/Savings or fallback)
        const category = categories.find(c => 
            c.type === transactionType && 
            (c.name.toLowerCase().includes('invest') || c.name.toLowerCase().includes('poup') || c.name.toLowerCase().includes('reserva'))
        ) || categories.find(c => c.type === transactionType)

        addTransaction({
            id: crypto.randomUUID(),
            userId: goal.userId,
            bankAccountId: account.id,
            categoryId: category?.id || categories[0].id, // Safe fallback
            type: transactionType,
            scope: 'personal',
            description: type === 'deposit' ? `Depósito em: ${goal.name}` : `Resgate de: ${goal.name}`,
            amount: amount,
            date: new Date(),
            isPaid: true,
            isRecurring: false,
            notes: notes || (type === 'deposit' ? 'Aporte em objetivo' : 'Resgate de objetivo'),
            createdAt: new Date(),
            updatedAt: new Date()
        } as Transaction)

        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={type === 'deposit' ? 'Depositar na Caixinha' : 'Retirar da Caixinha'}
            className="max-w-md"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <h4 className="text-h3 text-center">{goal?.name}</h4>
                    <p className="text-center text-muted-foreground">
                        Saldo atual: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal?.currentAmount || 0)}
                    </p>
                </div>

                <div>
                    <label className="text-small font-medium text-muted-foreground">
                        {type === 'deposit' ? 'Conta de Origem' : 'Conta de Destino'}
                    </label>
                    <Select
                        className="mt-1"
                        value={bankAccountId}
                        onChange={e => setBankAccountId(e.target.value)}
                        required
                    >
                        <option value="">Selecione uma conta...</option>
                        {bankAccounts.map(acc => (
                            <option key={acc.id} value={acc.id}>
                                {acc.name} ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(acc.currentBalance)})
                            </option>
                        ))}
                    </Select>
                </div>

                <div>
                    <label className="text-small font-medium text-muted-foreground">Valor</label>
                    <div className="relative mt-1">
                        <span className="absolute left-3 top-2 text-muted-foreground">R$</span>
                        <Input
                            type="number"
                            step="0.01"
                            className="pl-9 text-lg font-bold"
                            placeholder="0,00"
                            value={amount || ''}
                            onChange={e => setAmount(parseFloat(e.target.value))}
                            required
                            max={type === 'withdraw' ? goal?.currentAmount : undefined}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-small font-medium text-muted-foreground">Observação (Opcional)</label>
                    <Input
                        className="mt-1"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant={type === 'withdraw' ? 'destructive' : 'default'}>
                        {type === 'deposit' ? 'Confirmar Depósito' : 'Confirmar Retirada'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

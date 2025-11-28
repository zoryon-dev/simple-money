import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAppStore } from '@/stores/useAppStore'
import { cn } from '@/lib/utils'
import type { CreateTransactionDTO, Transaction } from '@/types'

interface TransactionModalProps {
    isOpen: boolean
    onClose: () => void
    defaultType?: 'income' | 'expense'
    transaction?: Transaction | null // Para edição
    initialData?: Partial<CreateTransactionDTO> | null
}

export function TransactionModal({ isOpen, onClose, defaultType = 'expense', transaction, initialData }: TransactionModalProps) {
    const { addTransaction, updateTransaction, bankAccounts, categories } = useAppStore()
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const isEditing = !!transaction

    const [formData, setFormData] = useState<Partial<CreateTransactionDTO>>({
        type: defaultType,
        scope: 'personal',
        amount: 0,
        description: '',
        date: new Date(),
        isPaid: true,
        isRecurring: false,
        recurrenceCount: 1,
        recurrenceFrequency: 'monthly'
    })

    // Reset form when opening or transaction changes
    useEffect(() => {
        if (isOpen) {
            if (transaction) {
                // Editing existing transaction
                setFormData({
                    type: transaction.type,
                    scope: transaction.scope,
                    amount: transaction.amount,
                    description: transaction.description,
                    date: transaction.date,
                    isPaid: transaction.isPaid,
                    isRecurring: transaction.isRecurring,
                    recurrenceCount: transaction.recurrenceCount || 1,
                    recurrenceFrequency: transaction.recurrenceFrequency || 'monthly',
                    bankAccountId: transaction.bankAccountId,
                    categoryId: transaction.categoryId,
                    notes: transaction.notes
                })
            } else {
                // Creating new transaction
                setFormData({
                    type: defaultType,
                    scope: 'personal',
                    amount: 0,
                    description: '',
                    date: new Date(),
                    isPaid: true,
                    isRecurring: false,
                    recurrenceCount: 1,
                    recurrenceFrequency: 'monthly',
                    bankAccountId: bankAccounts[0]?.id,
                    categoryId: categories.find(c => c.type === defaultType)?.id,
                    ...initialData
                })
            }
            setShowConfirmDialog(false)
        }
    }, [isOpen, defaultType, transaction, bankAccounts, categories, initialData])

    const handlePreSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.amount || !formData.description || !formData.bankAccountId || !formData.categoryId) {
            return // Validate
        }

        setShowConfirmDialog(true)
    }

    const handleConfirmSubmit = () => {
        if (isEditing && transaction) {
            // Update existing transaction
            updateTransaction(transaction.id, {
                ...formData,
                updatedAt: new Date(),
            } as Partial<Transaction>)
        } else {
            // Add new transaction
            addTransaction({
                id: crypto.randomUUID(),
                userId: '1', // Mock user
                createdAt: new Date(),
                updatedAt: new Date(),
                ...formData,
            } as Transaction)
        }
        setShowConfirmDialog(false)
        onClose()
    }

    const filteredCategories = categories.filter(
        c => c.type === formData.type && c.scope === formData.scope
    )

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={isEditing ? "Editar Transação" : "Nova Transação"}
                className="max-w-xl"
            >
                <form onSubmit={handlePreSubmit} className="flex flex-col gap-6">
                    {/* Type & Scope Toggles */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex gap-2">
                            <Badge
                                variant={formData.type === 'expense' ? 'destructive' : 'outline'}
                                className="cursor-pointer px-4 py-1.5 text-sm"
                                onClick={() => setFormData({ ...formData, type: 'expense' })}
                            >
                                Despesa
                            </Badge>
                            <Badge
                                variant={formData.type === 'income' ? 'default' : 'outline'}
                                className={cn(
                                    "cursor-pointer px-4 py-1.5 text-sm",
                                    formData.type === 'income' && "bg-green-600 hover:bg-green-700"
                                )}
                                onClick={() => setFormData({ ...formData, type: 'income' })}
                            >
                                Receita
                            </Badge>
                        </div>

                        <div className="flex gap-2">
                            <Badge
                                variant={formData.scope === 'personal' ? 'secondary' : 'outline'}
                                className="cursor-pointer px-4 py-1.5 text-sm"
                                onClick={() => setFormData({ ...formData, scope: 'personal' })}
                            >
                                Pessoal
                            </Badge>
                            <Badge
                                variant={formData.scope === 'business' ? 'secondary' : 'outline'}
                                className="cursor-pointer px-4 py-1.5 text-sm"
                                onClick={() => setFormData({ ...formData, scope: 'business' })}
                            >
                                Negócio
                            </Badge>
                        </div>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="text-small font-medium text-muted-foreground">Valor</label>
                        <div className="relative mt-1">
                            <span className="absolute left-3 top-2 text-muted-foreground">R$</span>
                            <Input
                                type="number"
                                step="0.01"
                                className="pl-9 text-lg font-bold"
                                placeholder="0,00"
                                value={formData.amount || ''}
                                onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-small font-medium text-muted-foreground">Descrição</label>
                        <Input
                            className="mt-1"
                            placeholder="Ex: Almoço, Salário, etc."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Category */}
                        <div>
                            <label className="text-small font-medium text-muted-foreground">Categoria</label>
                            <Select
                                className="mt-1"
                                value={formData.categoryId}
                                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                required
                            >
                                <option value="">Selecione...</option>
                                {filteredCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </Select>
                        </div>

                        {/* Account */}
                        <div>
                            <label className="text-small font-medium text-muted-foreground">Conta</label>
                            <Select
                                className="mt-1"
                                value={formData.bankAccountId}
                                onChange={e => setFormData({ ...formData, bankAccountId: e.target.value })}
                                required
                            >
                                <option value="">Selecione...</option>
                                {bankAccounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    {/* Date & Paid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-small font-medium text-muted-foreground">Data</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={cn(
                                            "w-full mt-1 justify-start text-left font-normal",
                                            !formData.date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.date ? format(formData.date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.date}
                                        onSelect={(date) => date && setFormData({ ...formData, date })}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="flex flex-col gap-3 pt-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isPaid"
                                    checked={formData.isPaid}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isPaid: !!checked })}
                                />
                                <label
                                    htmlFor="isPaid"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Já foi pago/recebido
                                </label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isRecurring"
                                    checked={formData.isRecurring}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: !!checked })}
                                />
                                <label
                                    htmlFor="isRecurring"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Transação recorrente
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Campos condicionais de recorrência */}
                    {formData.isRecurring && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t pt-4">
                            <div>
                                <label className="text-small font-medium text-muted-foreground">Frequência</label>
                                <Select
                                    value={formData.recurrenceFrequency}
                                    onChange={(e) => setFormData({ ...formData, recurrenceFrequency: e.target.value as 'weekly' | 'monthly' | 'yearly' })}
                                    className="mt-1"
                                >
                                    <option value="weekly">Semanal</option>
                                    <option value="monthly">Mensal</option>
                                    <option value="yearly">Anual</option>
                                </Select>
                            </div>

                            <div>
                                <label className="text-small font-medium text-muted-foreground">Repetir quantas vezes?</label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="120"
                                    value={formData.recurrenceCount || 1}
                                    onChange={(e) => setFormData({ ...formData, recurrenceCount: parseInt(e.target.value) || 1 })}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            Salvar Transação
                        </Button>
                    </div>
                </form>
            </Modal>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Transação</AlertDialogTitle>
                        <AlertDialogDescription>
                            Você está prestes a adicionar uma {formData.type === 'income' ? 'receita' : 'despesa'} de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(formData.amount || 0)}.
                            Deseja continuar?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmSubmit}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

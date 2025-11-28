import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useAppStore } from '@/stores/useAppStore'
import type { CreateSavingsGoalDTO, SavingsGoal } from '@/types'
import { cn } from '@/lib/utils'

interface SavingsGoalModalProps {
    isOpen: boolean
    onClose: () => void
    goal?: SavingsGoal | null
}

const COLORS = [
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
]

const ICONS = [
    'PiggyBank',
    'Plane',
    'Car',
    'Home',
    'Shield',
    'GraduationCap',
    'Gamepad2',
    'Smartphone',
]

export function SavingsGoalModal({ isOpen, onClose, goal }: SavingsGoalModalProps) {
    const { addSavingsGoal, updateSavingsGoal, bankAccounts } = useAppStore()

    const [formData, setFormData] = useState<Partial<CreateSavingsGoalDTO>>({
        name: '',
        targetAmount: 0,
        color: COLORS[0],
        icon: ICONS[0]
    })

    useEffect(() => {
        if (isOpen) {
            if (goal) {
                setFormData({
                    name: goal.name,
                    targetAmount: goal.targetAmount,
                    color: goal.color,
                    icon: goal.icon,
                    bankAccountId: goal.bankAccountId,
                    deadline: goal.deadline
                })
            } else {
                setFormData({
                    name: '',
                    targetAmount: 0,
                    color: COLORS[0],
                    icon: ICONS[0],
                    bankAccountId: bankAccounts[0]?.id
                })
            }
        }
    }, [isOpen, goal, bankAccounts])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.targetAmount || !formData.bankAccountId) {
            return
        }

        if (goal) {
            updateSavingsGoal(goal.id, formData)
        } else {
            addSavingsGoal({
                id: crypto.randomUUID(),
                userId: '1',
                currentAmount: 0,
                isCompleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                ...formData as any
            })
        }

        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={goal ? "Editar Caixinha" : "Nova Caixinha"}
            className="max-w-lg"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Name */}
                <div>
                    <label className="text-small font-medium text-muted-foreground">Nome do Objetivo</label>
                    <Input
                        className="mt-1"
                        placeholder="Ex: Viagem, Reserva, Carro..."
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                {/* Target Amount */}
                <div>
                    <label className="text-small font-medium text-muted-foreground">Meta (Valor)</label>
                    <div className="relative mt-1">
                        <span className="absolute left-3 top-2 text-muted-foreground">R$</span>
                        <Input
                            type="number"
                            step="0.01"
                            className="pl-9 text-lg font-bold"
                            placeholder="0,00"
                            value={formData.targetAmount || ''}
                            onChange={e => setFormData({ ...formData, targetAmount: parseFloat(e.target.value) })}
                            required
                        />
                    </div>
                </div>

                {/* Account */}
                <div>
                    <label className="text-small font-medium text-muted-foreground">Onde guardar?</label>
                    <Select
                        className="mt-1"
                        value={formData.bankAccountId}
                        onChange={e => setFormData({ ...formData, bankAccountId: e.target.value })}
                        required
                    >
                        <option value="">Selecione uma conta...</option>
                        {bankAccounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                        ))}
                    </Select>
                </div>

                {/* Deadline */}
                <div>
                    <label className="text-small font-medium text-muted-foreground">Data Limite (Opcional)</label>
                    <Input
                        type="date"
                        className="mt-1"
                        value={formData.deadline ? new Date(formData.deadline).toISOString().split('T')[0] : ''}
                        onChange={e => setFormData({ ...formData, deadline: e.target.value ? new Date(e.target.value) : undefined })}
                    />
                </div>

                {/* Color Picker */}
                <div>
                    <label className="text-small font-medium text-muted-foreground">Cor</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {COLORS.map(color => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setFormData({ ...formData, color })}
                                className={cn(
                                    "h-8 w-8 rounded-full border-2 transition-all",
                                    formData.color === color ? "border-foreground scale-110" : "border-transparent hover:scale-105"
                                )}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit">
                        {goal ? "Salvar Alterações" : "Criar Caixinha"}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

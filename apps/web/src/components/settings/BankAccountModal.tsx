import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useAppStore } from '@/stores/useAppStore'
import { cn } from '@/lib/utils'
import type { CreateBankAccountDTO, BankAccount } from '@/types'

interface BankAccountModalProps {
    isOpen: boolean
    onClose: () => void
    account?: BankAccount | null
    onAdjustBalance?: (account: BankAccount) => void
}

const COLORS = [
    '#10B981', // Verde
    '#3B82F6', // Azul
    '#6366F1', // Indigo
    '#8B5CF6', // Roxo
    '#EC4899', // Rosa
    '#EF4444', // Vermelho
    '#F59E0B', // Laranja
    '#111827', // Preto/Cinza Escuro
]

export function BankAccountModal({ isOpen, onClose, account, onAdjustBalance }: BankAccountModalProps) {
    const { addBankAccount, updateBankAccount } = useAppStore()
    const isEditing = !!account

    const [formData, setFormData] = useState<Partial<CreateBankAccountDTO>>({
        name: '',
        type: 'checking',
        color: COLORS[0],
        currentBalance: 0
    })

    useEffect(() => {
        if (isOpen) {
            if (account) {
                setFormData({
                    name: account.name,
                    type: account.type,
                    color: account.color,
                    currentBalance: account.currentBalance
                })
            } else {
                setFormData({
                    name: '',
                    type: 'checking',
                    color: COLORS[0],
                    currentBalance: 0
                })
            }
        }
    }, [isOpen, account])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!formData.name) return

        if (isEditing && account) {
            updateBankAccount(account.id, {
                name: formData.name,
                type: formData.type,
                color: formData.color,
            })
        } else {
            addBankAccount({
                id: crypto.randomUUID(),
                userId: '1',
                isActive: true,
                createdAt: new Date(),
                name: formData.name!,
                type: formData.type!,
                color: formData.color!,
                currentBalance: formData.currentBalance || 0
            })
        }
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Editar Conta Bancária" : "Nova Conta Bancária"}
            className="max-w-md"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Name */}
                <div>
                    <label className="text-small font-medium text-muted-foreground">Nome da Conta</label>
                    <Input
                        className="mt-1"
                        placeholder="Ex: Nubank, Inter, Carteira..."
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                {/* Type */}
                <div>
                    <label className="text-small font-medium text-muted-foreground">Tipo de Conta</label>
                    <Select
                        className="mt-1"
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                        required
                    >
                        <option value="checking">Conta Corrente</option>
                        <option value="savings">Poupança</option>
                        <option value="investment">Investimento</option>
                        <option value="cash">Dinheiro Físico</option>
                    </Select>
                </div>

                {/* Color */}
                <div>
                    <label className="text-small font-medium text-muted-foreground">Cor de Identificação</label>
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {COLORS.map(color => (
                            <button
                                key={color}
                                type="button"
                                className={cn(
                                    "h-8 w-8 rounded-full transition-all hover:scale-110",
                                    formData.color === color ? "ring-2 ring-offset-2 ring-primary scale-110" : ""
                                )}
                                style={{ backgroundColor: color }}
                                onClick={() => setFormData({ ...formData, color })}
                            />
                        ))}
                    </div>
                </div>

                {/* Balance */}
                <div>
                    <label className="text-small font-medium text-muted-foreground">Saldo Atual</label>
                    <div className="flex gap-2 items-center mt-1">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-2 text-muted-foreground">R$</span>
                            <Input
                                type="number"
                                step="0.01"
                                className="pl-9"
                                placeholder="0,00"
                                value={formData.currentBalance}
                                onChange={e => setFormData({ ...formData, currentBalance: parseFloat(e.target.value) })}
                                disabled={isEditing}
                                required
                            />
                        </div>
                        {isEditing && (
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => {
                                    onClose();
                                    if(account && onAdjustBalance) onAdjustBalance(account);
                                }}
                            >
                                Ajustar
                            </Button>
                        )}
                    </div>
                    {isEditing && <p className="text-xs text-muted-foreground mt-1">Para alterar o saldo, use o botão "Ajustar".</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit">
                        Salvar Conta
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useAppStore } from '@/stores/useAppStore'
import { cn } from '@/lib/utils'
import type { CreateCategoryDTO, Category } from '@/types'
import * as Icons from 'lucide-react'

interface CategoryModalProps {
    isOpen: boolean
    onClose: () => void
    category?: Category | null
}

const COLORS = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#F59E0B', // Amber
    '#84CC16', // Lime
    '#10B981', // Emerald
    '#06B6D4', // Cyan
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Violet
    '#D946EF', // Fuchsia
    '#EC4899', // Pink
    '#64748B', // Slate
]

const ICONS = [
    { label: 'Casa', value: 'Home' },
    { label: 'Comida', value: 'Utensils' },
    { label: 'Carro', value: 'Car' },
    { label: 'Compras', value: 'ShoppingBag' },
    { label: 'Saúde', value: 'HeartPulse' },
    { label: 'Contas', value: 'Receipt' },
    { label: 'Lazer', value: 'Gamepad2' },
    { label: 'Viagem', value: 'Plane' },
    { label: 'Trabalho', value: 'Briefcase' },
    { label: 'Dinheiro', value: 'Wallet' },
    { label: 'Educação', value: 'GraduationCap' },
    { label: 'Outros', value: 'CircleDollarSign' },
]

export function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
    const { addCategory, updateCategory } = useAppStore()
    const isEditing = !!category

    const [formData, setFormData] = useState<Partial<CreateCategoryDTO>>({
        name: '',
        type: 'expense',
        scope: 'personal',
        color: COLORS[0],
        icon: 'CircleDollarSign'
    })

    useEffect(() => {
        if (isOpen) {
            if (category) {
                setFormData({
                    name: category.name,
                    type: category.type,
                    scope: category.scope,
                    color: category.color,
                    icon: category.icon
                })
            } else {
                setFormData({
                    name: '',
                    type: 'expense',
                    scope: 'personal',
                    color: COLORS[0],
                    icon: 'CircleDollarSign'
                })
            }
        }
    }, [isOpen, category])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!formData.name) return

        if (isEditing && category) {
            updateCategory(category.id, {
                name: formData.name,
                type: formData.type,
                scope: formData.scope,
                color: formData.color,
                icon: formData.icon
            })
        } else {
            addCategory({
                id: crypto.randomUUID(),
                userId: '1',
                isActive: true,
                isDefault: false,
                name: formData.name!,
                type: formData.type!,
                scope: formData.scope!,
                color: formData.color!,
                icon: formData.icon!
            })
        }
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Editar Categoria" : "Nova Categoria"}
            className="max-w-md"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Name */}
                <div>
                    <label className="text-small font-medium text-muted-foreground">Nome da Categoria</label>
                    <Input
                        className="mt-1"
                        placeholder="Ex: Alimentação, Aluguel..."
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Type */}
                    <div>
                        <label className="text-small font-medium text-muted-foreground">Tipo</label>
                        <Select
                            className="mt-1"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                            required
                        >
                            <option value="expense">Despesa</option>
                            <option value="income">Receita</option>
                        </Select>
                    </div>

                    {/* Scope */}
                    <div>
                        <label className="text-small font-medium text-muted-foreground">Escopo</label>
                        <Select
                            className="mt-1"
                            value={formData.scope}
                            onChange={e => setFormData({ ...formData, scope: e.target.value as any })}
                            required
                        >
                            <option value="personal">Pessoal</option>
                            <option value="business">Negócio</option>
                        </Select>
                    </div>
                </div>

                {/* Icon */}
                <div>
                    <label className="text-small font-medium text-muted-foreground">Ícone</label>
                    <Select
                        className="mt-1"
                        value={formData.icon}
                        onChange={e => setFormData({ ...formData, icon: e.target.value })}
                    >
                        {ICONS.map(icon => (
                            <option key={icon.value} value={icon.value}>{icon.label}</option>
                        ))}
                    </Select>
                </div>

                {/* Color */}
                <div>
                    <label className="text-small font-medium text-muted-foreground">Cor</label>
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

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit">
                        Salvar Categoria
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

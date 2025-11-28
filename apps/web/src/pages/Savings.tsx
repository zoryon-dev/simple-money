import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SavingsGoalDetailCard } from '@/components/savings/SavingsGoalDetailCard'
import { SavingsGoalModal } from '@/components/savings/SavingsGoalModal'
import { DepositModal } from '@/components/savings/DepositModal'
import { useAppStore } from '@/stores/useAppStore'
import type { SavingsGoal } from '@/types'

export function SavingsPage() {
    const { savingsGoals } = useAppStore()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [editingGoal, setEditingGoal] = useState<SavingsGoal | undefined>(undefined)
    const [depositModalState, setDepositModalState] = useState<{
        isOpen: boolean
        type: 'deposit' | 'withdraw'
        goal?: SavingsGoal
    }>({
        isOpen: false,
        type: 'deposit',
        goal: undefined
    })

    const openCreateModal = () => {
        setEditingGoal(undefined)
        setIsCreateModalOpen(true)
    }

    const handleEditGoal = (goal: SavingsGoal) => {
        setEditingGoal(goal)
        setIsCreateModalOpen(true)
    }

    const openDepositModal = (goal: SavingsGoal, type: 'deposit' | 'withdraw') => {
        setDepositModalState({ isOpen: true, type, goal })
    }

    return (
        <div className="container-custom py-6 md:py-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-h1">Caixinhas</h1>
                <Button size="lg" className="gap-2" onClick={openCreateModal}>
                    <Plus className="h-5 w-5" />
                    Nova Meta
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {savingsGoals.map((goal) => (
                    <SavingsGoalDetailCard
                        key={goal.id}
                        goal={goal}
                        onDeposit={() => openDepositModal(goal, 'deposit')}
                        onWithdraw={() => openDepositModal(goal, 'withdraw')}
                        onEdit={() => handleEditGoal(goal)}
                    />
                ))}
            </div>

            {savingsGoals.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-body font-medium text-muted-foreground">
                        Nenhuma caixinha criada ainda. Comece a economizar!
                    </p>
                </div>
            )}

            <SavingsGoalModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                goal={editingGoal || null}
            />

            <DepositModal
                isOpen={depositModalState.isOpen}
                onClose={() => setDepositModalState({ ...depositModalState, isOpen: false })}
                goal={depositModalState.goal}
                type={depositModalState.type}
            />
        </div>
    )
}

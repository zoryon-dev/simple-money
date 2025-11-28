import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, Loader2, ArrowRight } from 'lucide-react'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { useAppStore } from '@/stores/useAppStore'

export function SmartEntry() {
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [modalData, setModalData] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleSmartEntry = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        setIsLoading(true)
        try {
            // MOCK MODE FOR VISUAL VALIDATION
            await new Promise(r => setTimeout(r, 1000))
            
            // Simple parsing logic for mock
            const amountMatch = input.match(/\d+(?:[.,]\d{1,2})?/)
            const amount = amountMatch ? parseFloat(amountMatch[0].replace(',', '.')) : 0
            const type = input.toLowerCase().includes('recebi') || input.toLowerCase().includes('ganhei') ? 'income' : 'expense'
            
            const data = {
                description: input,
                amount: amount,
                type: type,
                date: new Date().toISOString(),
            }
            
            // Prepare data for modal
            setModalData({
                description: data.description,
                amount: data.amount,
                type: data.type,
                date: new Date(data.date),
                // We could also try to match category by name here
            })
            setIsModalOpen(true)
            setInput('')
        } catch (error) {
            console.error('AI Error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="rounded-xl border bg-gradient-to-r from-primary/10 to-transparent p-1">
                <form onSubmit={handleSmartEntry} className="flex gap-2 p-1">
                    <div className="relative flex-1">
                        <Sparkles className="absolute left-3 top-2.5 h-4 w-4 text-primary animate-pulse" />
                        <Input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ex: Almoço no Outback 150 reais..." 
                            className="pl-9 border-0 bg-background shadow-sm focus-visible:ring-0"
                        />
                    </div>
                    <Button type="submit" disabled={isLoading || !input} size="icon">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    </Button>
                </form>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultType={modalData?.type || 'expense'}
                transaction={null} // It's a new transaction
                initialData={modalData} // Need to add this prop to TransactionModal
            />
        </>
    )
}

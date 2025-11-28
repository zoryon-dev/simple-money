import { FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

interface HypotheticalTransaction {
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    month: string;
}

interface WhatIfScenarioProps {
    hypotheticalTransactions: HypotheticalTransaction[];
    futureMonths: string[];
    handleAddHypothetical: (e: FormEvent<HTMLFormElement>) => void;
    handleRemoveHypothetical: (id: string) => void;
}

export function WhatIfScenario({
    hypotheticalTransactions,
    futureMonths,
    handleAddHypothetical,
    handleRemoveHypothetical,
}: WhatIfScenarioProps) {
    return (
        <div className="mt-6 rounded-lg border bg-card p-6">
            <h3 className="text-sm font-medium mb-2">Cenário "What-If"</h3>
            <p className="text-sm text-muted-foreground mb-4">Adicione transações hipotéticas para ver o impacto na sua previsão.</p>
            <form onSubmit={handleAddHypothetical} className="flex flex-col md:flex-row items-center gap-4">
                <Input
                    name="description"
                    placeholder="Descrição (ex: Bônus)"
                    className="flex-1"
                    required
                />
                <Input
                    name="amount"
                    type="number"
                    placeholder="Valor"
                    className="w-full md:w-32"
                    required
                />
                <Select
                    name="month"
                    className="w-full md:w-32"
                    required
                >
                    {futureMonths.map(month => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                </Select>
                <Select
                    name="type"
                    className="w-full md:w-32"
                    required
                >
                    <option value="income">Receita</option>
                    <option value="expense">Despesa</option>
                </Select>
                <Button type="submit">Adicionar</Button>
            </form>
            <div className="mt-4 space-y-2">
                {hypotheticalTransactions.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <p className="text-sm">{t.description} ({t.type})</p>
                        <div className="flex items-center gap-4">
                            <p className={`text-sm font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                                {formatCurrency(t.amount)}
                            </p>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveHypothetical(t.id)}
                            >
                                Remover
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

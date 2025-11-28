import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useAppStore } from '@/stores/useAppStore'
import type { TransactionFilters as FilterType } from '@/types'

interface TransactionFiltersProps {
    filters: FilterType
    onChange: (filters: FilterType) => void
}

export function TransactionFilters({ filters, onChange }: TransactionFiltersProps) {
    const { bankAccounts, categories } = useAppStore()

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...filters, search: e.target.value })
    }

    const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        onChange({ ...filters, bankAccountId: value === 'all' ? undefined : value })
    }

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        onChange({ ...filters, categoryId: value === 'all' ? undefined : value })
    }

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as 'all' | 'income' | 'expense'
        onChange({ ...filters, type: value === 'all' ? undefined : value })
    }

    const handleScopeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as 'all' | 'personal' | 'business'
        onChange({ ...filters, scope: value })
    }

    const handleRecurringChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        onChange({ ...filters, isRecurring: value === 'all' ? undefined : value === 'true' })
    }

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar transações..."
                    value={filters.search || ''}
                    onChange={handleSearchChange}
                    className="pl-9"
                />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                <Select
                    value={filters.bankAccountId || 'all'}
                    onChange={handleAccountChange}
                    className="w-[140px]"
                >
                    <option value="all">Todas Contas</option>
                    {bankAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.name}
                        </option>
                    ))}
                </Select>

                <Select
                    value={filters.categoryId || 'all'}
                    onChange={handleCategoryChange}
                    className="w-[140px]"
                >
                    <option value="all">Todas Categorias</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </Select>

                <Select
                    value={filters.type || 'all'}
                    onChange={handleTypeChange}
                    className="w-[120px]"
                >
                    <option value="all">Todos Tipos</option>
                    <option value="income">Receitas</option>
                    <option value="expense">Despesas</option>
                </Select>

                <Select
                    value={filters.scope || 'all'}
                    onChange={handleScopeChange}
                    className="w-[120px]"
                >
                    <option value="all">Todos Escopos</option>
                    <option value="personal">Pessoal</option>
                    <option value="business">Negócio</option>
                </Select>

                <Select
                    value={filters.isRecurring === undefined ? 'all' : String(filters.isRecurring)}
                    onChange={handleRecurringChange}
                    className="w-[140px]"
                >
                    <option value="all">Todas</option>
                    <option value="true">Recorrentes</option>
                    <option value="false">Não-recorrentes</option>
                </Select>
            </div>
        </div>
    )
}

import { useAppStore } from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Moon, Sun, Monitor, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLocation } from 'wouter' // Adicionado
import { cn } from '@/lib/utils'
import { BankAccountModal } from '@/components/settings/BankAccountModal'
import { BalanceAdjustmentModal } from '@/components/settings/BalanceAdjustmentModal'
import { CategoryModal } from '@/components/settings/CategoryModal'
import type { BankAccount, Category } from '@/types'

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value)
}

export function SettingsPage() {
    const { bankAccounts, categories } = useAppStore()
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
    const [, setLocation] = useLocation() // Inicializa setLocation
    
    // Modal States
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
    const [isBalanceAdjustmentModalOpen, setIsBalanceAdjustmentModalOpen] = useState(false)
    
    // Selected Items for Editing
    const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
        if (savedTheme) {
            setTheme(savedTheme)
        }
    }, [])

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme)
        if (newTheme === 'system') {
            localStorage.removeItem('theme')
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        } else {
            localStorage.setItem('theme', newTheme)
            if (newTheme === 'dark') {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        }
    }

    // Account Handlers
    const handleAddAccount = () => {
        setSelectedAccount(null)
        setIsAccountModalOpen(true)
    }

    const handleEditAccount = (account: BankAccount) => {
        setSelectedAccount(account)
        setIsAccountModalOpen(true)
    }

    const handleAdjustBalance = (account: BankAccount) => {
        setSelectedAccount(account)
        // Close account modal if open (it might be open if we clicked "Adjust" inside it)
        setIsAccountModalOpen(false) 
        setIsBalanceAdjustmentModalOpen(true)
    }

    // Category Handlers
    const handleAddCategory = () => {
        setSelectedCategory(null)
        setIsCategoryModalOpen(true)
    }

    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category)
        setIsCategoryModalOpen(true)
    }

    return (
        <div className="container-custom py-6 md:py-8">
            <h1 className="text-h1 mb-6">Configurações</h1>

            <div className="flex flex-col gap-8">
                {/* Appearance */}
                <section className="flex flex-col gap-4">
                    <h2 className="text-h3">Aparência</h2>
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Tema</p>
                                <p className="text-sm text-muted-foreground">
                                    Escolha como o Simple Money se parece para você.
                                </p>
                            </div>
                            <div className="flex rounded-lg border p-1">
                                <button
                                    onClick={() => handleThemeChange('light')}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                        theme === 'light' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                    )}
                                >
                                    <Sun className="h-4 w-4" />
                                    Claro
                                </button>
                                <button
                                    onClick={() => handleThemeChange('dark')}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                        theme === 'dark' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                    )}
                                >
                                    <Moon className="h-4 w-4" />
                                    Escuro
                                </button>
                                <button
                                    onClick={() => handleThemeChange('system')}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                        theme === 'system' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                    )}
                                >
                                    <Monitor className="h-4 w-4" />
                                    Sistema
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bank Accounts */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-h3">Contas Bancárias</h2>
                        <Button size="sm" variant="outline" className="gap-2" onClick={handleAddAccount}>
                            <Plus className="h-4 w-4" />
                            Adicionar Conta
                        </Button>
                    </div>
                    <div className="rounded-xl border bg-card overflow-hidden">
                        {bankAccounts.map((account, index) => (
                            <div
                                key={account.id}
                                className={cn(
                                    "relative flex items-center justify-between p-4 pl-5", // Increased pl for border
                                    index !== bankAccounts.length - 1 && "border-b"
                                )}
                            >
                                <div 
                                    className="absolute left-0 top-0 bottom-0 w-1.5" 
                                    style={{ backgroundColor: account.color }} 
                                />
                                <div className="flex items-center gap-3">
                                    <div>
                                        <p className="font-medium">{account.name}</p>
                                        <p className="text-sm text-muted-foreground capitalize">
                                            {account.type === 'checking' ? 'Conta Corrente' :
                                                account.type === 'savings' ? 'Poupança' : account.type}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="font-medium">{formatCurrency(account.currentBalance)}</p>
                                    <Button variant="ghost" size="icon" onClick={() => handleEditAccount(account)}>
                                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Categories */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-h3">Categorias</h2>
                        <Button size="sm" variant="outline" className="gap-2" onClick={handleAddCategory}>
                            <Plus className="h-4 w-4" />
                            Adicionar Categoria
                        </Button>
                    </div>
                    <div className="rounded-xl border bg-card p-6">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {/* Personal */}
                            <div className="flex flex-col gap-4">
                                <h4 className="font-medium text-muted-foreground uppercase text-xs">Pessoal</h4>
                                <div className="flex flex-col gap-2">
                                    {categories.filter(c => c.scope === 'personal').map(category => (
                                        <div 
                                            key={category.id} 
                                            className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                                            onClick={() => handleEditCategory(category)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: category.color }}
                                                />
                                                <span className="text-sm font-medium">{category.name}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground capitalize">
                                                {category.type === 'income' ? 'Receita' : 'Despesa'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Business */}
                            <div className="flex flex-col gap-4">
                                <h4 className="font-medium text-muted-foreground uppercase text-xs">Negócio</h4>
                                <div className="flex flex-col gap-2">
                                    {categories.filter(c => c.scope === 'business').map(category => (
                                        <div 
                                            key={category.id} 
                                            className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                                            onClick={() => handleEditCategory(category)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: category.color }}
                                                />
                                                <span className="text-sm font-medium">{category.name}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground capitalize">
                                                {category.type === 'income' ? 'Receita' : 'Despesa'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Data Management */}
                <section className="flex flex-col gap-4">
                    <h2 className="text-h3">Dados</h2>
                    <div className="rounded-xl border bg-card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Importar / Exportar</p>
                                <p className="text-sm text-muted-foreground">
                                    Envie seus extratos ou baixe seus dados transacionais.
                                </p>
                            </div>
                            <Button size="sm" variant="outline" className="gap-2" onClick={() => setLocation('/data')}>
                                Gerenciar <ExternalLink className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </section>
            </div>

            {/* Modals */}
            <BankAccountModal
                isOpen={isAccountModalOpen}
                onClose={() => setIsAccountModalOpen(false)}
                account={selectedAccount}
                onAdjustBalance={handleAdjustBalance}
            />
            
            <BalanceAdjustmentModal
                isOpen={isBalanceAdjustmentModalOpen}
                onClose={() => setIsBalanceAdjustmentModalOpen(false)}
                account={selectedAccount}
            />

            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                category={selectedCategory}
            />
        </div>
    )
}

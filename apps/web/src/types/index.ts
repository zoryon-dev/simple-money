// Simple Money - Type Definitions
// Baseado no PRD completo

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences: {
    currency: 'BRL'
    theme: 'light' | 'dark' | 'system'
    defaultView: 'all' | 'personal' | 'business'
  }
  createdAt: Date
}

export interface BankAccount {
  id: string
  userId: string
  name: string // "C6", "Inter", "Nubank", etc.
  type: 'checking' | 'savings' | 'investment' | 'cash'
  color: string // cor para identificação visual
  currentBalance: number
  isActive: boolean
  createdAt: Date
}

export interface Category {
  id: string
  userId: string
  name: string
  type: 'income' | 'expense'
  scope: 'personal' | 'business'
  icon: string // nome do ícone Lucide
  color: string
  isDefault: boolean
  isActive: boolean
}

export interface Transaction {
  id: string
  userId: string
  bankAccountId: string
  categoryId: string
  type: 'income' | 'expense'
  scope: 'personal' | 'business'
  description: string
  amount: number // sempre positivo, tipo define se entrada/saída
  date: Date
  isPaid: boolean // se já foi efetivado
  isRecurring: boolean
  recurringId?: string // se faz parte de uma recorrência
  recurrenceCount?: number // quantas vezes repetir
  recurrenceFrequency?: 'weekly' | 'monthly' | 'yearly'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Recurring {
  id: string
  userId: string
  bankAccountId: string
  categoryId: string
  type: 'income' | 'expense'
  scope: 'personal' | 'business'
  description: string
  amount: number
  frequency: 'weekly' | 'monthly' | 'yearly'
  dayOfMonth?: number // para monthly (1-31)
  dayOfWeek?: number // para weekly (0-6)
  startDate: Date
  endDate?: Date
  totalOccurrences?: number // quantas vezes repetir
  isActive: boolean
  createdAt: Date
}

export interface SavingsGoal {
  id: string
  userId: string
  bankAccountId: string // onde o dinheiro está guardado
  name: string // "Reserva de Emergência", "Viagem", etc.
  targetAmount: number
  currentAmount: number
  deadline?: Date
  color: string
  icon: string
  isCompleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SavingsDeposit {
  id: string
  savingsGoalId: string
  amount: number // positivo = depósito, negativo = retirada
  date: Date
  notes?: string
}

// DTOs para criação/atualização
export interface CreateTransactionDTO {
  bankAccountId: string
  categoryId: string
  type: 'income' | 'expense'
  scope: 'personal' | 'business'
  description: string
  amount: number
  date: Date
  isPaid: boolean
  isRecurring?: boolean
  recurrenceCount?: number
  recurrenceFrequency?: 'weekly' | 'monthly' | 'yearly'
  notes?: string
}

export interface UpdateTransactionDTO extends Partial<CreateTransactionDTO> {
  id: string
}

export interface CreateBankAccountDTO {
  name: string
  type: 'checking' | 'savings' | 'investment' | 'cash'
  color: string
  currentBalance: number
}

export interface UpdateBankAccountDTO extends Partial<CreateBankAccountDTO> {
  id: string
}

export interface CreateCategoryDTO {
  name: string
  type: 'income' | 'expense'
  scope: 'personal' | 'business'
  icon: string
  color: string
}

export interface CreateSavingsGoalDTO {
  bankAccountId: string
  name: string
  targetAmount: number
  deadline?: Date
  color: string
  icon: string
}

export interface CreateDepositDTO {
  savingsGoalId: string
  amount: number
  date: Date
  notes?: string
}

// Filtros
export interface TransactionFilters {
  period?: {
    start: Date
    end: Date
  }
  bankAccountId?: string
  categoryId?: string
  type?: 'income' | 'expense'
  scope?: 'personal' | 'business' | 'all'
  isPaid?: boolean
  isRecurring?: boolean
  search?: string
}


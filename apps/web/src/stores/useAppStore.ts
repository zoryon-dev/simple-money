// Simple Money - App Store (Zustand)
// Estado global da aplicação

import { create } from 'zustand'
import type {
  User,
  BankAccount,
  Category,
  Transaction,
  SavingsGoal,
  TransactionFilters,
} from '@/types'
import {
  mockUser,
  mockBankAccounts,
  mockCategories,
  mockTransactions,
  mockSavingsGoals,
} from '@/data/mockData'

interface AppState {
  // User
  user: User
  setUser: (user: User) => void

  // Bank Accounts
  bankAccounts: BankAccount[]
  setBankAccounts: (accounts: BankAccount[]) => void
  addBankAccount: (account: BankAccount) => void
  updateBankAccount: (id: string, account: Partial<BankAccount>) => void
  getBankAccount: (id: string) => BankAccount | undefined

  // Categories
  categories: Category[]
  setCategories: (categories: Category[]) => void
  addCategory: (category: Category) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  getCategory: (id: string) => Category | undefined
  getCategoriesByTypeAndScope: (
    type: 'income' | 'expense',
    scope: 'personal' | 'business' | 'all'
  ) => Category[]

  // Transactions
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  getTransaction: (id: string) => Transaction | undefined
  getFilteredTransactions: (filters?: TransactionFilters) => Transaction[]

  // Savings Goals
  savingsGoals: SavingsGoal[]
  setSavingsGoals: (goals: SavingsGoal[]) => void
  addSavingsGoal: (goal: SavingsGoal) => void
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void
  deleteSavingsGoal: (id: string) => void
  getSavingsGoal: (id: string) => SavingsGoal | undefined

  // UI State
  scopeFilter: 'all' | 'personal' | 'business'
  setScopeFilter: (scope: 'all' | 'personal' | 'business') => void

  // Calculated values
  getTotalBalance: () => number
  getTotalIncome: (days?: number) => number
  getTotalExpenses: (days?: number) => number
  getUpcomingPayments: (daysAhead?: number) => Transaction[]
}

export const useAppStore = create<AppState>((set, get) => ({
  // User
  user: mockUser,
  setUser: (user) => set({ user }),

  // Bank Accounts
  bankAccounts: mockBankAccounts,
  setBankAccounts: (accounts) => set({ bankAccounts: accounts }),
  addBankAccount: (account) =>
    set((state) => ({ bankAccounts: [...state.bankAccounts, account] })),
  updateBankAccount: (id, updates) =>
    set((state) => ({
      bankAccounts: state.bankAccounts.map((acc) =>
        acc.id === id ? { ...acc, ...updates } : acc
      ),
    })),
  getBankAccount: (id) => get().bankAccounts.find((acc) => acc.id === id),

  // Categories
  categories: mockCategories,
  setCategories: (categories) => set({ categories }),
  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),
  updateCategory: (id, updates) =>
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === id ? { ...cat, ...updates } : cat
      ),
    })),
  getCategory: (id) => get().categories.find((cat) => cat.id === id),
  getCategoriesByTypeAndScope: (type, scope) => {
    const state = get()
    return state.categories.filter(
      (cat) =>
        cat.type === type &&
        cat.isActive &&
        (scope === 'all' || cat.scope === scope)
    )
  },

  // Transactions
  transactions: mockTransactions,
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
      ),
    })),
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
  getTransaction: (id) => get().transactions.find((t) => t.id === id),
  getFilteredTransactions: (filters) => {
    const state = get()
    let filtered = [...state.transactions]

    if (filters?.scope && filters.scope !== 'all') {
      filtered = filtered.filter((t) => t.scope === filters.scope)
    }

    if (filters?.type) {
      filtered = filtered.filter((t) => t.type === filters.type)
    }

    if (filters?.bankAccountId) {
      filtered = filtered.filter((t) => t.bankAccountId === filters.bankAccountId)
    }

    if (filters?.categoryId) {
      filtered = filtered.filter((t) => t.categoryId === filters.categoryId)
    }

    if (filters?.isPaid !== undefined) {
      filtered = filtered.filter((t) => t.isPaid === filters.isPaid)
    }

    if (filters?.isRecurring !== undefined) {
      filtered = filtered.filter((t) => t.isRecurring === filters.isRecurring)
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter((t) =>
        t.description.toLowerCase().includes(searchLower)
      )
    }

    if (filters?.period) {
      filtered = filtered.filter(
        (t) =>
          t.date >= filters.period!.start && t.date <= filters.period!.end
      )
    }

    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime())
  },

  // Savings Goals
  savingsGoals: mockSavingsGoals,
  setSavingsGoals: (goals) => set({ savingsGoals: goals }),
  addSavingsGoal: (goal) =>
    set((state) => ({ savingsGoals: [...state.savingsGoals, goal] })),
  updateSavingsGoal: (id, updates) =>
    set((state) => ({
      savingsGoals: state.savingsGoals.map((goal) =>
        goal.id === id ? { ...goal, ...updates, updatedAt: new Date() } : goal
      ),
    })),
  deleteSavingsGoal: (id) =>
    set((state) => ({
      savingsGoals: state.savingsGoals.filter((goal) => goal.id !== id),
    })),
  getSavingsGoal: (id) => get().savingsGoals.find((goal) => goal.id === id),

  // UI State
  scopeFilter: 'all',
  setScopeFilter: (scope) => set({ scopeFilter: scope }),

  // Calculated values
  getTotalBalance: () => {
    const state = get()
    return state.bankAccounts
      .filter((acc) => acc.isActive)
      .reduce((sum, acc) => sum + acc.currentBalance, 0)
  },

  getTotalIncome: (days = 30) => {
    const state = get()
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return state.transactions
      .filter(
        (t) => t.type === 'income' && t.isPaid && t.date >= cutoffDate
      )
      .reduce((sum, t) => sum + t.amount, 0)
  },

  getTotalExpenses: (days = 30) => {
    const state = get()
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return state.transactions
      .filter(
        (t) => t.type === 'expense' && t.isPaid && t.date >= cutoffDate
      )
      .reduce((sum, t) => sum + t.amount, 0)
  },

  getUpcomingPayments: (daysAhead = 7) => {
    const state = get()
    const today = new Date()
    const futureDate = new Date()
    futureDate.setDate(today.getDate() + daysAhead)

    return state.transactions
      .filter(
        (t) =>
          !t.isPaid &&
          t.type === 'expense' &&
          t.date >= today &&
          t.date <= futureDate
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  },
}))


import { z } from 'zod'

// --- Enums ---
export const TransactionTypeEnum = z.enum(['income', 'expense'])
export const TransactionScopeEnum = z.enum(['personal', 'business'])
export const AccountTypeEnum = z.enum(['checking', 'savings', 'investment', 'cash'])

// --- Bank Accounts ---
export const BankAccountSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: AccountTypeEnum,
  color: z.string(),
  currentBalance: z.number(),
  isActive: z.boolean().default(true),
}).openapi('BankAccount')

export const CreateBankAccountSchema = BankAccountSchema.omit({ id: true, isActive: true })
export const UpdateBankAccountSchema = CreateBankAccountSchema.partial()

// --- Categories ---
export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: TransactionTypeEnum,
  scope: TransactionScopeEnum,
  icon: z.string().optional(),
  color: z.string(),
  isActive: z.boolean().default(true),
}).openapi('Category')

export const CreateCategorySchema = CategorySchema.omit({ id: true, isActive: true })
export const UpdateCategorySchema = CreateCategorySchema.partial()

// --- Transactions ---
export const TransactionSchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(1),
  amount: z.number().positive(),
  type: TransactionTypeEnum,
  date: z.string().datetime(), // ISO Date
  isPaid: z.boolean().default(false),
  categoryId: z.string().uuid(),
  bankAccountId: z.string().uuid(),
  scope: TransactionScopeEnum.default('personal'),
  notes: z.string().optional(),
}).openapi('Transaction')

export const CreateTransactionSchema = TransactionSchema.omit({ id: true })
export const UpdateTransactionSchema = CreateTransactionSchema.partial()

// --- Savings Goals ---
export const SavingsGoalSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  currentAmount: z.number().default(0),
  deadline: z.string().datetime().optional(),
  bankAccountId: z.string().uuid(), // Linked account
  color: z.string(),
  isCompleted: z.boolean().default(false),
}).openapi('SavingsGoal')

export const CreateSavingsGoalSchema = SavingsGoalSchema.omit({ id: true, currentAmount: true, isCompleted: true })
export const UpdateSavingsGoalSchema = CreateSavingsGoalSchema.partial()

// --- Savings Deposits ---
export const SavingsDepositSchema = z.object({
  id: z.string().uuid(),
  savingsGoalId: z.string().uuid(),
  amount: z.number(), // Positive for deposit, negative for withdraw
  date: z.string().datetime(),
  notes: z.string().optional(),
}).openapi('SavingsDeposit')

export const CreateSavingsDepositSchema = SavingsDepositSchema.omit({ id: true }).extend({
  bankAccountId: z.string().uuid()
})

// --- AI Insights ---
export const InsightTypeEnum = z.enum(['warning', 'tip', 'praise', 'action'])

export const InsightSchema = z.object({
  id: z.string().uuid(),
  type: InsightTypeEnum,
  title: z.string(),
  description: z.string(),
  createdAt: z.string().datetime(),
  isRead: z.boolean().default(false),
}).openapi('Insight')

// --- Chat ---
export const ChatRoleEnum = z.enum(['user', 'assistant'])

export const ChatSessionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  updatedAt: z.string().datetime(),
}).openapi('ChatSession')

export const ChatMessageSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  role: ChatRoleEnum,
  content: z.string(),
  createdAt: z.string().datetime(),
}).openapi('ChatMessage')

export const CreateChatSessionSchema = z.object({
  initialMessage: z.string().optional()
})

export const CreateChatMessageSchema = z.object({
  content: z.string()
})

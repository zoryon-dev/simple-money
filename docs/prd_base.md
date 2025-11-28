# Simple Money - PRD Prompt para Lovable

> **Gerencie suas finanças sem complexidade.**

---

## 1. Visão Geral do Produto

### 1.1 Propósito
Simple Money é um webapp de gestão financeira pessoal e empresarial que prioriza simplicidade radical sobre funcionalidades excessivas. O usuário deve conseguir visualizar sua saúde financeira e registrar transações em segundos, não minutos.

### 1.2 Princípios de Design

1. **Menos é mais:** Cada tela deve ter no máximo 1 objetivo principal
2. **Zero fricção:** Adicionar uma transação deve levar menos de 10 segundos
3. **Dados primeiro:** Dashboard mostra o essencial sem precisar navegar
4. **Elegância funcional:** Visual limpo com Bento Grid, sem elementos decorativos desnecessários
5. **Mobile-first:** Funciona perfeitamente em qualquer dispositivo

### 1.3 Stack Técnica

- **Frontend:** React + TypeScript + Vite (definido pelo Lovable)
- **UI Components:** shadcn/ui como base
- **Design System:** MagicUI (Menu Dock, Bento Grid)
- **Fontes:** Sora (títulos/destaques) + Inter (corpo/secundária)
- **Estrutura:** Monorepo
- **Dados:** Mock data inicial (sem integração com banco de dados neste momento)
- **Preparado para:** Supabase + Vercel + Clerk (MFA) + n8n

---

## 2. Design System

### 2.1 Paleta de Cores

#### Light Mode
```
--primary: #10B981 (verde esmeralda)
--primary-hover: #059669
--secondary: #6B7280 (cinza neutro)
--accent: #F59E0B (âmbar - alertas/destaques)
--background: #F9FAFB (off-white)
--surface: #FFFFFF
--text-primary: #111827
--text-secondary: #6B7280
--success: #22C55E
--danger: #EF4444
--warning: #F59E0B
```

#### Dark Mode
```
--primary: #34D399 (verde mais claro para contraste)
--primary-hover: #10B981
--secondary: #9CA3AF
--accent: #FBBF24
--background: #111827
--surface: #1F2937
--text-primary: #F9FAFB
--text-secondary: #9CA3AF
--success: #4ADE80
--danger: #F87171
--warning: #FBBF24
```

### 2.2 Tipografia

```
--font-primary: 'Sora', sans-serif (títulos, valores monetários, destaques)
--font-secondary: 'Inter', sans-serif (corpo, labels, textos gerais)

Escalas:
- Display: 36px/44px Sora Bold
- H1: 30px/36px Sora Semibold
- H2: 24px/32px Sora Semibold
- H3: 20px/28px Sora Medium
- Body: 16px/24px Inter Regular
- Small: 14px/20px Inter Regular
- Caption: 12px/16px Inter Medium
```

### 2.3 Componentes Base (shadcn/ui)

Utilizar os seguintes componentes do shadcn/ui como base, customizados com o design system:

- Button (primary, secondary, ghost, danger)
- Input
- Select
- Dialog/Modal
- Sheet (para mobile)
- Card
- Badge
- Tabs
- Switch (dark mode toggle)
- Calendar/DatePicker
- Dropdown Menu
- Toast/Sonner (notificações)
- Skeleton (loading states)

### 2.4 Layout

- **Container máximo:** 1200px centralizado
- **Padding padrão:** 24px (desktop) / 16px (mobile)
- **Border radius:** 12px (cards) / 8px (inputs/buttons)
- **Shadows:** Sutis, usar apenas para elevação de modais e dropdowns

---

## 3. Estrutura de Dados (Mock Data)

### 3.1 Entidades

#### User
```typescript
interface User {
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
```

#### Bank Account (Conta Bancária)
```typescript
interface BankAccount {
  id: string
  userId: string
  name: string // "C6", "Inter", "Nubank", etc.
  type: 'checking' | 'savings' | 'investment' | 'cash'
  color: string // cor para identificação visual
  currentBalance: number
  isActive: boolean
  createdAt: Date
}
```

#### Category (Categoria)
```typescript
interface Category {
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
```

#### Transaction (Transação)
```typescript
interface Transaction {
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
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

#### Recurring (Recorrência)
```typescript
interface Recurring {
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
```

#### Savings Goal (Caixinha/Objetivo)
```typescript
interface SavingsGoal {
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
```

#### Savings Deposit (Depósito na Caixinha)
```typescript
interface SavingsDeposit {
  id: string
  savingsGoalId: string
  amount: number // positivo = depósito, negativo = retirada
  date: Date
  notes?: string
}
```

### 3.2 Mock Data Inicial

```typescript
// mockData.ts

export const mockUser: User = {
  id: '1',
  name: 'Jonas',
  email: 'jonas@email.com',
  preferences: {
    currency: 'BRL',
    theme: 'system',
    defaultView: 'all'
  },
  createdAt: new Date('2024-01-01')
}

export const mockBankAccounts: BankAccount[] = [
  {
    id: '1',
    userId: '1',
    name: 'Nubank',
    type: 'checking',
    color: '#8B5CF6',
    currentBalance: 4520.00,
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    userId: '1',
    name: 'Inter',
    type: 'checking',
    color: '#F97316',
    currentBalance: 12350.75,
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '3',
    userId: '1',
    name: 'C6',
    type: 'savings',
    color: '#111827',
    currentBalance: 8000.00,
    isActive: true,
    createdAt: new Date('2024-01-01')
  }
]

export const mockCategories: Category[] = [
  // Pessoal - Despesas
  { id: '1', userId: '1', name: 'Alimentação', type: 'expense', scope: 'personal', icon: 'utensils', color: '#F97316', isDefault: true, isActive: true },
  { id: '2', userId: '1', name: 'Moradia', type: 'expense', scope: 'personal', icon: 'home', color: '#3B82F6', isDefault: true, isActive: true },
  { id: '3', userId: '1', name: 'Contas de Casa', type: 'expense', scope: 'personal', icon: 'receipt', color: '#EAB308', isDefault: true, isActive: true },
  { id: '4', userId: '1', name: 'Crianças', type: 'expense', scope: 'personal', icon: 'baby', color: '#EC4899', isDefault: true, isActive: true },
  { id: '5', userId: '1', name: 'Saúde', type: 'expense', scope: 'personal', icon: 'heart-pulse', color: '#EF4444', isDefault: true, isActive: true },
  { id: '6', userId: '1', name: 'Transporte', type: 'expense', scope: 'personal', icon: 'car', color: '#6366F1', isDefault: true, isActive: true },
  { id: '7', userId: '1', name: 'Lazer', type: 'expense', scope: 'personal', icon: 'gamepad-2', color: '#10B981', isDefault: true, isActive: true },
  
  // Pessoal - Receitas
  { id: '8', userId: '1', name: 'Salário', type: 'income', scope: 'personal', icon: 'wallet', color: '#22C55E', isDefault: true, isActive: true },
  { id: '9', userId: '1', name: 'Freelance', type: 'income', scope: 'personal', icon: 'laptop', color: '#14B8A6', isDefault: true, isActive: true },
  
  // Negócio - Despesas
  { id: '10', userId: '1', name: 'Aplicativos', type: 'expense', scope: 'business', icon: 'app-window', color: '#8B5CF6', isDefault: true, isActive: true },
  { id: '11', userId: '1', name: 'Jurídico', type: 'expense', scope: 'business', icon: 'scale', color: '#64748B', isDefault: true, isActive: true },
  { id: '12', userId: '1', name: 'Marketing', type: 'expense', scope: 'business', icon: 'megaphone', color: '#F43F5E', isDefault: true, isActive: true },
  { id: '13', userId: '1', name: 'Pessoas', type: 'expense', scope: 'business', icon: 'users', color: '#0EA5E9', isDefault: true, isActive: true },
  { id: '14', userId: '1', name: 'Tech', type: 'expense', scope: 'business', icon: 'server', color: '#6366F1', isDefault: true, isActive: true },
  
  // Negócio - Receitas
  { id: '15', userId: '1', name: 'Serviços', type: 'income', scope: 'business', icon: 'briefcase', color: '#22C55E', isDefault: true, isActive: true },
  { id: '16', userId: '1', name: 'Produtos', type: 'income', scope: 'business', icon: 'package', color: '#10B981', isDefault: true, isActive: true },
]

export const mockSavingsGoals: SavingsGoal[] = [
  {
    id: '1',
    userId: '1',
    bankAccountId: '3',
    name: 'Reserva de Emergência',
    targetAmount: 30000,
    currentAmount: 8000,
    deadline: new Date('2025-12-31'),
    color: '#10B981',
    icon: 'shield',
    isCompleted: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    userId: '1',
    bankAccountId: '2',
    name: 'Viagem Europa',
    targetAmount: 15000,
    currentAmount: 3500,
    deadline: new Date('2025-06-01'),
    color: '#3B82F6',
    icon: 'plane',
    isCompleted: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10')
  }
]

// Transações dos últimos 30 dias (exemplos variados)
export const mockTransactions: Transaction[] = [
  // ... gerar ~20-30 transações variadas para mock
]
```

---

## 4. Estrutura de Telas e Componentes

### 4.1 Layout Principal

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                                │
│  [Logo: Simple Money]              [Theme Toggle] [Avatar]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                                                             │
│                     MAIN CONTENT                            │
│                   (Bento Grid Area)                         │
│                    max-width: 1200px                        │
│                      centralizado                           │
│                                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                      DOCK MENU                              │
│     [Dashboard] [Transações] [Caixinhas] [Config]          │
│                    (MagicUI Dock)                           │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Tela: Dashboard (Home)

**Objetivo:** Visão geral instantânea + ação rápida de adicionar transação

**Layout Bento Grid:**

```
┌─────────────────────────────────────────────────────────────┐
│ FILTRO RÁPIDO: [Todos ▼] [Pessoal] [Negócio]   [+ Adicionar]│
├───────────────────────┬─────────────────────────────────────┤
│                       │                                     │
│   SALDO TOTAL         │      ENTRADAS (30 dias)            │
│   R$ 24.870,75        │      R$ 12.500,00                  │
│   ↑ 12% vs mês ant.   │      +8% vs período anterior       │
│                       │                                     │
├───────────────────────┼─────────────────────────────────────┤
│                       │                                     │
│   SAÍDAS (30 dias)    │      PRÓXIMOS PAGAMENTOS           │
│   R$ 8.350,00         │      ┌─────────────────────────┐   │
│   -3% vs período ant. │      │ 05/02 - Aluguel  R$2.5k │   │
│                       │      │ 10/02 - Internet R$150  │   │
│                       │      │ 15/02 - Energia  R$280  │   │
│                       │      └─────────────────────────┘   │
├───────────────────────┴─────────────────────────────────────┤
│                                                             │
│   SALDOS POR CONTA                                         │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│   │ Nubank   │ │ Inter    │ │ C6       │                   │
│   │ R$4.520  │ │ R$12.350 │ │ R$8.000  │                   │
│   └──────────┘ └──────────┘ └──────────┘                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   CAIXINHAS (Objetivos)                                    │
│   ┌─────────────────────────┐ ┌─────────────────────────┐  │
│   │ 🛡️ Reserva Emergência   │ │ ✈️ Viagem Europa        │  │
│   │ R$8.000 / R$30.000      │ │ R$3.500 / R$15.000      │  │
│   │ [████████░░░░░░] 27%    │ │ [████░░░░░░░░░] 23%     │  │
│   │ Meta: Dez/2025          │ │ Meta: Jun/2025          │  │
│   └─────────────────────────┘ └─────────────────────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ANÁLISE IA                                    [Analisar] │
│   ┌─────────────────────────────────────────────────────┐  │
│   │ "Seus gastos com Alimentação aumentaram 23% este    │  │
│   │ mês. Considere revisar refeições fora de casa."     │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Componentes necessários:**

1. `<StatCard>` - Card de estatística (saldo, entradas, saídas)
2. `<AccountBalanceCard>` - Card de saldo por conta bancária
3. `<UpcomingPayments>` - Lista de próximos pagamentos
4. `<SavingsGoalCard>` - Card de caixinha com progresso
5. `<AIInsightCard>` - Card de análise IA
6. `<ScopeFilter>` - Filtro Todos/Pessoal/Negócio
7. `<QuickAddButton>` - Botão flutuante/destaque para adicionar

### 4.3 Tela: Transações

**Objetivo:** Listar, filtrar e gerenciar todas as transações

```
┌─────────────────────────────────────────────────────────────┐
│ TRANSAÇÕES                                     [+ Adicionar]│
├─────────────────────────────────────────────────────────────┤
│ Filtros:                                                    │
│ [Período ▼] [Conta ▼] [Categoria ▼] [Tipo ▼] [Escopo ▼]    │
│ [🔍 Buscar...]                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ JANEIRO 2025                                                │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 28/01  🍔 Alimentação      iFood         -R$ 45,90  ⚪  ││
│ │        Nubank · Pessoal                              ✓  ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ 27/01  💼 Serviços         Cliente X    +R$ 3.500   🟢  ││
│ │        Inter · Negócio                               ✓  ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ 25/01  🏠 Moradia          Aluguel      -R$ 2.500   🔴  ││
│ │        Inter · Pessoal                    Recorrente ✓  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Carregar mais...]                                          │
└─────────────────────────────────────────────────────────────┘
```

**Componentes necessários:**

1. `<TransactionList>` - Lista agrupada por período
2. `<TransactionItem>` - Item individual de transação
3. `<TransactionFilters>` - Barra de filtros
4. `<TransactionModal>` - Modal para criar/editar transação

### 4.4 Modal: Adicionar/Editar Transação

```
┌─────────────────────────────────────────────────────────────┐
│ NOVA TRANSAÇÃO                                          [X] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Tipo:     [● Despesa] [○ Receita]                          │
│                                                             │
│ Escopo:   [● Pessoal] [○ Negócio]                          │
│                                                             │
│ Valor:    [R$ 0,00                              ]          │
│                                                             │
│ Descrição:[                                     ]          │
│                                                             │
│ Categoria:[Selecione...                         ▼]          │
│                                                             │
│ Conta:    [Selecione o banco...                 ▼]          │
│                                                             │
│ Data:     [📅 28/01/2025                        ]          │
│                                                             │
│ ☐ Já foi pago/recebido                                     │
│                                                             │
│ ─────────────────────────────────────────────────────────  │
│                                                             │
│ ☐ É recorrente                                             │
│   └─ Repetir: [Mensal ▼] por [12] vezes                    │
│      A partir do dia [28] de cada mês                      │
│                                                             │
│ Observações (opcional):                                     │
│ [                                               ]          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                          [Cancelar]  [💾 Salvar Transação] │
└─────────────────────────────────────────────────────────────┘
```

### 4.5 Tela: Caixinhas (Objetivos de Economia)

```
┌─────────────────────────────────────────────────────────────┐
│ CAIXINHAS                                    [+ Nova Meta]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 🛡️ RESERVA DE EMERGÊNCIA                               ││
│ │                                                         ││
│ │ R$ 8.000,00 de R$ 30.000,00                            ││
│ │ [████████████░░░░░░░░░░░░░░░░░░░░░░░░] 26,7%           ││
│ │                                                         ││
│ │ 📍 Guardado em: C6 Bank                                ││
│ │ 📅 Meta: 31 de Dezembro de 2025                        ││
│ │ 💡 Faltam R$ 22.000 · ~R$ 2.000/mês para bater a meta  ││
│ │                                                         ││
│ │ [+ Depositar]  [- Retirar]  [📊 Histórico]  [⚙️]       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ✈️ VIAGEM EUROPA                                        ││
│ │                                                         ││
│ │ R$ 3.500,00 de R$ 15.000,00                            ││
│ │ [████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 23,3%           ││
│ │                                                         ││
│ │ 📍 Guardado em: Inter                                  ││
│ │ 📅 Meta: 01 de Junho de 2025                           ││
│ │ ⚠️ Faltam R$ 11.500 · ~R$ 2.875/mês para bater a meta  ││
│ │                                                         ││
│ │ [+ Depositar]  [- Retirar]  [📊 Histórico]  [⚙️]       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Componentes necessários:**

1. `<SavingsGoalDetailCard>` - Card expandido da caixinha
2. `<SavingsGoalModal>` - Modal criar/editar objetivo
3. `<DepositModal>` - Modal para depositar/retirar
4. `<SavingsHistory>` - Histórico de movimentações

### 4.6 Tela: Configurações

```
┌─────────────────────────────────────────────────────────────┐
│ CONFIGURAÇÕES                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ APARÊNCIA                                                   │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Tema                          [Sistema ▼]              ││
│ │                               Light / Dark / Sistema    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ CONTAS BANCÁRIAS                                           │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ● Nubank          Corrente     R$ 4.520,00    [Editar] ││
│ │ ● Inter           Corrente     R$ 12.350,75   [Editar] ││
│ │ ● C6              Poupança     R$ 8.000,00    [Editar] ││
│ │                                                         ││
│ │ [+ Adicionar Conta]                                     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ CATEGORIAS                                                  │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Pessoal ▼]                                             ││
│ │                                                         ││
│ │ Despesas:                                               ││
│ │ 🍔 Alimentação  🏠 Moradia  📄 Contas...  [+ Adicionar] ││
│ │                                                         ││
│ │ Receitas:                                               ││
│ │ 💰 Salário  💻 Freelance              [+ Adicionar]    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ INTEGRAÇÕES (Futuro)                                       │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 🔗 n8n Webhook URL: [________________________] [Testar] ││
│ │ 📱 API Key: [••••••••••••••••]              [Regenerar] ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Componentes Reutilizáveis

### 5.1 Lista de Componentes UI

```typescript
// Componentes de Layout
<AppShell />           // Layout principal com header e dock
<BentoGrid />          // Grid responsivo estilo Bento
<BentoCard />          // Card individual do Bento Grid
<PageHeader />         // Header de página com título e ações

// Componentes de Navegação
<DockMenu />           // Menu dock inferior (MagicUI)
<ThemeToggle />        // Switch de tema claro/escuro
<UserMenu />           // Menu do usuário (avatar + dropdown)

// Componentes de Dados
<StatCard />           // Card de estatística com valor e variação
<AccountCard />        // Card de conta bancária
<TransactionItem />    // Item de transação na lista
<SavingsGoalCard />    // Card de objetivo/caixinha
<ProgressBar />        // Barra de progresso customizada
<CategoryBadge />      // Badge de categoria com ícone e cor
<ScopeBadge />         // Badge Pessoal/Negócio

// Componentes de Formulário
<MoneyInput />         // Input formatado para valores monetários
<CategorySelect />     // Select de categorias agrupadas
<BankAccountSelect />  // Select de contas bancárias
<DatePicker />         // Seletor de data
<RecurrenceConfig />   // Configurador de recorrência

// Componentes de Feedback
<EmptyState />         // Estado vazio com ilustração
<LoadingState />       // Estado de carregamento (skeletons)
<AIInsightCard />      // Card de insight da IA

// Modais
<TransactionModal />   // Modal de transação
<SavingsGoalModal />   // Modal de objetivo
<DepositModal />       // Modal de depósito/retirada
<ConfirmDialog />      // Dialog de confirmação
```

### 5.2 Especificação de Componentes Chave

#### `<MoneyInput />`
```typescript
interface MoneyInputProps {
  value: number
  onChange: (value: number) => void
  currency?: 'BRL'
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  error?: string
}

// Comportamento:
// - Formata automaticamente enquanto digita (1234 -> 12,34)
// - Aceita apenas números
// - Exibe prefixo R$
// - Fonte Sora para valores
```

#### `<ScopeBadge />`
```typescript
interface ScopeBadgeProps {
  scope: 'personal' | 'business'
  size?: 'sm' | 'md'
}

// Visual:
// - Personal: fundo verde claro, texto verde escuro, ícone user
// - Business: fundo azul claro, texto azul escuro, ícone briefcase
```

#### `<DockMenu />`
```typescript
interface DockMenuItem {
  id: string
  label: string
  icon: LucideIcon
  href: string
}

interface DockMenuProps {
  items: DockMenuItem[]
  activeItem: string
}

// Usar MagicUI Dock component
// Items: Dashboard, Transações, Caixinhas, Configurações
// Ícones: LayoutDashboard, ArrowLeftRight, PiggyBank, Settings
```

---

## 6. Fluxos de Usuário

### 6.1 Adicionar Transação Rápida

```
1. Usuário clica em [+ Adicionar] (qualquer tela)
2. Modal abre com foco no campo de valor
3. Usuário digita valor -> formata automaticamente
4. Seleciona tipo (Despesa/Receita) - toggle
5. Seleciona escopo (Pessoal/Negócio) - toggle
6. Seleciona categoria (filtrada por tipo e escopo)
7. Seleciona conta bancária
8. Data já vem preenchida com hoje
9. Marca se já foi pago/recebido
10. [Opcional] Configura recorrência
11. Clica em Salvar
12. Toast de confirmação + Modal fecha
13. Dashboard atualiza valores
```

### 6.2 Criar Recorrência

```
1. No modal de transação, marca "É recorrente"
2. Expande opções de recorrência
3. Seleciona frequência (Semanal/Mensal/Anual)
4. Define quantas ocorrências OU data final
5. Define dia do mês/semana
6. Ao salvar, sistema pergunta: "Criar X transações futuras?"
7. Usuário confirma
8. Sistema cria todas as transações com isPaid: false
9. Usuário pode marcar como pago individualmente
```

### 6.3 Depositar em Caixinha

```
1. Na tela Caixinhas, clica em [+ Depositar]
2. Modal abre com:
   - Valor a depositar
   - Data do depósito
   - Observação opcional
3. Usuário preenche e confirma
4. Sistema atualiza currentAmount da caixinha
5. Registra no histórico de depósitos
6. Toast de confirmação
7. Card atualiza progresso visual
```

### 6.4 Marcar Transação como Paga

```
1. Na lista de transações ou em "Próximos Pagamentos"
2. Usuário clica no checkbox/toggle de "Pago"
3. Sistema atualiza isPaid: true
4. Se estava em "Próximos Pagamentos", remove da lista
5. Atualiza saldos no dashboard
6. Feedback visual (check verde)
```

---

## 7. Estados e Feedback

### 7.1 Loading States

- Usar `<Skeleton />` do shadcn durante carregamento
- Manter layout para evitar layout shift
- Loading mínimo de 300ms para evitar flash

### 7.2 Empty States

```typescript
interface EmptyStateConfig {
  transactions: {
    icon: 'receipt',
    title: 'Nenhuma transação ainda',
    description: 'Comece adicionando sua primeira entrada ou saída',
    action: 'Adicionar Transação'
  },
  savingsGoals: {
    icon: 'piggy-bank',
    title: 'Nenhum objetivo criado',
    description: 'Crie caixinhas para organizar suas economias',
    action: 'Criar Primeira Meta'
  },
  upcomingPayments: {
    icon: 'calendar-check',
    title: 'Nenhum pagamento pendente',
    description: 'Você está em dia! 🎉',
    action: null
  }
}
```

### 7.3 Toast Notifications

```typescript
// Usar Sonner (já incluído no shadcn)
toast.success('Transação salva com sucesso!')
toast.error('Erro ao salvar. Tente novamente.')
toast.info('Lembrete: Aluguel vence em 3 dias')
toast.warning('Você está próximo do limite do orçamento')
```

---

## 8. Preparação para Integrações Futuras

### 8.1 Estrutura de API (Mock)

```typescript
// /lib/api.ts - Funções que simularão chamadas à API

export const api = {
  // Transactions
  getTransactions: (filters?: TransactionFilters) => Promise<Transaction[]>
  createTransaction: (data: CreateTransactionDTO) => Promise<Transaction>
  updateTransaction: (id: string, data: UpdateTransactionDTO) => Promise<Transaction>
  deleteTransaction: (id: string) => Promise<void>
  
  // Bank Accounts
  getBankAccounts: () => Promise<BankAccount[]>
  createBankAccount: (data: CreateBankAccountDTO) => Promise<BankAccount>
  updateBankAccount: (id: string, data: UpdateBankAccountDTO) => Promise<BankAccount>
  
  // Categories
  getCategories: () => Promise<Category[]>
  createCategory: (data: CreateCategoryDTO) => Promise<Category>
  
  // Savings Goals
  getSavingsGoals: () => Promise<SavingsGoal[]>
  createSavingsGoal: (data: CreateSavingsGoalDTO) => Promise<SavingsGoal>
  addDeposit: (goalId: string, data: CreateDepositDTO) => Promise<SavingsDeposit>
  
  // Analytics (para n8n)
  triggerAIAnalysis: () => Promise<{ insight: string }>
  
  // Webhooks (para n8n)
  getUpcomingPayments: (daysAhead: number) => Promise<Transaction[]>
}
```

### 8.2 Webhook Endpoints (Estrutura)

```typescript
// Endpoints que o n8n irá consumir (implementar quando integrar Supabase)

// GET /api/analytics/summary
// Retorna resumo para análise IA

// GET /api/reminders/upcoming?days=7
// Retorna pagamentos dos próximos X dias

// POST /api/webhooks/payment-reminder
// Endpoint para n8n disparar lembretes

// POST /api/ai/analyze
// Dispara análise e retorna insight
```

### 8.3 Clerk Auth (Preparação)

```typescript
// Estrutura preparada para Clerk
// /lib/auth.ts

export const authConfig = {
  provider: 'clerk',
  mfa: true,
  allowedMethods: ['email'], // Apenas email com MFA
}

// Componentes preparados:
// <SignIn /> - Tela de login
// <UserButton /> - Botão do usuário no header
// <ProtectedRoute /> - Wrapper para rotas autenticadas
```

---

## 9. Responsividade

### 9.1 Breakpoints

```css
--breakpoint-sm: 640px   /* Mobile landscape */
--breakpoint-md: 768px   /* Tablet */
--breakpoint-lg: 1024px  /* Desktop */
--breakpoint-xl: 1280px  /* Desktop large */
```

### 9.2 Comportamento Mobile

- Dock Menu: Fixo no bottom, sempre visível
- Bento Grid: Stack vertical em mobile
- Modais: Ocupam tela cheia (Sheet do shadcn)
- Tabelas: Scroll horizontal ou cards empilhados
- Filtros: Colapsáveis em accordion

### 9.3 Touch Targets

- Mínimo 44x44px para elementos interativos
- Espaçamento adequado entre itens de lista
- Swipe actions para transações (futuro)

---

## 10. Checklist de Implementação

### Fase 1: Setup e Estrutura
- [ ] Criar projeto com Vite + React + TypeScript
- [ ] Configurar shadcn/ui
- [ ] Configurar MagicUI (Dock)
- [ ] Configurar fontes (Sora + Inter)
- [ ] Implementar tema claro/escuro
- [ ] Criar design tokens (cores, espaçamentos)
- [ ] Estrutura de pastas monorepo

### Fase 2: Componentes Base
- [ ] AppShell (layout principal)
- [ ] DockMenu
- [ ] BentoGrid + BentoCard
- [ ] StatCard
- [ ] MoneyInput
- [ ] CategorySelect
- [ ] BankAccountSelect
- [ ] ScopeBadge
- [ ] ProgressBar

### Fase 3: Mock Data e Estado
- [ ] Criar arquivo de mock data completo
- [ ] Implementar contexto/store (Zustand ou Context)
- [ ] Funções CRUD simuladas com delays

### Fase 4: Telas Principais
- [ ] Dashboard com Bento Grid
- [ ] Lista de Transações
- [ ] Modal de Transação
- [ ] Tela de Caixinhas
- [ ] Modal de Caixinha
- [ ] Tela de Configurações

### Fase 5: Funcionalidades
- [ ] Filtros funcionando
- [ ] CRUD de transações
- [ ] CRUD de caixinhas
- [ ] Recorrências
- [ ] Toggle pago/não pago
- [ ] Cálculos de dashboard

### Fase 6: Polish
- [ ] Loading states
- [ ] Empty states
- [ ] Toasts de feedback
- [ ] Animações sutis
- [ ] Responsividade completa
- [ ] Testes básicos

---

## 11. Notas para o Lovable

1. **Priorize simplicidade:** Menos telas, menos cliques. O usuário deve conseguir fazer 80% das tarefas na Dashboard.

2. **Mock data primeiro:** Toda a aplicação deve funcionar perfeitamente com mock data. Não se preocupe com backend neste momento.

3. **Componentes reutilizáveis:** Cada componente deve ser independente e reutilizável. Use props para customização.

4. **shadcn/ui como base:** Não reinvente a roda. Use os componentes do shadcn e customize com o design system.

5. **Mobile-first:** Comece pelo layout mobile e expanda para desktop.

6. **Feedback constante:** Toda ação do usuário deve ter feedback visual imediato (loading, success, error).

7. **Acessibilidade:** Labels em todos os inputs, contraste adequado, navegação por teclado.

8. **Performance:** Lazy loading de componentes pesados, virtualização em listas longas.

---

**Slogan do produto:** Simple Money - Gerencie suas finanças sem complexidade.

**Mantra de desenvolvimento:** Se está complicado, simplifique. Se não é essencial, remova.
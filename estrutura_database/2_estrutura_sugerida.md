# Estrutura Sugerida do Banco de Dados (SQL)

Este documento contém o esquema SQL sugerido para o Supabase (PostgreSQL), atualizado para suportar API Keys e rastreabilidade de caixinhas.

## 1. Configurações Iniciais e Extensões

```sql
-- Habilitar UUIDs
create extension if not exists "uuid-ossp";

-- Configurar timezone
alter database postgres set timezone to 'America/Sao_Paulo';
```

## 2. Tipos Personalizados (Enums)

```sql
create type transaction_type as enum ('income', 'expense');
create type transaction_scope as enum ('personal', 'business');
create type account_type as enum ('checking', 'savings', 'investment', 'cash');
create type recurrence_frequency as enum ('weekly', 'monthly', 'yearly');
create type subscription_status as enum ('active', 'canceled', 'past_due', 'trialing');
create type insight_type as enum ('warning', 'tip', 'praise', 'action');
create type chat_role as enum ('user', 'assistant');
```

## 3. Tabelas Core

### 3.1. Profiles (Perfil do Usuário)

```sql
create table public.profiles (
    id text primary key, -- ID do usuário vindo do Clerk
    email text not null,
    full_name text,
    avatar_url text,
    
    -- Preferências Legadas (podem ser migradas para settings)
    theme text default 'system',
    currency text default 'BRL',
    
    -- Configurações Extensíveis (Notificações, Integrações, Onboarding)
    settings jsonb default '{}'::jsonb,
    
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.profiles enable row level security;

create policy "Users can view own profile" 
on profiles for select 
using (auth.uid()::text = id);

create policy "Users can update own profile" 
on profiles for update 
using (auth.uid()::text = id);
```

### 3.2. Bank Accounts (Contas Bancárias)

```sql
create table public.bank_accounts (
    id uuid default uuid_generate_v4() primary key,
    user_id text not null references public.profiles(id) on delete cascade,
    
    name text not null,
    type account_type not null default 'checking',
    color text not null default '#10B981',
    current_balance numeric(12, 2) default 0.00,
    is_active boolean default true,
    
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices
create index bank_accounts_user_id_idx on public.bank_accounts(user_id);

-- RLS
alter table public.bank_accounts enable row level security;

create policy "Users can crud own accounts" 
on bank_accounts for all 
using (auth.uid()::text = user_id);
```

### 3.3. Categories (Categorias)

```sql
create table public.categories (
    id uuid default uuid_generate_v4() primary key,
    user_id text not null references public.profiles(id) on delete cascade,
    
    name text not null,
    type transaction_type not null,
    scope transaction_scope not null default 'personal',
    icon text, 
    color text not null default '#94A3B8',
    is_default boolean default false,
    is_active boolean default true,
    
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index categories_user_id_idx on public.categories(user_id);

alter table public.categories enable row level security;

create policy "Users can crud own categories" 
on categories for all 
using (auth.uid()::text = user_id);
```

### 3.4. Transactions (Transações)

```sql
create table public.transactions (
    id uuid default uuid_generate_v4() primary key,
    user_id text not null references public.profiles(id) on delete cascade,
    bank_account_id uuid not null references public.bank_accounts(id) on delete restrict,
    category_id uuid not null references public.categories(id) on delete restrict,
    
    description text not null,
    amount numeric(12, 2) not null, 
    type transaction_type not null,
    scope transaction_scope not null default 'personal',
    date date not null default current_date,
    
    is_paid boolean default true,
    notes text,
    
    is_recurring boolean default false,
    recurrence_frequency recurrence_frequency,
    recurrence_group_id uuid,
    
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index transactions_user_id_date_idx on public.transactions(user_id, date);
create index transactions_account_idx on public.transactions(bank_account_id);

alter table public.transactions enable row level security;

create policy "Users can crud own transactions" 
on transactions for all 
using (auth.uid()::text = user_id);
```

## 4. Funcionalidades Específicas

### 4.1. Savings Goals (Caixinhas)

```sql
create table public.savings_goals (
    id uuid default uuid_generate_v4() primary key,
    user_id text not null references public.profiles(id) on delete cascade,
    bank_account_id uuid not null references public.bank_accounts(id) on delete restrict,
    
    name text not null,
    target_amount numeric(12, 2) not null,
    current_amount numeric(12, 2) default 0,
    deadline date,
    color text,
    icon text,
    is_completed boolean default false,
    
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.savings_goals enable row level security;

create policy "Users can crud own goals" 
on savings_goals for all 
using (auth.uid()::text = user_id);
```

### 4.2. Savings Deposits (Movimentações das Caixinhas)

```sql
create table public.savings_deposits (
    id uuid default uuid_generate_v4() primary key,
    savings_goal_id uuid not null references public.savings_goals(id) on delete cascade,
    user_id text not null references public.profiles(id) on delete cascade,
    
    -- Vínculo com a transação que efetivou a saída/entrada do dinheiro na conta real
    transaction_id uuid references public.transactions(id) on delete set null,
    
    amount numeric(12, 2) not null, -- Positivo = depósito, Negativo = retirada
    date date not null default current_date,
    notes text,
    
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.savings_deposits enable row level security;

create policy "Users can crud own deposits" 
on savings_deposits for all 
using (auth.uid()::text = user_id);
```

## 5. Developer & System

### 5.1. API Keys (Gestão de Tokens)

```sql
create table public.api_keys (
    id uuid default uuid_generate_v4() primary key,
    user_id text not null references public.profiles(id) on delete cascade,
    
    name text not null, -- Ex: "Meu Laptop", "Integração Zapier"
    key_hash text not null, -- Hash seguro do token (nunca armazenar raw)
    preview_chars text not null, -- Ex: "sk_live_...4a2b"
    
    last_used_at timestamp with time zone,
    expires_at timestamp with time zone,
    
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices
create index api_keys_user_id_idx on public.api_keys(user_id);
create index api_keys_hash_idx on public.api_keys(key_hash);

-- RLS
alter table public.api_keys enable row level security;

create policy "Users can manage own keys" 
on api_keys for all 
using (auth.uid()::text = user_id);
```

### 5.2. Subscriptions & Invoices

```sql
create table public.subscriptions (
    id uuid default uuid_generate_v4() primary key,
    user_id text not null references public.profiles(id) on delete cascade,
    stripe_customer_id text,
    stripe_subscription_id text,
    status subscription_status default 'active',
    plan_name text default 'Pro',
    current_period_end timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.invoices (
    id uuid default uuid_generate_v4() primary key,
    user_id text not null references public.profiles(id) on delete cascade,
    amount numeric(10, 2) not null,
    status text,
    invoice_url text,
    period_start date,
    period_end date,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subscriptions enable row level security;
alter table public.invoices enable row level security;

create policy "Users can view own subscription" on subscriptions for select using (auth.uid()::text = user_id);
create policy "Users can view own invoices" on invoices for select using (auth.uid()::text = user_id);
```

## 7. Triggers e Functions (Automação)

### 7.1. Atualização Automática de `updated_at`

```sql
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_profiles_updated_at before update on profiles for each row execute procedure update_updated_at_column();
create trigger update_bank_accounts_updated_at before update on bank_accounts for each row execute procedure update_updated_at_column();
create trigger update_transactions_updated_at before update on transactions for each row execute procedure update_updated_at_column();
create trigger update_savings_goals_updated_at before update on savings_goals for each row execute procedure update_updated_at_column();
create trigger update_subscriptions_updated_at before update on subscriptions for each row execute procedure update_updated_at_column();
```
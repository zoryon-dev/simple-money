# Análise e Explicação da Estrutura de Banco de Dados - Simple Money

## 1. Visão Geral da Arquitetura

O **Simple Money** será uma aplicação SaaS multi-tenant focada em gestão financeira pessoal e empresarial. A infraestrutura baseia-se em:

*   **Frontend:** React (Vite) + TypeScript.
*   **Autenticação:** Clerk (Gerenciamento de Identidade, MFA, Sessões).
*   **Banco de Dados:** Supabase (PostgreSQL).
*   **Armazenamento de Arquivos:** Supabase Storage (para avatares, comprovantes).

## 2. Estratégia Multi-Tenant

Para esta aplicação, utilizaremos a estratégia de **Isolamento Lógico (Row-Level Security - RLS)**.

### Por que RLS?
No ecossistema Supabase/PostgreSQL, o RLS é a forma padrão e mais segura de segregar dados de usuários em uma única tabela. Em vez de criar um banco de dados ou schema separado para cada usuário (o que seria custoso e complexo de manter), todas as linhas nas tabelas terão uma coluna identificadora (`user_id` ou `org_id`).

*   **Identificador:** `user_id` (String/UUID mapeado do Clerk).
*   **Segurança:** Políticas RLS garantem que um usuário só possa fazer `SELECT`, `INSERT`, `UPDATE` ou `DELETE` em linhas onde `user_id` corresponda ao seu ID autenticado.

> **Nota sobre Clerk + Supabase:** O Clerk gerencia a autenticação. O ID do usuário gerado pelo Clerk (`user_id`) será a chave primária na tabela de perfis e a chave estrangeira em todas as outras tabelas.

## 3. Análise das Entidades

Abaixo detalhamos as principais entidades necessárias para suportar todas as telas atuais (Dashboard, Transações, Previsões, Analytics, Caixinhas, Configurações, Perfil, Pagamentos e API).

### 3.1. Usuários e Perfis (`profiles`)
Embora o Clerk gerencie o login, precisamos de uma tabela local para armazenar dados específicos da aplicação.
*   **Vinculação:** 1:1 com o usuário do Clerk.
*   **Dados:** Nome, email (cache), status da assinatura (Free/Pro).
*   **Preferências Estendidas:** Uma coluna `settings` (JSONB) armazenará configurações flexíveis como preferências de notificação, flags de integração (WhatsApp) e estado de onboarding, evitando alterações constantes de schema.

### 3.2. Contas Bancárias (`bank_accounts`)
Representam as origens/destinos do dinheiro (Nubank, Inter, Carteira, etc.).
*   **Tipos:** Corrente, Poupança, Investimento, Dinheiro.
*   **Saldo:** O saldo atual é armazenado para performance rápida de leitura (`current_balance`).

### 3.3. Categorias (`categories`)
Classificação das transações.
*   **Escopo:** `personal` ou `business`.
*   **Sistema Híbrido:** O usuário cria suas categorias, mas o sistema pode prover padrões iniciais.

### 3.4. Transações (`transactions`)
O núcleo contábil do sistema.
*   **Campos Chave:** Valor, data, descrição, status (pago/pendente).
*   **Relacionamentos:** Pertence a uma `bank_account` e uma `category`.

### 3.5. Metas/Caixinhas (`savings_goals`) e Rastreabilidade
Objetivos financeiros segregados logicamente.
*   **Histórico (`savings_deposits`):** Registra aportes e retiradas.
*   **Vínculo Contábil:** Para garantir a consistência ("Double Entry"), cada registro em `savings_deposits` deve, idealmente, estar vinculado a uma `transaction` correspondente na conta bancária de origem. Isso permite que, ao excluir uma transação, o sistema saiba como lidar com o saldo da caixinha (via triggers ou lógica de aplicação).

### 3.6. Chaves de API (`api_keys`)
Para suportar o acesso programático (Developer Hub).
*   **Segurança:** Nunca armazenamos o token cru. Armazenamos apenas um Hash (SHA-256 ou bcrypt) e os últimos caracteres para identificação visual.
*   **Metadados:** Data de criação, último uso e nome da chave (ex: "Integração Zapier").

### 3.7. Assinaturas e Pagamentos (`subscriptions` / `invoices`)
Para a tela `/billing`.
*   **Integração:** Provavelmente Stripe ou Pagar.me no futuro.
*   **Dados:** Histórico de faturas, plano atual, status da assinatura.

### 3.8. Inteligência Artificial (AI)
Para suportar o "CFO Virtual" e os insights automáticos, precisamos persistir as interações e análises geradas pelo n8n/LLM.

*   **Insights (`insights`):** Armazena as dicas, alertas e diagnósticos gerados periodicamente. Isso evita reprocessamento constante via API externa.
*   **Chat (`chat_sessions` e `chat_messages`):** Armazena o histórico de conversas com o assistente.
    *   **Sessões:** Agrupam mensagens por tópico (ex: "Análise de Férias", "Dúvida sobre Investimentos").
    *   **Mensagens:** O conteúdo textual (`role: user/assistant`).

A lógica de processamento (Smart Entry, Análise) é stateless no banco, mas gera registros em `transactions` ou `insights`.

## 4. Estrutura de Tabelas Proposta

### Core
*   `profiles` (Extensão do usuário Clerk + JSONB Settings)
*   `bank_accounts`
*   `categories`
*   `transactions`
*   `recurrence_rules`

### Savings
*   `savings_goals`
*   `savings_goal_logs` (ou `savings_deposits`) com FK para `transactions`.

### AI & Intelligence
*   `insights`
*   `chat_sessions`
*   `chat_messages`

### Developer / System
*   `api_keys` (Gerenciamento de acesso API)
*   `subscriptions`
*   `invoices`

## 5. Considerações de Performance e Integridade

1.  **Índices:** Essenciais nas colunas `user_id`, `date` (transações), `type` e chaves estrangeiras.
2.  **Triggers:**
    *   Atualizar saldo da `bank_account` ao manipular `transactions`.
    *   Atualizar `current_amount` da `savings_goal` ao manipular `savings_deposits`.
    *   `updated_at` automático em todas as tabelas.

## 6. Próximos Passos na Implementação

1.  Configurar projeto no Supabase.
2.  Rodar script de criação atualizado (documento 2).
3.  Configurar Webhooks do Clerk.
4.  Implementar middleware na API Hono para validar as chaves da tabela `api_keys`.
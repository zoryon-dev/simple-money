import { z } from 'zod'
import { CreateSavingsDepositSchema } from '../schemas/resources'

// Types (Ideally imported from a shared types package or inferred from Zod)
type SavingsDepositInput = z.infer<typeof CreateSavingsDepositSchema> & {
    userId: string;
    bankAccountId: string; // Origem/Destino do dinheiro real
};

export class SavingsService {
    /**
     * Realiza uma movimentação financeira atômica entre Conta Bancária e Caixinha.
     * 
     * @param goalId ID da caixinha (SavingsGoal)
     * @param data Dados do depósito (valor, data, notas)
     * @returns O registro do depósito criado
     */
    async processTransaction(goalId: string, data: SavingsDepositInput) {
        console.log(`[SavingsService] Iniciando transação para meta ${goalId}...`);

        // 1. Validar Pré-condições (Mock: Buscar dados no banco)
        // const goal = await db.savingsGoal.find(goalId);
        // const account = await db.bankAccounts.find(data.bankAccountId);
        
        // if (!goal) throw new Error("Meta não encontrada");
        // if (!account) throw new Error("Conta bancária não encontrada");

        const isDeposit = data.amount > 0;
        const absAmount = Math.abs(data.amount);

        // Validação de Saldo (Opcional, mas recomendada)
        // if (!isDeposit && goal.currentAmount < absAmount) throw new Error("Saldo insuficiente na caixinha");
        // if (isDeposit && account.currentBalance < absAmount) throw new Error("Saldo insuficiente na conta bancária");

        console.log(`[SavingsService] Tipo: ${isDeposit ? 'Depósito (Entrada na Meta)' : 'Resgate (Saída da Meta)'}`);
        
        // 2. Iniciar Transação de Banco de Dados (Atomicidade)
        // return await db.transaction(async (tx) => {
            
            // Passo A: Criar Registro Histórico na Caixinha
            // const deposit = await tx.savingsDeposits.create({ ... })
            const mockDeposit = {
                id: crypto.randomUUID(),
                savingsGoalId: goalId,
                amount: data.amount,
                date: data.date,
                notes: data.notes
            };

            // Passo B: Criar Transação na Conta Bancária (Espelho)
            // Se estou depositando na meta (positivo), o dinheiro SAI da conta (Expense).
            // Se estou sacando da meta (negativo), o dinheiro ENTRA na conta (Income).
            const transactionType = isDeposit ? 'expense' : 'income';
            
            // const bankTransaction = await tx.transactions.create({
            //     description: isDeposit ? `Depósito em: ${goal.name}` : `Resgate de: ${goal.name}`,
            //     amount: absAmount,
            //     type: transactionType,
            //     accountId: data.bankAccountId,
            //     categoryId: 'system-savings-category-id', // Categoria de sistema ou parametrizada
            //     isPaid: true
            // });

            console.log(`[SavingsService] Transação Bancária criada: ${transactionType} de R$ ${absAmount}`);

            // Passo C: Atualizar Saldos
            // await tx.savingsGoals.update(goalId, { currentAmount: goal.currentAmount + data.amount });
            // await tx.bankAccounts.update(data.bankAccountId, { 
            //    currentBalance: isDeposit 
            //      ? account.currentBalance - absAmount 
            //      : account.currentBalance + absAmount 
            // });

            console.log(`[SavingsService] Saldos atualizados com sucesso.`);

            return mockDeposit;
        // });
    }
}

export const savingsService = new SavingsService();

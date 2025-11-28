import { z } from 'zod'

// Tipos Mockados (seriam os do banco de dados)
type RecurrenceFrequency = 'weekly' | 'monthly' | 'yearly';

interface RecurrenceRule {
    id: string;
    userId: string;
    frequency: RecurrenceFrequency;
    amount: number;
    description: string;
    startDate: Date;
    lastGeneratedDate?: Date;
    isActive: boolean;
}

export class RecurrenceService {
    
    /**
     * Processa todas as recorrências pendentes para um usuário.
     * Deve ser chamado no Login ou via Cron Job.
     */
    async processUserRecurrences(userId: string) {
        console.log(`[RecurrenceService] Verificando recorrências para usuário ${userId}...`);

        // 1. Buscar regras ativas
        // const rules = await db.recurrenceRules.find({ userId, isActive: true });
        const mockRules: RecurrenceRule[] = []; // Vazio por enquanto

        const generatedTransactions = [];

        for (const rule of mockRules) {
            if (this.shouldGenerateTransaction(rule)) {
                // Gerar transação
                const newTransaction = await this.generateTransaction(rule);
                generatedTransactions.push(newTransaction);
                
                // Atualizar regra com a nova data
                // await db.recurrenceRules.update(rule.id, { lastGeneratedDate: newTransaction.date });
            }
        }

        return generatedTransactions;
    }

    /**
     * Verifica se uma regra precisa gerar uma nova transação hoje.
     */
    private shouldGenerateTransaction(rule: RecurrenceRule): boolean {
        const today = new Date();
        const nextDate = this.calculateNextDate(rule.lastGeneratedDate || rule.startDate, rule.frequency);
        
        // Se a próxima data já passou ou é hoje
        return nextDate <= today;
    }

    /**
     * Calcula a próxima data baseada na frequência.
     */
    private calculateNextDate(baseDate: Date, frequency: RecurrenceFrequency): Date {
        const date = new Date(baseDate);
        
        switch (frequency) {
            case 'weekly':
                date.setDate(date.getDate() + 7);
                break;
            case 'monthly':
                date.setMonth(date.getMonth() + 1);
                break;
            case 'yearly':
                date.setFullYear(date.getFullYear() + 1);
                break;
        }
        
        return date;
    }

    private async generateTransaction(rule: RecurrenceRule) {
        console.log(`[RecurrenceService] Gerando transação para regra ${rule.id}`);
        // Lógica de criação no banco
        return {
            id: crypto.randomUUID(),
            description: rule.description,
            amount: rule.amount,
            date: new Date(), // Data calculada
            isRecurring: true
        };
    }
}

export const recurrenceService = new RecurrenceService();

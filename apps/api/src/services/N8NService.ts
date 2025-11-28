import { z } from 'zod'

// Mock URLs - In production use process.env.N8N_SMART_ENTRY_URL, etc.
const N8N_URLS = {
    SMART_ENTRY: 'https://n8n.webhook.url/smart-entry',
    FINANCIAL_ADVISOR: 'https://n8n.webhook.url/advisor',
    CHAT: 'https://n8n.webhook.url/chat'
}

export class N8NService {

    /**
     * Envia texto livre para o n8n interpretar e retornar uma transação estruturada.
     */
    async parseSmartEntry(text: string): Promise<any> {
        console.log(`[N8NService] Sending to Smart Entry: "${text}"`);
        
        // Em produção:
        // const response = await fetch(N8N_URLS.SMART_ENTRY, { 
        //     method: 'POST', 
        //     body: JSON.stringify({ text }),
        //     headers: { 'Content-Type': 'application/json' }
        // });
        // return await response.json();

        // MOCK RESPONSE
        return new Promise(resolve => setTimeout(() => {
            resolve({
                description: text.includes('almoço') ? 'Almoço Restaurante' : 'Uber Viagem',
                amount: parseFloat(text.replace(/[^0-9,.]/g, '').replace(',', '.')) || 50.00,
                type: 'expense',
                date: new Date().toISOString(),
                categorySuggestion: text.includes('almoço') ? 'Alimentação' : 'Transporte'
            });
        }, 1500));
    }

    /**
     * Envia resumo financeiro para n8n gerar insights.
     */
    async generateInsights(financialSummary: any): Promise<any[]> {
        console.log(`[N8NService] Requesting Insights...`);
        
        // MOCK RESPONSE
        return new Promise(resolve => setTimeout(() => {
            resolve([
                {
                    type: 'warning',
                    title: 'Gasto elevado em Alimentação',
                    description: 'Você gastou 30% a mais que a média dos últimos 3 meses nesta categoria.'
                },
                {
                    type: 'tip',
                    title: 'Oportunidade de Investimento',
                    description: 'Seu saldo em conta corrente está alto. Considere mover R$ 2.000 para uma Caixinha.'
                }
            ]);
        }, 2000));
    }

    /**
     * Envia mensagem de chat para o n8n.
     */
    async chat(message: string, context: any): Promise<string> {
        // MOCK RESPONSE
        return "Com base nos seus dados, você gastou R$ 450,00 com transporte este mês.";
    }
}

export const n8nService = new N8NService();

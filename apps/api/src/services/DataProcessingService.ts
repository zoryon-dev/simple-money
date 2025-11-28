import Papa from 'papaparse';
import { XMLParser } from 'fast-xml-parser';
import PDFDocument from 'pdfkit';
import { z } from 'zod';

// Interfaces internas
interface ImportedTransaction {
    date: Date;
    amount: number;
    description: string;
    type: 'income' | 'expense';
    referenceId?: string; // ID externo para evitar duplicatas
}

export class DataProcessingService {

    /**
     * Gera o template CSV padrão para o usuário.
     */
    getCSVTemplate(): string {
        return `Date,Description,Amount,Type\n2024-01-31,Salario,5000.00,income\n2024-02-01,Aluguel,2500.00,expense`;
    }

    /**
     * Processa arquivo CSV.
     * Espera formato: Date (YYYY-MM-DD), Description, Amount, Type (income/expense)
     */
    async parseCSV(csvContent: string): Promise<ImportedTransaction[]> {
        return new Promise((resolve, reject) => {
            Papa.parse(csvContent, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const transactions: ImportedTransaction[] = [];
                    
                    if (results.errors.length > 0) {
                        console.warn('CSV parsing warnings:', results.errors);
                    }

                    for (const row of results.data as any[]) {
                        // Validação básica
                        if (!row.Date || !row.Description || !row.Amount) continue;

                        const amount = parseFloat(row.Amount);
                        const type = row.Type?.toLowerCase() === 'income' ? 'income' : 'expense';
                        
                        // Se o usuário não passou Type, tentamos inferir pelo sinal (negativo = expense)
                        // Mas nosso template pede Type explícito.
                        
                        transactions.push({
                            date: new Date(row.Date),
                            description: row.Description,
                            amount: Math.abs(amount), // Sempre positivo no sistema
                            type: type,
                            referenceId: `csv-${row.Date}-${row.Description}-${amount}` // Hash simples
                        });
                    }
                    resolve(transactions);
                },
                error: (err: Error) => reject(err)
            });
        });
    }

    /**
     * Processa arquivo OFX (Open Financial Exchange).
     * Suporta OFX 1.0.2 (SGML) e 2.0 (XML).
     */
    parseOFX(ofxContent: string): ImportedTransaction[] {
        // Limpeza prévia para garantir que o parser XML consiga ler (OFX antigo não fecha tags)
        // Uma abordagem simples: extrair o bloco <BANKTRANLIST> e processar com Regex ou tentar corrigir tags
        
        // Vamos usar uma abordagem Regex para robustez com arquivos bancários mal formatados
        const transactions: ImportedTransaction[] = [];
        
        // Regex para capturar transações dentro de STMTTRN
        const regex = /<STMTTRN>[\s\S]*?<TRNTYPE>(.*?)[
\s\S]*?<DTPOSTED>(.*?)[
\s\S]*?<TRNAMT>(.*?)[
\s\S]*?<MEMO>(.*?)[
\s\S]*?<\/STMTTRN>/gi;
        
        let match;
        while ((match = regex.exec(ofxContent)) !== null) {
            const typeRaw = match[1].trim(); // DEBIT, CREDIT
            const dateRaw = match[2].trim(); // YYYYMMDDHHMMSS...
            const amountRaw = match[3].trim();
            const memo = match[4].trim();

            const amount = parseFloat(amountRaw.replace(',', '.')); // Garantir ponto decimal
            const type = amount > 0 ? 'income' : 'expense'; // No OFX, positivo é crédito, negativo débito geralmente

            // Parse Date OFX: YYYYMMDD...
            const year = parseInt(dateRaw.substring(0, 4));
            const month = parseInt(dateRaw.substring(4, 6)) - 1;
            const day = parseInt(dateRaw.substring(6, 8));
            const date = new Date(year, month, day);

            transactions.push({
                date,
                amount: Math.abs(amount),
                description: memo,
                type,
                referenceId: `ofx-${dateRaw}-${amountRaw}-${memo}`
            });
        }

        return transactions;
    }

    /**
     * Gera CSV de exportação.
     */
    exportToCSV(transactions: any[]): string {
        return Papa.unparse(transactions.map(t => ({
            Date: t.date, // Formatar se necessário
            Description: t.description,
            Amount: t.amount,
            Type: t.type,
            Category: t.categoryName || 'Uncategorized',
            Account: t.accountName || 'Unknown'
        })));
    }

    /**
     * Gera PDF de relatório financeiro.
     */
    async exportToPDF(transactions: any[], period: string): Promise<Buffer> {
        return new Promise((resolve) => {
            const doc = new PDFDocument({ margin: 50 });
            const chunks: Buffer[] = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));

            // Cabeçalho
            doc.fontSize(20).text('Relatório Financeiro - Simple Money', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Período: ${period}`, { align: 'center' });
            doc.moveDown(2);

            // Resumo
            const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            const balance = totalIncome - totalExpense;

            doc.fontSize(12).text(`Total Receitas: R$ ${totalIncome.toFixed(2)}`, { align: 'left' });
            doc.text(`Total Despesas: R$ ${totalExpense.toFixed(2)}`, { align: 'left' });
            doc.text(`Saldo do Período: R$ ${balance.toFixed(2)}`, { align: 'left' });
            doc.moveDown(2);

            // Tabela de Transações (Simples)
            // Header Tabela
            const tableTop = doc.y;
            const itemX = 50;
            const descX = 150;
            const amountX = 400;
            
            doc.font('Helvetica-Bold');
            doc.text('Data', itemX, tableTop);
            doc.text('Descrição', descX, tableTop);
            doc.text('Valor', amountX, tableTop);
            doc.moveDown();
            doc.font('Helvetica');

            // Linhas
            let y = doc.y;
            transactions.forEach((t) => {
                if (y > 700) { // Nova página
                    doc.addPage();
                    y = 50;
                }

                const dateStr = new Date(t.date).toLocaleDateString('pt-BR');
                const amountStr = `R$ ${t.amount.toFixed(2)}`;
                const color = t.type === 'income' ? 'green' : 'red';

                doc.text(dateStr, itemX, y);
                doc.text(t.description.substring(0, 40), descX, y);
                doc.fillColor(color).text(amountStr, amountX, y);
                doc.fillColor('black'); // Reset
                
                y += 20;
            });

            doc.end();
        });
    }
}

export const dataProcessingService = new DataProcessingService();

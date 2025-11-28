import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { dataProcessingService } from '../services/DataProcessingService'

const app = new OpenAPIHono()

// --- Template CSV ---
app.openapi(
  createRoute({
    method: 'get',
    path: '/template',
    tags: ['Data Processing'],
    summary: 'Download CSV Import Template',
    responses: {
      200: {
        description: 'CSV Template File',
        content: { 'text/csv': { schema: z.string() } }
      }
    }
  }),
  (c) => {
      const csv = dataProcessingService.getCSVTemplate();
      c.header('Content-Type', 'text/csv');
      c.header('Content-Disposition', 'attachment; filename="simple-money-template.csv"');
      return c.body(csv);
  }
)

// --- Import CSV ---
app.openapi(
  createRoute({
    method: 'post',
    path: '/import/csv',
    tags: ['Data Processing'],
    summary: 'Import transactions from CSV',
    request: {
        body: {
            content: {
                'multipart/form-data': {
                    schema: z.object({
                        file: z.instanceof(File) // Hono supports File type in validation schema
                    })
                }
            }
        }
    },
    responses: {
      200: {
        description: 'Import result',
        content: { 'application/json': { schema: z.object({ count: z.number(), message: z.string() }) } }
      }
    }
  }),
  async (c) => {
      const body = await c.req.parseBody();
      const file = body['file'];

      if (file instanceof File) {
          const content = await file.text();
          const transactions = await dataProcessingService.parseCSV(content);
          
          // TODO: Save transactions to DB using TransactionService
          // await transactionService.bulkCreate(transactions);

          return c.json({ count: transactions.length, message: `Successfully parsed ${transactions.length} transactions from CSV.` });
      }
      
      return c.json({ count: 0, message: 'No file uploaded' }, 400);
  }
)

// --- Import OFX ---
app.openapi(
  createRoute({
    method: 'post',
    path: '/import/ofx',
    tags: ['Data Processing'],
    summary: 'Import transactions from OFX',
    request: {
        body: {
            content: {
                'multipart/form-data': {
                    schema: z.object({
                        file: z.instanceof(File)
                    })
                }
            }
        }
    },
    responses: {
      200: {
        description: 'Import result',
        content: { 'application/json': { schema: z.object({ count: z.number(), message: z.string() }) } }
      }
    }
  }),
  async (c) => {
      const body = await c.req.parseBody();
      const file = body['file'];

      if (file instanceof File) {
          const content = await file.text();
          const transactions = dataProcessingService.parseOFX(content);
          
          // TODO: Save transactions to DB
          
          return c.json({ count: transactions.length, message: `Successfully parsed ${transactions.length} transactions from OFX.` });
      }
      return c.json({ count: 0, message: 'No file uploaded' }, 400);
  }
)

// --- Export CSV ---
app.openapi(
  createRoute({
    method: 'get',
    path: '/export/csv',
    tags: ['Data Processing'],
    summary: 'Export transactions to CSV',
    responses: {
        200: { description: 'CSV File', content: { 'text/csv': { schema: z.string() } } }
    }
  }),
  async (c) => {
      // Mock Data
      const transactions = [
          { date: new Date(), description: 'Mock Expense', amount: 100, type: 'expense' },
          { date: new Date(), description: 'Mock Income', amount: 2000, type: 'income' }
      ];
      const csv = dataProcessingService.exportToCSV(transactions);
      
      c.header('Content-Type', 'text/csv');
      c.header('Content-Disposition', 'attachment; filename="transactions-export.csv"');
      return c.body(csv);
  }
)

// --- Export PDF ---
app.openapi(
  createRoute({
    method: 'get',
    path: '/export/pdf',
    tags: ['Data Processing'],
    summary: 'Export transactions report to PDF',
    responses: {
        200: { description: 'PDF File', content: { 'application/pdf': { schema: z.any() } } }
    }
  }),
  async (c) => {
      // Mock Data
      const transactions = [
          { date: new Date(), description: 'Mock Expense', amount: 100, type: 'expense' },
          { date: new Date(), description: 'Mock Income', amount: 2000, type: 'income' }
      ];
      const pdfBuffer = await dataProcessingService.exportToPDF(transactions, 'Janeiro 2025');
      
      c.header('Content-Type', 'application/pdf');
      c.header('Content-Disposition', 'attachment; filename="report.pdf"');
      return c.body(pdfBuffer);
  }
)

export default app

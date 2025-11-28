import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { InsightSchema, TransactionSchema, ChatSessionSchema, ChatMessageSchema, CreateChatSessionSchema, CreateChatMessageSchema } from '../schemas/resources'
import { IdParamsSchema } from '../schemas/common'
import { n8nService } from '../services/N8NService'

const app = new OpenAPIHono()

// --- Smart Entry ---
// ... (existing code)

// --- Chat Sessions Management ---

// List Sessions
app.openapi(
  createRoute({
    method: 'get',
    path: '/chat/sessions',
    tags: ['AI Chat'],
    summary: 'List chat sessions',
    responses: {
      200: { content: { 'application/json': { schema: z.array(ChatSessionSchema) } }, description: 'History' },
    },
  }),
  (c) => {
      return c.json([
          { id: '1', title: 'Análise de gastos Uber', updatedAt: new Date().toISOString() },
          { id: '2', title: 'Planejamento Viagem 2025', updatedAt: new Date().toISOString() }
      ])
  }
)

// Create Session
app.openapi(
  createRoute({
    method: 'post',
    path: '/chat/sessions',
    tags: ['AI Chat'],
    summary: 'Start new chat session',
    request: { body: { content: { 'application/json': { schema: CreateChatSessionSchema } } } },
    responses: {
      201: { content: { 'application/json': { schema: ChatSessionSchema } }, description: 'Session created' },
    },
  }),
  (c) => {
      return c.json({ 
          id: crypto.randomUUID(), 
          title: 'Nova Conversa', 
          updatedAt: new Date().toISOString() 
      }, 201)
  }
)

// List Messages
app.openapi(
  createRoute({
    method: 'get',
    path: '/chat/sessions/{id}/messages',
    tags: ['AI Chat'],
    summary: 'Get session messages',
    request: { params: IdParamsSchema },
    responses: {
      200: { content: { 'application/json': { schema: z.array(ChatMessageSchema) } }, description: 'Messages' },
    },
  }),
  (c) => {
      const sessionId = c.req.param('id')
      return c.json([
          { id: crypto.randomUUID(), sessionId, role: 'user', content: 'Olá', createdAt: new Date().toISOString() },
          { id: crypto.randomUUID(), sessionId, role: 'assistant', content: 'Olá! Como posso ajudar?', createdAt: new Date().toISOString() }
      ])
  }
)

// Send Message
app.openapi(
  createRoute({
    method: 'post',
    path: '/chat/sessions/{id}/messages',
    tags: ['AI Chat'],
    summary: 'Send message to session',
    request: { 
        params: IdParamsSchema,
        body: { content: { 'application/json': { schema: CreateChatMessageSchema } } } 
    },
    responses: {
      201: { content: { 'application/json': { schema: ChatMessageSchema } }, description: 'AI Response' },
    },
  }),
  async (c) => {
      const sessionId = c.req.param('id')
      const { content } = c.req.valid('json')
      
      // Call N8N Service
      const responseText = await n8nService.chat(content, { sessionId })
      
      return c.json({ 
          id: crypto.randomUUID(), 
          sessionId, 
          role: 'assistant', 
          content: responseText, 
          createdAt: new Date().toISOString() 
      }, 201)
  }
)

export default app
app.openapi(
  createRoute({
    method: 'post',
    path: '/smart-entry',
    tags: ['AI Features'],
    summary: 'Convert natural language to transaction data',
    request: {
        body: {
            content: { 'application/json': { schema: z.object({ text: z.string() }) } }
        }
    },
    responses: {
      200: {
        description: 'Parsed transaction',
        content: { 'application/json': { schema: z.object({ 
            description: z.string(),
            amount: z.number(),
            type: z.enum(['income', 'expense']),
            date: z.string(),
            categorySuggestion: z.string().optional()
        }) } }
      }
    }
  }),
  async (c) => {
      const { text } = c.req.valid('json')
      const result = await n8nService.parseSmartEntry(text)
      return c.json(result)
  }
)

// --- Get/Generate Insights ---
app.openapi(
  createRoute({
    method: 'post', // POST because it might trigger generation
    path: '/insights',
    tags: ['AI Features'],
    summary: 'Generate financial insights',
    responses: {
      200: { content: { 'application/json': { schema: z.array(InsightSchema) } }, description: 'List of insights' },
    },
  }),
  async (c) => {
      // In real scenario: fetch transaction summary from DB
      const mockSummary = { totalIncome: 5000, totalExpense: 3000 };
      
      const insights = await n8nService.generateInsights(mockSummary);
      
      // Add IDs and dates
      const enrichedInsights = insights.map(i => ({
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          isRead: false,
          ...i
      }));

      return c.json(enrichedInsights)
  }
)

// --- Chat ---
app.openapi(
  createRoute({
    method: 'post',
    path: '/chat',
    tags: ['AI Features'],
    summary: 'Chat with financial assistant',
    request: {
        body: { content: { 'application/json': { schema: z.object({ message: z.string() }) } } }
    },
    responses: {
      200: { content: { 'application/json': { schema: z.object({ response: z.string() }) } }, description: 'AI Response' }
    }
  }),
  async (c) => {
      const { message } = c.req.valid('json')
      const response = await n8nService.chat(message, {})
      return c.json({ response })
  }
)

export default app

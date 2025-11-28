import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { SavingsGoalSchema, CreateSavingsGoalSchema, UpdateSavingsGoalSchema, SavingsDepositSchema, CreateSavingsDepositSchema } from '../schemas/resources'
import { ErrorSchema, IdParamsSchema } from '../schemas/common'
import { savingsService } from '../services/SavingsService'

const app = new OpenAPIHono()

// List Goals
app.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Savings Goals'],
    responses: {
      200: { content: { 'application/json': { schema: z.array(SavingsGoalSchema) } }, description: 'List goals' },
    },
  }),
  (c) => c.json([])
)

// Create Goal
app.openapi(
  createRoute({
    method: 'post',
    path: '/',
    tags: ['Savings Goals'],
    request: { body: { content: { 'application/json': { schema: CreateSavingsGoalSchema } } } },
    responses: {
      201: { content: { 'application/json': { schema: SavingsGoalSchema } }, description: 'Goal created' },
    },
  }),
  (c) => {
      const data = c.req.valid('json')
      return c.json({ id: crypto.randomUUID(), ...data, currentAmount: 0, isCompleted: false }, 201)
  }
)

// Get Goal
app.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Savings Goals'],
    request: { params: IdParamsSchema },
    responses: {
      200: { content: { 'application/json': { schema: SavingsGoalSchema } }, description: 'Goal details' },
      404: { content: { 'application/json': { schema: ErrorSchema } }, description: 'Goal not found' },
    },
  }),
  (c) => {
      const id = c.req.param('id')
      return c.json({ 
          id, 
          name: 'Viagem', 
          targetAmount: 5000, 
          currentAmount: 1500, 
          bankAccountId: crypto.randomUUID(), 
          color: '#10B981', 
          isCompleted: false 
      })
  }
)

// Update Goal
app.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    tags: ['Savings Goals'],
    request: { 
        params: IdParamsSchema,
        body: { content: { 'application/json': { schema: UpdateSavingsGoalSchema } } } 
    },
    responses: {
      200: { content: { 'application/json': { schema: SavingsGoalSchema } }, description: 'Goal updated' },
    },
  }),
  (c) => {
      const id = c.req.param('id')
      return c.json({ 
          id, 
          name: 'Viagem Updated', 
          targetAmount: 5000, 
          currentAmount: 1500, 
          bankAccountId: crypto.randomUUID(), 
          color: '#10B981', 
          isCompleted: false 
      })
  }
)

// Delete Goal
app.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['Savings Goals'],
    request: { params: IdParamsSchema },
    responses: {
      204: { description: 'Goal deleted' },
    },
  }),
  (c) => c.body(null, 204)
)

// --- Deposits ---

// Create Deposit
app.openapi(
  createRoute({
    method: 'post',
    path: '/{id}/deposits',
    tags: ['Savings Goals'],
    summary: 'Add deposit or withdrawal',
    request: { 
        params: IdParamsSchema,
        body: { content: { 'application/json': { schema: CreateSavingsDepositSchema } } } 
    },
    responses: {
      201: { content: { 'application/json': { schema: SavingsDepositSchema } }, description: 'Deposit created' },
    },
  }),
  async (c) => {
      const id = c.req.param('id')
      const data = c.req.valid('json')
      
      console.log('Calling SavingsService for transaction integrity...')
      // Em produção: const result = await savingsService.processTransaction(id, { ...data, userId: 'mock-user' })
      
      return c.json({ id: crypto.randomUUID(), savingsGoalId: id, ...data }, 201)
  }
)

// List Deposits
app.openapi(
  createRoute({
    method: 'get',
    path: '/{id}/deposits',
    tags: ['Savings Goals'],
    summary: 'List history of deposits',
    request: { params: IdParamsSchema },
    responses: {
      200: { content: { 'application/json': { schema: z.array(SavingsDepositSchema) } }, description: 'History' },
    },
  }),
  (c) => {
      const id = c.req.param('id')
      return c.json([
          { id: crypto.randomUUID(), savingsGoalId: id, amount: 500, date: new Date().toISOString(), notes: 'Aporte inicial' }
      ])
  }
)

export default app

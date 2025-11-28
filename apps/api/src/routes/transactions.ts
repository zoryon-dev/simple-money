import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { TransactionSchema, CreateTransactionSchema, UpdateTransactionSchema } from '../schemas/resources'
import { ErrorSchema, IdParamsSchema } from '../schemas/common'

const app = new OpenAPIHono()

// List with filters
app.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Transactions'],
    summary: 'List transactions',
    request: {
        query: z.object({
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            accountId: z.string().optional(),
            type: z.enum(['income', 'expense']).optional()
        })
    },
    responses: {
      200: {
        content: { 'application/json': { schema: z.array(TransactionSchema) } },
        description: 'List of transactions',
      },
    },
  }),
  (c) => {
    return c.json([])
  }
)

// Create
app.openapi(
  createRoute({
    method: 'post',
    path: '/',
    tags: ['Transactions'],
    summary: 'Create transaction',
    request: {
      body: { content: { 'application/json': { schema: CreateTransactionSchema } } },
    },
    responses: {
      201: {
        content: { 'application/json': { schema: TransactionSchema } },
        description: 'Transaction created',
      },
    },
  }),
  (c) => {
    const data = c.req.valid('json')
    return c.json({ id: crypto.randomUUID(), ...data }, 201)
  }
)

// Delete
app.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['Transactions'],
    request: { params: IdParamsSchema },
    responses: {
      204: { description: 'Transaction deleted' },
    },
  }),
  (c) => {
    return c.body(null, 204)
  }
)

export default app

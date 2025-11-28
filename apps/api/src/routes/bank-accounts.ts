import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { BankAccountSchema, CreateBankAccountSchema, UpdateBankAccountSchema } from '../schemas/resources'
import { ErrorSchema, IdParamsSchema } from '../schemas/common'

const app = new OpenAPIHono()

// List
app.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Bank Accounts'],
    summary: 'List all bank accounts',
    responses: {
      200: {
        content: { 'application/json': { schema: z.array(BankAccountSchema) } },
        description: 'List of bank accounts',
      },
    },
  }),
  (c) => {
    // Mock implementation
    return c.json([
      { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Nubank', type: 'checking', color: '#820ad1', currentBalance: 1250.50, isActive: true }
    ])
  }
)

// Create
app.openapi(
  createRoute({
    method: 'post',
    path: '/',
    tags: ['Bank Accounts'],
    summary: 'Create a new bank account',
    request: {
      body: { content: { 'application/json': { schema: CreateBankAccountSchema } } },
    },
    responses: {
      201: {
        content: { 'application/json': { schema: BankAccountSchema } },
        description: 'Account created',
      },
    },
  }),
  (c) => {
    const data = c.req.valid('json')
    return c.json({ id: crypto.randomUUID(), ...data, isActive: true }, 201)
  }
)

// Get One
app.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Bank Accounts'],
    request: { params: IdParamsSchema },
    responses: {
      200: { content: { 'application/json': { schema: BankAccountSchema } }, description: 'Account details' },
      404: { content: { 'application/json': { schema: ErrorSchema } }, description: 'Account not found' },
    },
  }),
  (c) => {
    return c.json({ id: c.req.param('id'), name: 'Nubank', type: 'checking', color: '#820ad1', currentBalance: 1250.50, isActive: true })
  }
)

// Update
app.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    tags: ['Bank Accounts'],
    request: {
        params: IdParamsSchema,
        body: { content: { 'application/json': { schema: UpdateBankAccountSchema } } }
    },
    responses: {
      200: { content: { 'application/json': { schema: BankAccountSchema } }, description: 'Account updated' },
    },
  }),
  (c) => {
    return c.json({ id: c.req.param('id'), name: 'Updated', type: 'checking', color: '#000', currentBalance: 0, isActive: true })
  }
)

// Delete
app.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['Bank Accounts'],
    request: { params: IdParamsSchema },
    responses: {
      204: { description: 'Account deleted' },
    },
  }),
  (c) => {
    return c.body(null, 204)
  }
)

export default app

import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { CategorySchema, CreateCategorySchema } from '../schemas/resources'

const app = new OpenAPIHono()

app.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Categories'],
    responses: {
      200: { content: { 'application/json': { schema: z.array(CategorySchema) } }, description: 'List categories' },
    },
  }),
  (c) => c.json([])
)

app.openapi(
  createRoute({
    method: 'post',
    path: '/',
    tags: ['Categories'],
    request: { body: { content: { 'application/json': { schema: CreateCategorySchema } } } },
    responses: {
      201: { content: { 'application/json': { schema: CategorySchema } }, description: 'Category created' },
    },
  }),
  (c) => {
      const data = c.req.valid('json')
      return c.json({ id: crypto.randomUUID(), ...data, isActive: true }, 201)
  }
)

export default app

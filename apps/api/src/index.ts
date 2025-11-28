import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'

// Routes
import bankAccounts from './routes/bank-accounts'
import transactions from './routes/transactions'
import categories from './routes/categories'
import savings from './routes/savings'
import system from './routes/system'
import data from './routes/data'
import ai from './routes/ai'

const app = new OpenAPIHono()

app.use('/*', cors())

// --- Configuração da Documentação OpenAPI ---
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Simple Money API',
    description: 'API segura e escalável para gestão financeira multi-tenant.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local Server',
    },
  ],
  security: [
    {
      BearerAuth: [],
    },
  ],
})

// Adiciona o componente de segurança globalmente na doc
app.openAPIRegistry.registerComponent('securitySchemes', 'BearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
})

// Rota para Visualizar a Documentação (Swagger UI)
app.get('/api-docs', swaggerUI({ url: '/doc' }))

// Register Module Routes
app.route('/v1/accounts', bankAccounts)
app.route('/v1/transactions', transactions)
app.route('/v1/categories', categories)
app.route('/v1/savings', savings)
app.route('/v1/system', system)
app.route('/v1/data', data)
app.route('/v1/ai', ai)

// --- Exemplo de Rota Segura ---
const ProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
})

const getProfileRoute = createRoute({
  method: 'get',
  path: '/v1/profile',
  security: [{ BearerAuth: [] }],
  tags: ['Profile'],
  description: 'Retorna os dados do perfil do usuário autenticado.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ProfileSchema,
        },
      },
      description: 'Dados do perfil recuperados com sucesso.',
    },
    401: {
      description: 'Não autorizado.',
    },
  },
})

app.openapi(getProfileRoute, (c) => {
  // Lógica fictícia - aqui entrará a validação do Token e consulta ao Supabase
  return c.json({
    id: 'user_123',
    name: 'Jonas Doe',
    email: 'jonas@example.com',
  })
})

const port = 3000
console.log(`Server is running on port ${port}`)
console.log(`Documentation available at http://localhost:${port}/api-docs`)

serve({
  fetch: app.fetch,
  port
})

export default app

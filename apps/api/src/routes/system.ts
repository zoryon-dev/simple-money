import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { recurrenceService } from '../services/RecurrenceService'

const app = new OpenAPIHono()

app.openapi(
  createRoute({
    method: 'post',
    path: '/process-recurrences',
    tags: ['System'],
    summary: 'Trigger recurrence processing',
    description: 'Manual trigger to process pending recurring transactions. Usually called by a cron job.',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({
              processed: z.boolean(),
              generatedCount: z.number(),
              message: z.string()
            })
          }
        },
        description: 'Processing result'
      }
    }
  }),
  async (c) => {
      // Mock user ID - in prod would be all users or specific user
      const userId = 'user_123'; 
      
      const transactions = await recurrenceService.processUserRecurrences(userId);
      
      return c.json({
          processed: true,
          generatedCount: transactions.length,
          message: `Successfully processed recurrences. Generated ${transactions.length} transactions.`
      })
  }
)

export default app

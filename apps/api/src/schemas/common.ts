import { z } from 'zod'

export const ErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
})

export const IdParamsSchema = z.object({
  id: z.string().uuid().openapi({
    param: {
      name: 'id',
      in: 'path',
    },
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
})

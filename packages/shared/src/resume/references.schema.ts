import { z } from 'zod'

export const ReferenceSchema = z.object({
  name: z.string(),
  reference: z.string(),
})

export type Reference = z.infer<typeof ReferenceSchema>

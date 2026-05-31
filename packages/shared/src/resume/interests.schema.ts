import { z } from 'zod'

export const InterestSchema = z.object({
  name: z.string(),
  keywords: z.array(z.string()).default([]),
})

export type Interest = z.infer<typeof InterestSchema>

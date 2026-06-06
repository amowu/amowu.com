import { z } from 'zod'

export const AwardSchema = z.object({
  title: z.string(),
  date: z.string().optional(),
  awarder: z.string().optional(),
  summary: z.string().optional(),
})

export type Award = z.infer<typeof AwardSchema>

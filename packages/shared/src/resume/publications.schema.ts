import { z } from 'zod'

export const PublicationSchema = z.object({
  name: z.string(),
  publisher: z.string().optional(),
  releaseDate: z.string().optional(),
  url: z.string().url().optional(),
  summary: z.string().optional(),
})

export type Publication = z.infer<typeof PublicationSchema>

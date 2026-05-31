import { z } from 'zod'

export const LanguageSchema = z.object({
  language: z.string(),
  fluency: z.string().optional(),
})

export type Language = z.infer<typeof LanguageSchema>

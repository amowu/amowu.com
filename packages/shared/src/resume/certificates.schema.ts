import { z } from 'zod'

export const CertificateSchema = z.object({
  name: z.string(),
  date: z.string().optional(),
  issuer: z.string().optional(),
  url: z.string().url().optional(),
})

export type Certificate = z.infer<typeof CertificateSchema>

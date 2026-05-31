import { z } from 'zod'

export const EnvSchema = z.object({
  PORT: z.coerce.number().default(8080),
  AWS_REGION: z.string(),
  DDB_TABLE_NAME: z.string(),
  DDB_ENDPOINT: z.string().url().optional(),
  CORS_ORIGIN: z.string(),
})

export type Env = z.infer<typeof EnvSchema>

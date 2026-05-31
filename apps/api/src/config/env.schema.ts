import { z } from 'zod'

export const EnvSchema = z.object({
  PORT: z.coerce.number().default(8080),
  AWS_REGION: z.string().default('us-east-1'),
  DDB_TABLE_NAME: z.string().default('resume-local'),
  DDB_ENDPOINT: z.string().url().optional(),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
})

export type Env = z.infer<typeof EnvSchema>

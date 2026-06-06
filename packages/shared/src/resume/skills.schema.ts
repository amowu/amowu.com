import { z } from 'zod'

export const SkillSchema = z.object({
  name: z.string(),
  level: z.string().optional(),
  keywords: z.array(z.string()).default([]),
})

export type Skill = z.infer<typeof SkillSchema>

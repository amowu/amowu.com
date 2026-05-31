import { z } from 'zod'

export const VolunteerSchema = z.object({
  organization: z.string(),
  position: z.string(),
  url: z.string().url().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).default([]),
})

export type Volunteer = z.infer<typeof VolunteerSchema>

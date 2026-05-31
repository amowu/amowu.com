import { z } from 'zod'

export const EducationSchema = z.object({
  institution: z.string(),
  url: z.string().url().optional(),
  area: z.string(),
  studyType: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  score: z.string().optional(),
  courses: z.array(z.string()).default([]),
})

export type Education = z.infer<typeof EducationSchema>

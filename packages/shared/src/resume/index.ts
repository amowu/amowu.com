import { z } from 'zod'
import { BasicsSchema } from './basics.schema'
import { WorkSchema } from './work.schema'
import { VolunteerSchema } from './volunteer.schema'
import { EducationSchema } from './education.schema'
import { AwardSchema } from './awards.schema'
import { CertificateSchema } from './certificates.schema'
import { PublicationSchema } from './publications.schema'
import { SkillSchema } from './skills.schema'
import { LanguageSchema } from './languages.schema'
import { InterestSchema } from './interests.schema'
import { ReferenceSchema } from './references.schema'
import { ProjectSchema } from './projects.schema'

export const ResumeSchema = z.object({
  $schema: z.string().optional(),
  basics: BasicsSchema,
  work: z.array(WorkSchema).default([]),
  volunteer: z.array(VolunteerSchema).default([]),
  education: z.array(EducationSchema).default([]),
  awards: z.array(AwardSchema).default([]),
  certificates: z.array(CertificateSchema).default([]),
  publications: z.array(PublicationSchema).default([]),
  skills: z.array(SkillSchema).default([]),
  languages: z.array(LanguageSchema).default([]),
  interests: z.array(InterestSchema).default([]),
  references: z.array(ReferenceSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
})

export type Resume = z.infer<typeof ResumeSchema>

export * from './basics.schema'
export * from './work.schema'
export * from './volunteer.schema'
export * from './education.schema'
export * from './awards.schema'
export * from './certificates.schema'
export * from './publications.schema'
export * from './skills.schema'
export * from './languages.schema'
export * from './interests.schema'
export * from './references.schema'
export * from './projects.schema'

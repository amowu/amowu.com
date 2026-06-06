import { describe, it, expect } from 'vitest'
import { ResumeSchema, type Resume } from '../src/resume'

const minimalValid = {
  basics: {
    name: 'Amo Wu',
    email: 'amowu@hahow.in',
  },
}

const fullValid = {
  $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/master/schema.json',
  basics: {
    name: 'Amo Wu',
    label: 'Software Engineer',
    email: 'amowu@hahow.in',
    summary: 'Builder.',
    location: { city: 'Taipei', countryCode: 'TW' },
    profiles: [
      { network: 'GitHub', url: 'https://github.com/amowu' },
    ],
  },
  work: [
    {
      name: 'Hahow',
      position: 'Software Engineer',
      startDate: '2020-01',
      highlights: ['Shipped X', 'Migrated Y'],
    },
  ],
  education: [
    {
      institution: 'NTU',
      area: 'CS',
      studyType: 'Bachelor',
      startDate: '2010-09',
      endDate: '2014-06',
    },
  ],
  skills: [
    { name: 'Frontend', keywords: ['TypeScript', 'React'] },
  ],
  projects: [
    {
      name: 'amowu.com',
      description: 'Personal site',
      keywords: ['React', 'Phaser', 'CDK'],
    },
  ],
}

describe('ResumeSchema (JSON Resume v1)', () => {
  it('accepts minimal valid (basics only)', () => {
    expect(() => ResumeSchema.parse(minimalValid)).not.toThrow()
  })

  it('accepts full valid with many sections', () => {
    expect(() => ResumeSchema.parse(fullValid)).not.toThrow()
  })

  it('defaults empty arrays for unfilled sections', () => {
    const parsed: Resume = ResumeSchema.parse(minimalValid)
    expect(parsed.work).toEqual([])
    expect(parsed.education).toEqual([])
    expect(parsed.awards).toEqual([])
    expect(parsed.projects).toEqual([])
  })

  it('rejects missing basics.name', () => {
    const noName = { basics: { email: 'a@b.c' } }
    expect(() => ResumeSchema.parse(noName)).toThrow()
  })

  it('rejects invalid email', () => {
    const badEmail = { basics: { name: 'X', email: 'not-an-email' } }
    expect(() => ResumeSchema.parse(badEmail)).toThrow()
  })

  it('rejects work entry missing required fields', () => {
    const badWork = {
      basics: { name: 'X', email: 'a@b.c' },
      work: [{ name: 'Co' }],
    }
    expect(() => ResumeSchema.parse(badWork)).toThrow()
  })

  it('rejects profile with invalid url', () => {
    const badProfile = {
      basics: {
        name: 'X',
        email: 'a@b.c',
        profiles: [{ network: 'GitHub', url: 'not-a-url' }],
      },
    }
    expect(() => ResumeSchema.parse(badProfile)).toThrow()
  })
})
